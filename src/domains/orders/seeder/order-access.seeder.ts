import { Seeder } from '../../../seeder/seeder.decorator';
import { RolePermissionSeeder } from '../../../seeder/utils/role-permission.utils';

@Seeder()
export class OrderAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: ['get all orders', 'get order by id'],
      user: ['create order', 'get all orders', 'get order by id'],
    });
  }
}
