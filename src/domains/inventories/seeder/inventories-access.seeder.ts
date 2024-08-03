import { Seeder } from '../../../seeder/seeder.decorator';
import { RolePermissionSeeder } from '../../../seeder/utils/role-permission.utils';

@Seeder()
export class InventoryAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: [
        'get inventories by id',
        'update inventories',
        'increase inventory stock by id',
      ],
      user: ['get inventories by id'],
    });
  }
}
