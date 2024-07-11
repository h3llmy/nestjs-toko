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
      exceptionFactory: (errors: ValidationError[]) => {
        const extractErrors = (
          validationErrors: ValidationError[],
          parentPath = '',
        ) => {
          let errors = {};

          validationErrors.forEach((error) => {
            const propertyPath = parentPath
              ? `${parentPath}.${error.property}`
              : error.property;

            if (error.constraints) {
              if (parentPath) {
                if (!errors[parentPath]) {
                  errors[parentPath] = {};
                }
                errors[parentPath][error.property] = Object.values(
                  error.constraints,
                );
              } else {
                errors[propertyPath] = Object.values(error.constraints);
              }
            }

            if (error.children && error.children.length > 0) {
              const nestedErrors = extractErrors(error.children, propertyPath);
              errors = { ...errors, ...nestedErrors };
            }
          });

          return errors;
        };

        const errorResponse = {
          error: extractErrors(errors),
          message: 'Unprocessable Entity Exception',
        };

        return new UnprocessableEntityException(errorResponse);
      },
    });
  }
}
