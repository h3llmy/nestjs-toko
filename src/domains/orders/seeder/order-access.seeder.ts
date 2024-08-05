import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class OrderAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: ['get all orders', 'get order by id'],
      user: ['create order', 'get all orders', 'get order by id'],
    });
  }
}
