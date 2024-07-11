import { mixin } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Returns a new validation error schema class that extends the ValidationErrorSchema class.
 * The returned class has two properties: 'message' of type 'string' and 'error' of type 'T'.
 *
 * @param {new (...args: any[]) => T} schema - The schema class to be used for the 'error' property.
 * @return {() => typeof ValidationErrorSchema} - A function that returns the new validation error schema class.
 */
export const validationErrorSchemaFactory = <T = any>(
  schema: new (...args: any[]) => T,
) => {
  class ValidationErrorSchema {
    @ApiProperty({ type: 'string' })
    message: string;

    @ApiProperty({ type: schema })
    error: typeof schema;
  }

  return mixin<ValidationErrorSchema>(ValidationErrorSchema);
};
