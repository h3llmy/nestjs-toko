import { SetMetadata } from '@nestjs/common';

/**
 * Type alias for the roles parameter, ensuring 'Authorize' is not overridden by string.
 */
type PermissionRoles = 'Authorize' | string;

/**
 * Decorator to set metadata related to permissions for a route or a controller method.
 *
 * @param {...PermissionRoles[]} roles - Array of user roles or 'authorize' string indicating permission requirements.
 * @return {ReturnType<typeof SetMetadata>} Metadata indicating the required permissions.
 */
export const Permission = (
  ...roles: PermissionRoles[]
): ReturnType<typeof SetMetadata> => SetMetadata('permission', roles);
