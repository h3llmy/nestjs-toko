import { TestBed } from '@automock/jest';
import { AuthService } from './auth.service';
import { EncryptionService } from '@app/encryption';
import { MailerService } from '@nestjs-modules/mailer';
import { RandomizeService } from '@app/randomize';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthTokenService } from './authToken.service';
import { ILoginTokenPayload } from './auth.interface';
import { Role } from '../roles/entities/role.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersServices: jest.Mocked<UsersService>;
  let configService: jest.Mocked<ConfigService>;
  let authTokenService: jest.Mocked<AuthTokenService>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let mailerService: jest.Mocked<MailerService>;
  let randomizeService: jest.Mocked<RandomizeService>;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const userMock: User = {
    id: '1',
    username: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerifiedAt: Date.now(),
    password: 'some hashed password',
    role: mockRole,
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    authService = unit;
    usersServices = unitRef.get(UsersService);
    encryptionService = unitRef.get(EncryptionService);
    mailerService = unitRef.get(MailerService);
    authTokenService = unitRef.get(AuthTokenService);
    randomizeService = unitRef.get(RandomizeService);
    configService = unitRef.get(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersServices).toBeDefined();
    expect(encryptionService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(randomizeService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and send a confirmation email', async () => {
      const jwtMock = 'some jwt token';

      const webUrl = configService.getOrThrow<string>('WEB_URL');
      const webVerifyRoute =
        configService.getOrThrow<string>('WEB_VERIFY_ROUTE');
      const confirmationLink = `${webUrl}/${webVerifyRoute}/${jwtMock}`;

      usersServices.register.mockResolvedValue(userMock);
      authTokenService.generateRegisterToken.mockReturnValue(jwtMock);
      mailerService.sendMail.mockResolvedValue(null);

      const user = await authService.register({
        email: 'testing@example.com',
        username: 'test',
        password: 'test',
        confirmPassword: 'test',
      });

      expect(user).toEqual({ message: 'Registration Success' });
      expect(usersServices.register).toHaveBeenCalled();
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        template: 'auth/views/email/register',
        to: 'testing@example.com',
        subject: 'Registration Email',
        context: {
          confirmationLink,
          user: userMock,
        },
      });
    });

    it('should reject duplicate user', async () => {
      const mockEmail = 'test@example.com';
      usersServices.register.mockRejectedValue(
        new BadRequestException(`email ${mockEmail} is already in use`),
      );

      await expect(
        authService.register({
          email: mockEmail,
          username: 'test',
          password: 'test',
          confirmPassword: 'test',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(usersServices.register).toHaveBeenCalled();
      expect(mailerService.sendMail).not.toHaveBeenCalled();
      expect(authTokenService.generateRegisterToken).not.toHaveBeenCalled();
    });
  });

  describe('resendEmail', () => {
    it('should send a confirmation email', async () => {
      const mockEmail = 'test@example.com';
      const webUrl = configService.getOrThrow<string>('WEB_URL');
      const webVerifyRoute =
        configService.getOrThrow<string>('WEB_VERIFY_ROUTE');
      const confirmationLink = `${webUrl}/${webVerifyRoute}/${mockEmail}`;
      usersServices.findOneByEmail.mockResolvedValue({
        ...userMock,
        emailVerifiedAt: null,
      });
      mailerService.sendMail.mockResolvedValue(null);
      authTokenService.generateRegisterToken.mockReturnValue(mockEmail);

      await authService.resendEmail({ email: mockEmail });

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        template: 'auth/views/email/register',
        to: mockEmail,
        subject: 'Registration Email',
        context: {
          confirmationLink,
          user: { ...userMock, emailVerifiedAt: null },
        },
      });
    });

    it('should throw an error if the user is not found', async () => {
      const mockEmail = 'test@example.com';
      usersServices.findOneByEmail.mockResolvedValue(null);
      authTokenService.generateRegisterToken.mockReturnValue(mockEmail);

      await expect(
        authService.resendEmail({ email: mockEmail }),
      ).rejects.toThrow(NotFoundException);

      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is already verified', async () => {
      const mockEmail = 'test@example.com';
      usersServices.findOneByEmail.mockResolvedValue({
        ...userMock,
        emailVerifiedAt: Date.now(),
      });
      authTokenService.generateRegisterToken.mockReturnValue(mockEmail);

      await expect(
        authService.resendEmail({ email: mockEmail }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should authenticate a user and return tokens', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'test',
      };

      usersServices.findOneByEmail.mockResolvedValue(userMock);
      encryptionService.match.mockReturnValue(true);
      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      const tokens = await authService.login(loginDto);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(usersServices.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(encryptionService.match).toHaveBeenCalledWith(
        loginDto.password,
        userMock.password,
      );
    });

    it('should throw an error if the credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      usersServices.findOneByEmail.mockResolvedValue(userMock);
      encryptionService.match.mockReturnValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(usersServices.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(encryptionService.match).toHaveBeenCalledWith(
        loginDto.password,
        userMock.password,
      );
      expect(authTokenService.createLoginToken).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is not verified', async () => {
      const unverifiedUser = { ...userMock, emailVerifiedAt: null };
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'test',
      };

      usersServices.findOneByEmail.mockResolvedValue(unverifiedUser);
      encryptionService.match.mockReturnValue(true);

      await expect(authService.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(usersServices.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(encryptionService.match).toHaveBeenCalledWith(
        loginDto.password,
        unverifiedUser.password,
      );
      expect(authTokenService.createLoginToken).not.toHaveBeenCalled();
    });
  });

  describe('forgetPassword', () => {
    it('should initiate the password reset process and send an email', async () => {
      const jwtMock = 'some jwt token';
      const webUrl = configService.getOrThrow<string>('WEB_URL');
      const forgetPasswordRoute = configService.getOrThrow<string>(
        'WEB_FORGET_PASSWORD_ROUTE',
      );
      const redirectLink = `${webUrl}/${forgetPasswordRoute}/${jwtMock}`;
      usersServices.findOneByEmail.mockResolvedValue(userMock);
      authTokenService.generateForgetPasswordToken.mockReturnValue(jwtMock);
      mailerService.sendMail.mockResolvedValue(null);
      const result = await authService.forgetPassword({
        email: 'test@example.com',
      });
      expect(result).toEqual({ message: 'Email Sended' });
      expect(usersServices.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(authTokenService.generateForgetPasswordToken).toHaveBeenCalled();
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Reset Password',
        context: {
          redirectLink,
          user: userMock,
        },
        template: 'auth/views/email/forget-password',
      });
    });
  });

  describe('resetPassword', () => {
    it("should reset the user's password", async () => {
      const jwtMock = 'some jwt token';
      const resetPasswordDto: ResetPasswordDto = {
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      authTokenService.verifyForgetPasswordToken.mockReturnValue({ id: '1' });

      const result = await authService.resetPassword(jwtMock, resetPasswordDto);

      expect(result).toEqual({ message: 'Password has been updated' });
      expect(authTokenService.verifyForgetPasswordToken).toHaveBeenCalled();
      expect(usersServices.update).toHaveBeenCalledWith(
        '1',
        { password: resetPasswordDto.password },
        'Fail to update Password',
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh the access token', async () => {
      const jwtMock = 'some jwt token';
      const verifyPayload: ILoginTokenPayload = {
        id: '1',
        email: 'test@example.com',
        username: 'test',
      };
      const refreshTokenDto: RefreshTokenDto = { refreshToken: jwtMock };

      authTokenService.verifyRefreshToken.mockReturnValue(verifyPayload);

      usersServices.findOne.mockResolvedValue(userMock);

      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      const tokens = await authService.refreshToken(refreshTokenDto);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(authTokenService.verifyRefreshToken).toHaveBeenCalled();
      expect(usersServices.findOne).toHaveBeenCalledWith('1');
    });
  });
});
