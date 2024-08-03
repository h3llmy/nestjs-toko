import { Seeder } from '../../../seeder/seeder.decorator';
import { RolePermissionSeeder } from '../../../seeder/utils/role-permission.utils';

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
