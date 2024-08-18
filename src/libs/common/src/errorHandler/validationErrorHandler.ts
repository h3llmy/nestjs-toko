import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * Custom validation pipe to handle validation errors and transform them into UnprocessableEntityException with structured error messages.
 */
export class ValidationErrorHandler extends ValidationPipe {
  /**
   * Constructor to create a new instance of ValidationErrorHandler.
   * Configures the validation pipe with custom exception handling.
   */
  constructor() {
    super({
      skipMissingProperties: false,
      whitelist: true,
      transform: true,
      exceptionFactory: (
        errors: ValidationError[],
      ): UnprocessableEntityException => {
        const errorResponse = {
          message: 'Unprocessable Entity Exception',
          error: this.extractErrors(errors),
        };

        return new UnprocessableEntityException(errorResponse);
      },
    });
  }

  /**
   * Extracts validation errors from a list of ValidationError objects and organizes them into a nested structure.
   *
   * @param {ValidationError[]} validationErrors - The list of ValidationError objects to extract errors from.
   * @param {string} [parentPath=''] - The parent path of the current error. Defaults to an empty string.
   * @return {Record<string, any>} - A nested structure of errors, with each error organized by its property path.
   */
  private extractErrors(
    validationErrors: ValidationError[],
    parentPath = '',
  ): Record<string, any> {
    let errors: Record<string, any> = {};

    validationErrors.forEach((error) => {
      const propertyPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;

      if (error.constraints) {
        if (parentPath) {
          if (!errors[parentPath]) {
            errors[parentPath] = {};
          }
          errors[parentPath][error.property] = Object.values(error.constraints);
        } else {
          errors[propertyPath] = Object.values(error.constraints);
        }
      }

      if (error.children && error.children.length > 0) {
        const nestedErrors = this.extractErrors(error.children, propertyPath);
        errors = { ...errors, ...nestedErrors };
      }
    });

    return errors;
  }
}
