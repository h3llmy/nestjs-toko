import { TestBed } from '@automock/jest';
import { User } from '../../users/entities/user.entity';
import { BasicAuthController } from './basic-auth.controller';
import { BasicAuthService } from './basic-auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BadRequestException } from '@nestjs/common';
import { Role } from '@domains/roles/entities/role.entity';
import { MailService } from '@domains/mail/mail.service';
import { AuthTokenService } from '@libs/auth-token';
import { UsersService } from '@domains/users/users.service';

describe('BasicAuthController', () => {
  let authController: BasicAuthController;
  let basicAuthService: jest.Mocked<BasicAuthService>;
  let userService: jest.Mocked<UsersService>;
  let authTokenService: jest.Mocked<AuthTokenService>;
  let mailService: jest.Mocked<MailService>;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockUser: User = {
    id: '1',
    username: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerifiedAt: Date.now(),
    password: 'some hashed password',
    role: mockRole,
  };

  const mockRegisterUserDto: RegisterUserDto = {
    username: 'Test User',
    email: 'test@example.com',
    password: 'some password',
    confirmPassword: 'some password',
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(BasicAuthController).compile();

    authController = unit;
    basicAuthService = unitRef.get(BasicAuthService);
    userService = unitRef.get(UsersService);
    authTokenService = unitRef.get(AuthTokenService);
    mailService = unitRef.get(MailService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(basicAuthService).toBeDefined();
    expect(userService).toBeDefined();
    expect(authTokenService).toBeDefined();
    expect(mailService).toBeDefined();
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(authController.register).toBeDefined();
    });

    it('should register a new user', async () => {
      userService.register.mockResolvedValue(mockUser);
      authTokenService.generateRegisterToken.mockReturnValue('token');
      mailService.sendRegisterMail.mockResolvedValue(null);

      const user = await authController.register(mockRegisterUserDto);

      expect(user).toEqual({ message: 'Registration Success' });
      expect(userService.register).toHaveBeenCalledWith(mockRegisterUserDto);
      expect(authTokenService.generateRegisterToken).toHaveBeenCalledWith({
        id: mockUser.id,
      });
      expect(mailService.sendRegisterMail).toHaveBeenCalledWith(
        mockUser,
        'token',
      );
    });

    it('should throw an error if user already exists', async () => {
      userService.register.mockRejectedValue(
        new BadRequestException(
          `email ${mockRegisterUserDto.email} is already in use`,
        ),
      );

      await expect(
        authController.register(mockRegisterUserDto),
      ).rejects.toThrow(BadRequestException);

      expect(userService.register).toHaveBeenCalledWith(mockRegisterUserDto);
      expect(authTokenService.generateRegisterToken).not.toHaveBeenCalled();
      expect(mailService.sendRegisterMail).not.toHaveBeenCalled();
    });
  });

  describe('resendEmail', () => {
    it('should be defined', () => {
      expect(authController.resendEmail).toBeDefined();
    });

    it('should resend an email', async () => {
      basicAuthService.resendEmail.mockResolvedValue(mockUser);
      authTokenService.generateRegisterToken.mockReturnValue('token');
      mailService.sendRegisterMail.mockResolvedValue(null);

      const user = await authController.resendEmail({
        email: mockRegisterUserDto.email,
      });

      expect(user).toEqual({ message: 'Resend email success' });
      expect(basicAuthService.resendEmail).toHaveBeenCalledWith({
        email: mockRegisterUserDto.email,
      });
      expect(authTokenService.generateRegisterToken).toHaveBeenCalledWith({
        id: mockUser.id,
      });
      expect(mailService.sendRegisterMail).toHaveBeenCalledWith(
        mockUser,
        'token',
      );
    });

    it('should throw an error if user already exists', async () => {
      basicAuthService.resendEmail.mockRejectedValue(
        new BadRequestException(
          `email ${mockRegisterUserDto.email} is already in use`,
        ),
      );

      await expect(
        authController.resendEmail({ email: mockRegisterUserDto.email }),
      ).rejects.toThrow(BadRequestException);
      expect(authTokenService.generateRegisterToken).not.toHaveBeenCalled();
      expect(mailService.sendRegisterMail).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should be defined', () => {
      expect(authController.verifyEmail).toBeDefined();
    });

    it('should verify the user email', async () => {
      authTokenService.verifyRegisterToken.mockReturnValue({ id: mockUser.id });
      basicAuthService.verifyEmail.mockResolvedValue(mockUser);
      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      const user = await authController.verifyEmail('some token');

      expect(user).toEqual({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      expect(authTokenService.verifyRegisterToken).toHaveBeenCalledWith(
        'some token',
      );
      expect(basicAuthService.verifyEmail).toHaveBeenCalledWith({
        id: mockUser.id,
      });
      expect(authTokenService.createLoginToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if token is invalid', async () => {
      basicAuthService.verifyEmail.mockRejectedValue(
        new BadRequestException('User already verified'),
      );

      await expect(authController.verifyEmail('some token')).rejects.toThrow(
        BadRequestException,
      );
      expect(authTokenService.verifyRegisterToken).toHaveBeenCalledWith(
        'some token',
      );
      expect(authTokenService.createLoginToken).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(authController.login).toBeDefined();
    });

    it('should login a user', async () => {
      basicAuthService.login.mockResolvedValue(mockUser);
      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      const user = await authController.login(mockRegisterUserDto);
      expect(user).toEqual({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });
      expect(basicAuthService.login).toHaveBeenCalledWith(mockRegisterUserDto);
      expect(authTokenService.createLoginToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if user not found', async () => {
      basicAuthService.login.mockRejectedValue(
        new BadRequestException('invalid credentials'),
      );
      await expect(authController.login(mockRegisterUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(basicAuthService.login).toHaveBeenCalledWith(mockRegisterUserDto);
      expect(authTokenService.createLoginToken).not.toHaveBeenCalled();
    });
  });

  describe('forgetPassword', () => {
    it('should be defined', () => {
      expect(authController.forgetPassword).toBeDefined();
    });

    it('should forget password', async () => {
      basicAuthService.forgetPassword.mockResolvedValue(mockUser);
      authTokenService.generateForgetPasswordToken.mockReturnValue('token');
      mailService.sendForgetPasswordMail.mockResolvedValue(null);

      const user = await authController.forgetPassword(mockUser);

      expect(user).toEqual({ message: 'Email sent successfully' });
      expect(basicAuthService.forgetPassword).toHaveBeenCalledWith(mockUser);
      expect(authTokenService.generateForgetPasswordToken).toHaveBeenCalledWith(
        { id: mockUser.id },
      );
      expect(mailService.sendForgetPasswordMail).toHaveBeenCalledWith(
        mockUser,
        'token',
      );
    });

    it('should throw an error if user not found', async () => {
      basicAuthService.forgetPassword.mockRejectedValue(
        new BadRequestException('invalid credentials'),
      );
      await expect(authController.forgetPassword(mockUser)).rejects.toThrow(
        BadRequestException,
      );
      expect(basicAuthService.forgetPassword).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('resetPassword', () => {
    it('should be defined', () => {
      expect(authController.resetPassword).toBeDefined();
    });

    it('should reset password', async () => {
      authTokenService.verifyForgetPasswordToken.mockReturnValue({
        id: mockUser.id,
      });
      userService.update.mockResolvedValue(mockUser);

      const user = await authController.resetPassword('some token', {
        password: 'some password',
        confirmPassword: 'some password',
      });
      expect(user).toEqual({ message: 'Password has been updated' });
    });
  });

  describe('refreshToken', () => {
    it('should be defined', () => {
      expect(authController.refreshToken).toBeDefined();
    });

    it('should refresh token', async () => {
      authTokenService.verifyRefreshToken.mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
      basicAuthService.checkRefreshTokenCredential.mockResolvedValue(mockUser);
      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      const user = await authController.refreshToken({
        refreshToken: 'some refresh token',
      });
      expect(user).toEqual({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });
      expect(basicAuthService.checkRefreshTokenCredential).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      );
      expect(authTokenService.createLoginToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if token is invalid', async () => {
      authTokenService.verifyRefreshToken.mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
      basicAuthService.checkRefreshTokenCredential.mockRejectedValue(
        new BadRequestException('invalid token'),
      );
      await expect(
        authController.refreshToken({
          refreshToken: 'some refresh token',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(basicAuthService.checkRefreshTokenCredential).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      );
      expect(authTokenService.createLoginToken).not.toHaveBeenCalled();
    });
  });
});
