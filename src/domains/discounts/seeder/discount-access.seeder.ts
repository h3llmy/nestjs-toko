import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class DiscountAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: [
        'create discount',
        'get all discount',
        'get discount by id',
        'update discount',
        'delete discount',
      ],
      user: ['get all discount', 'get discount by id'],
      public: ['get all discount', 'get discount by id'],
    });
  }
}
