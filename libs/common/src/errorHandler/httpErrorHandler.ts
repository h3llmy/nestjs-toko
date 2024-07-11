import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express'; // Import Response from express module

/**
 * Exception filter to catch all unhandled exceptions and handle them uniformly.
 * Extends `BaseExceptionFilter` provided by Nest.js.
 */
@Catch(HttpException) // Specify the exception type to catch
export class HttpExceptionsFilter extends BaseExceptionFilter {
  /**
   * Method to catch and handle exceptions.
   * @param exception - The exception that occurred.
   * @param host - ArgumentsHost object containing request context.
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const error = exception.getResponse() as Record<string, string | number>;

    const errorResponse = {
      error: error.error,
      message: exception.message,
    };

    response.status(statusCode).send(errorResponse);
  }
}
