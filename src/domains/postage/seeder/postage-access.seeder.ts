import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class PostageAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      public: ['get all provinces', 'get all cities', 'get price'],
    });
  }
}
