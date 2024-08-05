import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class ProductCategoryAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: [
        'create product category',
        'get all product category',
        'get product category by id',
        'update product category',
        'delete product category',
      ],
      user: ['get all product category', 'get product category by id'],
      public: ['get all product category', 'get product category by id'],
    });
  }
}
