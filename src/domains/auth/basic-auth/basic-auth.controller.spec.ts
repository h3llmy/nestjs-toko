import { TestBed } from '@automock/jest';
import { User } from '../../users/entities/user.entity';
import { BasicAuthController } from './basic-auth.controller';
import { BasicAuthService } from './basic-auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BadRequestException } from '@nestjs/common';
import { Role } from '../../roles/entities/role.entity';

describe('BasicAuthController', () => {
  let authController: BasicAuthController;
  let authService: jest.Mocked<BasicAuthService>;

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
    authService = unitRef.get(BasicAuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(authController.register).toBeDefined();
    });

    it('should register a new user', async () => {
      authService.register.mockResolvedValue({
        message: 'Registration Success',
      });

      const user = await authController.register(mockRegisterUserDto);

      expect(user).toEqual({ message: 'Registration Success' });
      expect(authService.register).toHaveBeenCalledWith(mockRegisterUserDto);
    });

    it('should throw an error if user already exists', async () => {
      authService.register.mockRejectedValue(
        new BadRequestException(
          `email ${mockRegisterUserDto.email} is already in use`,
        ),
      );

      await expect(
        authController.register(mockRegisterUserDto),
      ).rejects.toThrow(BadRequestException);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterUserDto);
    });
  });

  describe('resendEmail', () => {
    it('should be defined', () => {
      expect(authController.resendEmail).toBeDefined();
    });

    it('should resend an email', async () => {
      authService.resendEmail.mockResolvedValue({
        message: 'Resend email success',
      });

      const user = await authController.resendEmail(mockRegisterUserDto);

      expect(user).toEqual({ message: 'Resend email success' });
      expect(authService.resendEmail).toHaveBeenCalledWith(mockRegisterUserDto);
    });

    it('should throw an error if user already exists', async () => {
      authService.resendEmail.mockRejectedValue(
        new BadRequestException(
          `email ${mockRegisterUserDto.email} is already in use`,
        ),
      );

      await expect(
        authController.resendEmail(mockRegisterUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should be defined', () => {
      expect(authController.verifyEmail).toBeDefined();
    });

    it('should verify the user email', async () => {
      authService.verifyEmail.mockResolvedValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      const user = await authController.verifyEmail('some token');

      expect(user).toEqual({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });

      expect(authService.verifyEmail).toHaveBeenCalledWith('some token');
    });

    it('should throw an error if token is invalid', async () => {
      authService.verifyEmail.mockRejectedValue(
        new BadRequestException('invalid token'),
      );

      await expect(authController.verifyEmail('some token')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(authController.login).toBeDefined();
    });

    it('should login a user', async () => {
      authService.login.mockResolvedValue({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });
      const user = await authController.login(mockRegisterUserDto);
      expect(user).toEqual({
        accessToken: 'some access token',
        refreshToken: 'some refresh token',
      });
      expect(authService.login).toHaveBeenCalledWith(mockRegisterUserDto);
    });

    it('should throw an error if user not found', async () => {
      authService.login.mockRejectedValue(
        new BadRequestException('invalid credentials'),
      );
      await expect(authController.login(mockRegisterUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.login).toHaveBeenCalledWith(mockRegisterUserDto);
    });
  });

  describe('forgetPassword', () => {
    it('should be defined', () => {
      expect(authController.forgetPassword).toBeDefined();
    });

    it('should forget password', async () => {
      authService.forgetPassword.mockResolvedValue({
        message: 'forget password success',
      });
      const user = await authController.forgetPassword(mockUser);
      expect(user).toEqual({ message: 'forget password success' });
      expect(authService.forgetPassword).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if user not found', async () => {
      authService.forgetPassword.mockRejectedValue(
        new BadRequestException('invalid credentials'),
      );
      await expect(authController.forgetPassword(mockUser)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.forgetPassword).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('resetPassword', () => {
    it('should be defined', () => {
      expect(authController.resetPassword).toBeDefined();
    });

    it('should reset password', async () => {
      authService.resetPassword.mockResolvedValue({
        message: 'reset password success',
      });

      const user = await authController.resetPassword('some token', {
        password: 'some password',
        confirmPassword: 'some password',
      });
      expect(user).toEqual({ message: 'reset password success' });
      expect(authService.resetPassword).toHaveBeenCalledWith('some token', {
        password: 'some password',
        confirmPassword: 'some password',
      });
    });

    it('should throw an error if user not found', async () => {
      authService.resetPassword.mockRejectedValue(
        new BadRequestException('invalid credentials'),
      );
      await expect(
        authController.resetPassword('some token', {
          password: 'some password',
          confirmPassword: 'some password',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(authService.resetPassword).toHaveBeenCalledWith('some token', {
        password: 'some password',
        confirmPassword: 'some password',
      });
    });
  });

  describe('refreshToken', () => {
    it('should be defined', () => {
      expect(authController.refreshToken).toBeDefined();
    });

    it('should refresh token', async () => {
      authService.refreshToken.mockResolvedValue({
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
      expect(authService.refreshToken).toHaveBeenCalledWith({
        refreshToken: 'some refresh token',
      });
    });

    it('should throw an error if token is invalid', async () => {
      authService.refreshToken.mockRejectedValue(
        new BadRequestException('invalid token'),
      );
      await expect(
        authController.refreshToken({
          refreshToken: 'some refresh token',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(authService.refreshToken).toHaveBeenCalledWith({
        refreshToken: 'some refresh token',
      });
    });
  });
});
