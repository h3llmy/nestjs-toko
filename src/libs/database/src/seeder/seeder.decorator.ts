import { ISeederOption } from './seeder.interface';

/**
 * A decorator function to mark a class as a seeder.
 *
 * @param {ISeederOption} seederOption - Options for the seeder, including priority.
 * @return {Function} A function that decorates a class with seeder metadata.
 */
export const Seeder = (
  seederOption: ISeederOption = { priority: 0 },
): ClassDecorator => {
  return (target: object): void => {
    Reflect.defineMetadata('isSeederClass', true, target);
    Reflect.defineMetadata('priority', seederOption.priority, target);
  };
};
