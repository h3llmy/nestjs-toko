import { TestBed } from '@automock/jest';
import { AuthTokenService } from './authToken.service';
import { JwtService } from '@nestjs/jwt';
import { ILoginTokenPayload, IRegisterTokenPayload } from './auth.interface';
import { Role, User } from '../users/entities/user.entity';

describe('AuthTokenService', () => {
  let authTokenService: AuthTokenService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(AuthTokenService).compile();

    authTokenService = unit;
    jwtService = unitRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authTokenService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('generateRegisterToken', () => {
    it('should generate a register token', () => {
      const payload: IRegisterTokenPayload = {
        id: '1',
      };
      jwtService.sign.mockReturnValue('some jwt token');
      const token = authTokenService.generateRegisterToken(payload);
      expect(token).toBeDefined();
    });
  });

  describe('verifyRegisterToken', () => {
    it('should verify a register token', () => {
      const token = 'some jwt token';
      jwtService.verify.mockReturnValue({
        id: '1',
      });
      const payload = authTokenService.verifyRegisterToken(token);
      expect(payload).toBeDefined();
    });
  });

  describe('generateForgetPasswordToken', () => {
    it('should generate a forget password token', () => {
      const payload: IRegisterTokenPayload = {
        id: '1',
      };
      jwtService.sign.mockReturnValue('some jwt token');
      const token = authTokenService.generateForgetPasswordToken(payload);
      expect(token).toBeDefined();
    });
  });

  describe('verifyForgetPasswordToken', () => {
    it('should verify a forget password token', () => {
      const token = 'some jwt token';
      jwtService.verify.mockReturnValue({
        id: '1',
      });
      const payload = authTokenService.verifyForgetPasswordToken(token);
      expect(payload).toBeDefined();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const payload: ILoginTokenPayload = {
        id: '1',
        username: 'Test User',
        email: 'test@example.com',
      };

      jwtService.sign.mockReturnValue('some jwt token');
      const token = authTokenService.generateAccessToken(payload);
      expect(token).toBeDefined();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const payload: ILoginTokenPayload = {
        id: '1',
        username: 'Test User',
        email: 'test@example.com',
      };
      jwtService.sign.mockReturnValue('some jwt token');
      const token = authTokenService.generateRefreshToken(payload);
      expect(token).toBeDefined();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', () => {
      const token = 'some jwt token';
      jwtService.verify.mockReturnValue({
        id: '1',
      });
      const payload = authTokenService.verifyRefreshToken(token);
      expect(payload).toBeDefined();
    });
  });

  describe('createLoginToken', () => {
    it('should create a login token', () => {
      const payload: User = {
        id: '1',
        username: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerifiedAt: Date.now(),
        password: 'some hashed password',
        role: Role.USER,
      };

      jwtService.sign.mockReturnValue('some jwt token');

      const token = authTokenService.createLoginToken(payload);

      expect(token.accessToken).toBeDefined();
      expect(token.refreshToken).toBeDefined();
    });
  });
});
