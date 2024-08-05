import { RolePermissionSeeder, Seeder } from '@libs/database';

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
