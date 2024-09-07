import { TestBed } from '@automock/jest';
import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { User } from '@domains/users/entities/user.entity';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from '@domains/roles/entities/role.entity';
import { Permissions } from '@domains/permissions/entities/permission.entity';
import { RolesService } from '@domains/roles/roles.service';

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
      expect(rolesService.findOneByName).toHaveBeenCalledWith('public', {
        permissions: true,
      });
    });
    it('should throw error if public role is not found', async () => {
      const requiredPermission = ['success'];
      const context: ExecutionContext = createMockExecutionContext({
        user: undefined,
      });
      rolesService.findOneByName.mockResolvedValue(null);
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('permission', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(rolesService.findOneByName).toHaveBeenCalledWith('public', {
        permissions: true,
      });
    });
    it('should throw error if public role permission not match', async () => {
      const requiredPermission = ['failed'];
      const context: ExecutionContext = createMockExecutionContext({
        user: undefined,
      });
      rolesService.findOneByName.mockResolvedValue(mockRole);
      reflector.getAllAndOverride.mockReturnValue(requiredPermission);
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('permission', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(rolesService.findOneByName).toHaveBeenCalledWith('public', {
        permissions: true,
      });
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
