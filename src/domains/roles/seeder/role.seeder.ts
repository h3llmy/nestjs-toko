import { SeederRunner } from '../../../seeder/seeder.interface';
import { Seeder } from '../../../seeder/seeder.decorator';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Seeder()
export default class RoleSeeder implements SeederRunner {
  private async getExistingRoleNames(
    roleRepository: Repository<Role>,
  ): Promise<Set<string>> {
    const existingRoles = await roleRepository.find();
    return new Set(existingRoles.map((role) => role.name));
  }

  private createRoles(names: string[]): Role[] {
    return names.map((name) => ({ name })) as Role[];
  }

  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    // Define the role names to be created
    const roleNames = ['admin', 'user'];

    // Fetch existing role names
    const existingRoleNames = await this.getExistingRoleNames(roleRepository);

    // Filter out roles that already exist
    const newRoles = this.createRoles(
      roleNames.filter((name) => !existingRoleNames.has(name)),
    );

    if (newRoles.length > 0) {
      await roleRepository.save(newRoles);
    }
  }
}
