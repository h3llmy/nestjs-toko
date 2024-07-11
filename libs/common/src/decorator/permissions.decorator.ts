import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../../src/domains/users/entities/user.entity';

/**
 * Decorator to set metadata related to permissions for a route or a controller method.
 *
 * @param {...('Authorize' | Role)[]} roles - Array of user roles or 'authorize' string indicating permission requirements.
 * @return {ReturnType<typeof SetMetadata>} Metadata indicating the required permissions.
 */
export const Permission = (
  ...roles: ('Authorize' | Role)[]
): ReturnType<typeof SetMetadata> => SetMetadata('permission', roles);
