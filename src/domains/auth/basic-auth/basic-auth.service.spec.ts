import { TestBed } from '@automock/jest';
import { BasicAuthService } from './basic-auth.service';
import { EncryptionService } from '@libs/encryption';
import { MailerService } from '@nestjs-modules/mailer';
import { RandomizeService } from '@libs/randomize';
import { UsersService } from '@domains/users/users.service';
import { User } from '@domains/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { AuthTokenService } from '@libs/auth-token';
import { Role } from '@domains/roles/entities/role.entity';
import { SocialAuthType } from '../social-auth.enum';
import { SocialAuthResponse } from '../social-auth.abstract';

describe('BasicAuthService', () => {
  let authService: BasicAuthService;
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
    const { unit, unitRef } = TestBed.create(BasicAuthService).compile();

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

  describe('resendEmail', () => {
    it('should send a confirmation email', async () => {
      const mockEmail = 'test@example.com';
      usersServices.findOneByEmail.mockResolvedValue({
        ...userMock,
        emailVerifiedAt: null,
      });

      const user = await authService.resendEmail({ email: mockEmail });

      expect(user).toEqual({ ...userMock, emailVerifiedAt: null });
    });

    it('should throw an error if the user is not found', async () => {
      const mockEmail = 'test@example.com';
      usersServices.findOneByEmail.mockResolvedValue(null);

      await expect(
        authService.resendEmail({ email: mockEmail }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the user is already verified', async () => {
      const mockEmail = 'test@example.com';
      usersServices.findOneByEmail.mockResolvedValue({
        ...userMock,
        emailVerifiedAt: Date.now(),
      });

      await expect(
        authService.resendEmail({ email: mockEmail }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify the user email', async () => {
      authTokenService.verifyRegisterToken.mockReturnValue(userMock);
      usersServices.findOne.mockResolvedValue({
        ...userMock,
        emailVerifiedAt: null,
      });

      usersServices.update.mockResolvedValue(userMock);

      const user = await authService.verifyEmail({ id: userMock.id });
      expect(user).toEqual(userMock);

      expect(usersServices.findOne).toHaveBeenCalledWith(userMock.id);
      expect(usersServices.update).toHaveBeenCalledWith(userMock.id, {
        emailVerifiedAt: expect.any(Number),
      });
    });

    it('should throw an error if the user is not found', async () => {
      usersServices.findOne.mockResolvedValue(null);

      usersServices.update.mockResolvedValue(userMock);

      await expect(
        authService.verifyEmail({ id: userMock.id }),
      ).rejects.toThrow(NotFoundException);

      expect(usersServices.findOne).toHaveBeenCalledWith(userMock.id);
      expect(usersServices.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is already verified', async () => {
      usersServices.findOne.mockResolvedValue(userMock);

      usersServices.update.mockResolvedValue(userMock);

      await expect(
        authService.verifyEmail({ id: userMock.id }),
      ).rejects.toThrow(BadRequestException);

      expect(usersServices.findOne).toHaveBeenCalledWith(userMock.id);
      expect(usersServices.update).not.toHaveBeenCalled();
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

      const user = await authService.login(loginDto);

      expect(user).toEqual(userMock);
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
    });

    it('should throw an error if the user is login with social', async () => {
      const unverifiedUser: User = {
        ...userMock,
        socialType: SocialAuthType.GOOGLE,
      };
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
      expect(encryptionService.match).not.toHaveBeenCalled();
    });
  });

  describe('forgetPassword', () => {
    it('should get user with basic auth', async () => {
      usersServices.findOneByEmail.mockResolvedValue(userMock);
      const user = await authService.forgetPassword({
        email: userMock.email,
      });
      expect(user).toEqual(userMock);
      expect(usersServices.findOneByEmail).toHaveBeenCalledWith(userMock.email);
    });

    it('should throw error if the user is logged in with social', async () => {
      usersServices.findOneByEmail.mockResolvedValue({
        ...userMock,
        socialType: SocialAuthType.GOOGLE,
      });

      await expect(
        authService.forgetPassword({ email: userMock.email }),
      ).rejects.toThrow(BadRequestException);

      expect(usersServices.findOneByEmail).toHaveBeenCalledWith(userMock.email);
    });
  });

  describe('checkRefreshTokenCredential', () => {
    it('should refresh the access token', async () => {
      usersServices.findOne.mockResolvedValue(userMock);

      const user = await authService.checkRefreshTokenCredential({
        email: userMock.email,
        id: userMock.id,
        username: userMock.username,
      });

      expect(user).toEqual(userMock);
      expect(usersServices.findOne).toHaveBeenCalledWith(userMock.id);
    });

    it('should throw error if the user is not found', async () => {
      usersServices.findOne.mockResolvedValue(null);

      await expect(
        authService.checkRefreshTokenCredential({
          email: userMock.email,
          id: userMock.id,
          username: userMock.username,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(usersServices.findOne).toHaveBeenCalledWith(userMock.id);
    });
  });

  describe('validateSocialLogin', () => {
    it('should validate a social login', async () => {
      const socialType = SocialAuthType.GOOGLE;
      const socialData: SocialAuthResponse = {
        id: '1',
        email: userMock.email,
        username: userMock.username,
      };
      usersServices.findOneBySocialId.mockResolvedValue(userMock);
      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });
      const tokens = await authService.validateSocialLogin(
        socialType,
        socialData,
      );
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(authTokenService.createLoginToken).toHaveBeenCalledWith(userMock);
      expect(usersServices.findOneBySocialId).toHaveBeenCalledWith(
        socialType,
        socialData.id,
      );
      expect(usersServices.registerSocial).not.toHaveBeenCalled();
    });

    it('should create and validate a social login when user does not exist', async () => {
      const socialType = SocialAuthType.GOOGLE;
      const socialData: SocialAuthResponse = {
        id: '1',
        email: userMock.email,
        username: userMock.username,
      };
      usersServices.findOneBySocialId.mockResolvedValue(null);
      usersServices.registerSocial.mockResolvedValue(userMock);
      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });
      const tokens = await authService.validateSocialLogin(
        socialType,
        socialData,
      );
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(authTokenService.createLoginToken).toHaveBeenCalledWith(userMock);
      expect(usersServices.findOneBySocialId).toHaveBeenCalledWith(
        socialType,
        socialData.id,
      );
      expect(usersServices.registerSocial).toHaveBeenCalledWith({
        username: userMock.username,
        email: userMock.email,
        socialId: socialData.id,
        socialType,
        emailVerifiedAt: expect.any(Number),
      });
    });
  });
});
