import { TestBed } from '@automock/jest';
import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '../../roles/entities/role.entity';
import { Permissions } from '../../permissions/entities/permission.entity';
import { RolesService } from '../../roles/roles.service';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: jest.Mocked<Reflector>;
  let rolesService: jest.Mocked<RolesService>;

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
    rolesService = unitRef.get(RolesService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(reflector).toBeDefined();
    expect(rolesService).toBeDefined();
  });

  describe('canActivate', () => {
    it('should be defined', () => {
      expect(guard.canActivate).toBeDefined();
    });
    it('should return true if no permissions are set', async () => {
      const requiredPermission = undefined;
      const context: ExecutionContext = createMockExecutionContext({
        user: mockUser,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);
      expect(await guard.canActivate(context)).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('permission', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(rolesService.findOneByName).not.toHaveBeenCalled();
    });
    it('should return true if role permissions are match', async () => {
      const requiredPermission = ['success'];
      const context: ExecutionContext = createMockExecutionContext({
        user: mockUser,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);
      expect(await guard.canActivate(context)).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('permission', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(rolesService.findOneByName).not.toHaveBeenCalled();
    });
    it('should return false if role permissions are not match', async () => {
      const requiredPermission = ['failed'];
      const context: ExecutionContext = createMockExecutionContext({
        user: mockUser,
      });
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);
      expect(await guard.canActivate(context)).toBe(false);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('permission', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(rolesService.findOneByName).not.toHaveBeenCalled();
    });
    it('should get public role', async () => {
      const requiredPermission = ['success'];
      const context: ExecutionContext = createMockExecutionContext({
        user: undefined,
      });
      rolesService.findOneByName.mockResolvedValue(mockRole);
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);
      expect(await guard.canActivate(context)).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('permission', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(rolesService.findOneByName).toHaveBeenCalledWith('public');
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
