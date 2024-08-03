export const Seeder = () => {
  return function AbstractClass(target: object): void {
    Reflect.defineMetadata('isSeederClass', true, target);
  };
};
