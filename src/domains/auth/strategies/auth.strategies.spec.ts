import { JwtStrategies } from './auth.strategies';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { ILoginTokenPayload } from '@app/auth-token';
import { User } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { TestBed } from '@automock/jest';
import { Role } from '../../roles/entities/role.entity';

describe('JwtStrategies', () => {
  let jwtStrategies: JwtStrategies;
  let usersService: jest.Mocked<UsersService>;

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

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(JwtStrategies)
      .mock(ConfigService)
      .using({
        getOrThrow: () => 'test_secret',
      })
      .compile();
    jwtStrategies = unit;
    usersService = unitRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(jwtStrategies).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user if validation is successful', async () => {
      const payload: ILoginTokenPayload = {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      };

      usersService.findOne.mockResolvedValue(mockUser);
      expect(await jwtStrategies.validate(payload)).toBe(mockUser);
    });

    it('should throw an UnauthorizedException if the user is not found', async () => {
      const payload: ILoginTokenPayload = {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      };
      usersService.findOne.mockResolvedValue(null);
      await expect(jwtStrategies.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if the user email is not verified', async () => {
      const payload: ILoginTokenPayload = {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      };
      const mockUserNotVerified: User = {
        ...mockUser,
        emailVerifiedAt: null,
      };
      usersService.findOne.mockResolvedValue(mockUserNotVerified);
      await expect(jwtStrategies.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
