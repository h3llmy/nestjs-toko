import { Seeder } from '../../../seeder/seeder.decorator';
import { RolePermissionSeeder } from '../../../seeder/utils/role-permission.utils';

@Seeder()
export class PermissionAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: ['get all permissions', 'get permission by id'],
    });
  }
}
