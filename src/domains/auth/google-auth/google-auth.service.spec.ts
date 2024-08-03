import { TestBed } from '@automock/jest';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthLoginResponseDto } from './dto/google-auth-login-response.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

enum IDTokenType {
  VALID_TOKEN = 'validToken',
  INVALID_TOKEN = 'invalidToken',
  NOT_FOUND_TOKEN = 'notFoundToken',
}

jest.mock('google-auth-library', () => {
  const mockVerifyIdToken = jest.fn();

  mockVerifyIdToken.mockImplementation(async ({ idToken }) => {
    switch (idToken) {
      case IDTokenType.VALID_TOKEN:
        return {
          getPayload: jest.fn().mockReturnValue({
            sub: '109842444945271856987',
            email: 'test@gmail.com',
            name: 'testing',
          }),
        };

      case IDTokenType.NOT_FOUND_TOKEN:
        return {
          getPayload: jest.fn().mockReturnValue(null),
        };

      case IDTokenType.INVALID_TOKEN:
        throw new Error('create error');
    }
  });

  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
  };
});

describe('GoogleAuthService', () => {
  let googleAuthService: GoogleAuthService;

  beforeEach(() => {
    const { unit } = TestBed.create(GoogleAuthService).compile();

    googleAuthService = unit;
  });

  it('should be defined', () => {
    expect(googleAuthService).toBeDefined();
  });

  describe('getProfile', () => {
    it('should get profile', async () => {
      const mockGoogleAuthLoginResponse: GoogleAuthLoginResponseDto = {
        id: '109842444945271856987',
        email: 'test@gmail.com',
        username: 'testing',
      };

      const profile = await googleAuthService.getProfile({
        token: IDTokenType.VALID_TOKEN,
      });
      expect(profile).toEqual(mockGoogleAuthLoginResponse);
    });

    it('should throw an error if user token is not found', async () => {
      const profile = googleAuthService.getProfile({
        token: IDTokenType.NOT_FOUND_TOKEN,
      });
      await expect(profile).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if token is invalid', async () => {
      const profile = googleAuthService.getProfile({
        token: IDTokenType.INVALID_TOKEN,
      });
      await expect(profile).rejects.toThrow(BadRequestException);
    });
  });
});
