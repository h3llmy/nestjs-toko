import { RolePermissionSeeder, Seeder } from '@libs/database';

@Seeder()
export class ReportAccessSeeder extends RolePermissionSeeder {
  constructor() {
    super({
      admin: ['create report'],
    });
  }
}
