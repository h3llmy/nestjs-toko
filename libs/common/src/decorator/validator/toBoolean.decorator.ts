import { Transform } from 'class-transformer';

/**
 * Transforms a value into a boolean. If the value is a string, it checks if it is equal to 'true' (case-insensitive).
 * Otherwise, it uses the built-in `Boolean` function to convert the value into a boolean.
 *
 * @return {PropertyDecorator} A function that can be used as a decorator for class properties.
 */
export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }): boolean => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  });
}
