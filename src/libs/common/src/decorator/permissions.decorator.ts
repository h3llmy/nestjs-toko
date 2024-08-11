import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to set metadata related to permissions for a route or a controller method.
 *
 * @param {...string[]} roles - Array of user roles or 'authorize' string indicating permission requirements.
 * @return {ReturnType<typeof SetMetadata>} Metadata indicating the required permissions.
 */
export const Permission = (
  ...roles: string[]
): ReturnType<typeof SetMetadata> => SetMetadata('permission', roles);
