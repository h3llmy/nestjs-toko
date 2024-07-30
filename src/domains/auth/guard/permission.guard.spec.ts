import { TestBed } from '@automock/jest';
import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from '../../roles/entities/role.entity';
import { Permissions } from '../../permissions/entities/permission.entity';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockPermission: Permissions = {
    id: '1',
    name: 'success',
  };

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    permissions: [mockPermission],
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
    const { unit, unitRef } = TestBed.create(PermissionsGuard).compile();

    guard = unit;
    reflector = unitRef.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(reflector).toBeDefined();
  });

  describe('canActivate', () => {
    it('should be defined', () => {
      expect(guard.canActivate).toBeDefined();
    });

    it('should return true if permissions are Authorize', () => {
      const requiredPermission = 'Authorize';

      const context: ExecutionContext = createMockExecutionContext({
        user: mockUser,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);

      expect(guard.canActivate(context)).toBe(true);
    });
    it('should return true if no permissions are set', () => {
      const requiredPermission = undefined;

      const context: ExecutionContext = createMockExecutionContext({
        user: mockUser,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);

      expect(guard.canActivate(context)).toBe(true);
    });
    it('should return true if role permissions are match', () => {
      const requiredPermission = ['success'];

      const context: ExecutionContext = createMockExecutionContext({
        user: mockUser,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);

      expect(guard.canActivate(context)).toBe(true);
    });
    it('should return false if role permissions are not match', () => {
      const requiredPermission = ['failed'];

      const context: ExecutionContext = createMockExecutionContext({
        user: mockUser,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);

      expect(guard.canActivate(context)).toBe(false);
    });
    it('should throw UnauthorizedException if user is undefined', async () => {
      const requiredPermission = ['success'];

      const context: ExecutionContext = createMockExecutionContext({
        user: undefined,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);

      await expect(async () => {
        await guard.canActivate(context);
      }).rejects.toThrow(UnauthorizedException);
    });
  });
});

function createMockExecutionContext(options: {
  user: User | null;
}): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user: options.user,
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;
}
