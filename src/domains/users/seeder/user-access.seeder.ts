import { RolePermissionSeeder, Seeder } from '@libs/database';

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
