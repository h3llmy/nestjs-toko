import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class ProductAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: [
        'create product',
        'get all product',
        'get product by id',
        'update product',
        'delete product',
      ],
      user: ['get all product', 'get product by id'],
      public: ['get all product', 'get product by id'],
    });
  }
}
