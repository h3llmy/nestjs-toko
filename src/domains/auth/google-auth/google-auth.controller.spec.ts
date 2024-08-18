import { TestBed } from '@automock/jest';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { BasicAuthService } from '../basic-auth/basic-auth.service';
import { SocialAuthType } from '../social-auth.enum';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@domains/roles/entities/role.entity';
import { User } from '@domains/users/entities/user.entity';
import { AuthTokenService } from '@libs/auth-token';

describe('GoogleAuthController', () => {
  let controller: GoogleAuthController;
  let googleAuthService: jest.Mocked<GoogleAuthService>;
  let basicAuthService: jest.Mocked<BasicAuthService>;
  let authTokenService: jest.Mocked<AuthTokenService>;

  const mockSocialProfile = {
    id: 'id',
    email: 'email',
    username: 'username',
  };

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

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(GoogleAuthController).compile();

    controller = unit;
    googleAuthService = unitRef.get(GoogleAuthService);
    basicAuthService = unitRef.get(BasicAuthService);
    authTokenService = unitRef.get(AuthTokenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(googleAuthService).toBeDefined();
    expect(basicAuthService).toBeDefined();
    expect(authTokenService).toBeDefined();
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(controller.login).toBeDefined();
    });
    it('should be login with google', async () => {
      googleAuthService.getProfile.mockResolvedValue(mockSocialProfile);
      basicAuthService.validateSocialLogin.mockResolvedValue(mockUser);
      authTokenService.createLoginToken.mockReturnValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const loginDto = {
        token: 'token',
      };
      const response = await controller.login(loginDto);
      expect(response).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      expect(googleAuthService.getProfile).toHaveBeenCalledWith(loginDto);
      expect(basicAuthService.validateSocialLogin).toHaveBeenCalledWith(
        SocialAuthType.GOOGLE,
        mockSocialProfile,
      );
      expect(authTokenService.createLoginToken).toHaveBeenCalledWith(mockUser);
    });
    it('should throw an error if user not found', async () => {
      googleAuthService.getProfile.mockRejectedValue(
        new UnauthorizedException(),
      );

      const loginDto = {
        token: 'token',
      };
      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(googleAuthService.getProfile).toHaveBeenCalledWith(loginDto);
      expect(basicAuthService.validateSocialLogin).not.toHaveBeenCalled();
      expect(authTokenService.createLoginToken).not.toHaveBeenCalled();
    });
  });
});
