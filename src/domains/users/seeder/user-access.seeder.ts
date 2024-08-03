import { Seeder } from '../../../seeder/seeder.decorator';
import { RolePermissionSeeder } from '../../../seeder/utils/role-permission.utils';

@Seeder()
export class UserAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: [
        'get all users',
        'get user profile',
        'get user by id',
        'update profile',
        'delete user',
      ],
      user: ['get user profile', 'update profile'],
    });
  }
}
