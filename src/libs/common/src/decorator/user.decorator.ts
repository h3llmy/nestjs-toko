import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Parameter decorator to extract the user object from the incoming HTTP request.
 *
 * @param data - Any additional data passed to the decorator (not used in this implementation).
 * @param context - ExecutionContext object containing request context.
 * @returns The user object extracted from the request.
 */
export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Extract the request object from the context
    const request: Request = context.switchToHttp().getRequest();
    // Return the user object from the request
    return request.user;
  },
);
