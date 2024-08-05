import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class PermissionAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: ['get all permissions', 'get permission by id'],
    });
  }
}
