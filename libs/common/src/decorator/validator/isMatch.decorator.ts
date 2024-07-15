import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Custom validation constraint to check if two properties match.
 */
@ValidatorConstraint({ async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  /**
   * A validation function to check if the provided value matches a related property value.
   *
   * @param {any} value - The value to validate.
   * @param {ValidationArguments} args - The validation arguments containing related property constraints.
   * @return {boolean} Indicates whether the value matches the related property value.
   */
  validate(value: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  /**
   * A function to generate a default error message when properties do not match.
   *
   * @param {ValidationArguments} args - The validation arguments containing constraints and property information.
   * @return {string} The error message indicating properties that do not match.
   */
  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} and ${args.property} do not match`;
  }
}

/**
 * Creates a decorator function that checks if a property matches another property.
 *
 * @param {string} property - The name of the property to match with.
 * @param {ValidationOptions} [validationOptions] - Optional validation options.
 * @return {Function} A decorator function that registers the validation constraint.
 */
export function IsMatchWith(
  property: string,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string) {
    // Changed from `Object` to `object`
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
