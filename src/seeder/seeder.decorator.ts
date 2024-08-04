/**
 * A decorator that marks a class as a seeder class.
 *
 * @return {Function} A higher-order function that takes a class as input and sets a metadata flag on it.
 */
export const Seeder = () => {
  return (target: object): void => {
    Reflect.defineMetadata('isSeederClass', true, target);
  };
};
