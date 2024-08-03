import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';
import { RolesService } from '../../roles/roles.service';
import { DeepPartial } from 'typeorm';

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

    if (!user) {
      user = {
        role: await this.roleService.findOneByName('public'),
      };
    }

    const userPermissions = new Set(
      user?.role?.permissions?.map((permission) => permission.name) || [],
    );

    // Check if user has any of the required roles
    return requiredPermission.some((role) => userPermissions.has(role));
  }
}
