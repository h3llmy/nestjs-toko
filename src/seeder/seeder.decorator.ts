export const Seeder = () => {
  return function AbstractClass(target: Function): void {
    Reflect.defineMetadata('isSeederClass', true, target);
  };
};
