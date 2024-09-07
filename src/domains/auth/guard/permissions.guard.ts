import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@domains/users/entities/user.entity';
import { RolesService } from '@domains/roles/roles.service';
import { DeepPartial } from 'typeorm';
import { Permissions } from '@domains/permissions/entities/permission.entity';

/**
 * Guard to check permissions for accessing routes.
 * Implements `CanActivate` interface from `@nestjs/common`.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly roleService: RolesService,
  ) {}

  /**
   * Retrieve required permissions from route handler or controller class metadata
   *
   * @param {ExecutionContext} context - object containing request context
   * @return {Promise<boolean>} boolean indicating whether the user has permission to access the route
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve required permissions from route handler or controller class metadata
    const requiredPermission = this.reflector.getAllAndOverride<string[]>(
      'permission',
      [context.getHandler(), context.getClass()],
    );

    // If no permissions are set, allow access
    if (!requiredPermission) {
      return true;
    }

    // // Extract user information from the request
    let { user } = context
      .switchToHttp()
      .getRequest<{ user: DeepPartial<User> }>();

    let isPublicRole: boolean = false;

    if (!user) {
      const publicRole = await this.roleService.findOneByName('public', {
        permissions: true,
      });
      if (!publicRole) throw new UnauthorizedException('Unauthorized user');
      user = {
        role: publicRole,
      };
      isPublicRole = true;
    }

    const userPermissions = new Set(
      user?.role?.permissions?.map(
        (permission: DeepPartial<Permissions>) => permission.name,
      ) || [],
    );

    // Check if user has any of the required roles
    const hasPermission = requiredPermission.some((role) =>
      userPermissions.has(role),
    );

    if (isPublicRole && !hasPermission) {
      throw new UnauthorizedException('Unauthorized user');
    }

    return hasPermission;
  }
}
