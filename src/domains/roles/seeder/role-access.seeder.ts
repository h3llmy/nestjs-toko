import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class RoleAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: [
        'create role',
        'get all roles',
        'get role by id',
        'update role',
        'delete role',
      ],
    });
  }
}
