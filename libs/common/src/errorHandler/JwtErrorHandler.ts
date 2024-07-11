import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { Response } from 'express';

/**
 * Exception filter to handle JSON Web Token errors.
 *
 * This filter catches instances of `JsonWebTokenError` and customizes
 * the response to return a 401 status code with a message indicating
 * an invalid token.
 */
@Catch(JsonWebTokenError) // Specify the exception type to catch
export class JwtExceptionsFilter extends BaseExceptionFilter {
  /**
   * Method that gets called when an exception is caught.
   *
   * @param exception - The caught exception, expected to be an instance of `JsonWebTokenError`.
   * @param host - The current execution context.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(401).send({ message: 'Invalid token' });
  }
}
