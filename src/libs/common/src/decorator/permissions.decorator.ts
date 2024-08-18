import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to set metadata related to permissions for a route or a controller method.
 *
 * @param {...string[]} permissions - Array of user permissions or 'authorize' string indicating permission requirements.
 * @return {ReturnType<typeof SetMetadata>} Metadata indicating the required permissions.
 */
export const Permission = (
  ...permissions: string[]
): ReturnType<typeof SetMetadata> => SetMetadata('permission', permissions);
