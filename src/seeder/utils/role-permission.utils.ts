import { DataSource, Repository } from 'typeorm';
import { ISeederData, ISeederRunner } from '../seeder.interface';
import { Role } from '../../domains/roles/entities/role.entity';
import { Permissions } from '../../domains/permissions/entities/permission.entity';

export class RolePermissionSeeder implements ISeederRunner {
  private permissionRepository: Repository<Permissions>;
  private roleRepository: Repository<Role>;
  private seederData: ISeederData;

  constructor(seederData: ISeederData) {
    this.seederData = seederData;
  }

  /**
   * Runs the seeder to populate the database with default permissions and roles.
   *
   * @param {DataSource} dataSource - The data source to use for the repositories.
   * @return {Promise<void>} A promise that resolves when the seeder is complete.
   */
  async run(dataSource: DataSource): Promise<void> {
    this.permissionRepository = dataSource.getRepository(Permissions);
    this.roleRepository = dataSource.getRepository(Role);

    const permissions = this.getDefaultPermissions();
    const permissionMap = await this.createPermissionMap(permissions);

    for (const [roleName, rolePermissions] of Object.entries(this.seederData)) {
      await this.createOrUpdateRole(roleName, rolePermissions, permissionMap);
    }
  }

  /**
   * Returns an array of default permissions.
   *
   * @return {Array<{ name: string }>} An array of objects with a single property 'name' representing the name of each permission.
   */
  private getDefaultPermissions(): { name: string }[] {
    return [...new Set(Object.values(this.seederData).flat())].map((name) => ({
      name,
    }));
  }

  /**
   * Creates a map of permissions, either by using existing permissions or creating new ones.
   *
   * @param {Array<{ name: string }>} permissions - An array of objects with a single property 'name' representing the name of each permission.
   * @return {Promise<Map<string, Permissions>>} A promise that resolves to a map of permissions.
   */
  private async createPermissionMap(
    permissions: { name: string }[],
  ): Promise<Map<string, Permissions>> {
    const existingPermissions = await this.permissionRepository.find();
    const existingPermissionNames = new Set(
      existingPermissions.map((p) => p.name),
    );
    const newPermissions = permissions.filter(
      (p) => !existingPermissionNames.has(p.name),
    );

    const createdPermissions =
      newPermissions.length > 0
        ? await this.permissionRepository.save(newPermissions)
        : [];

    const allPermissions = [...existingPermissions, ...createdPermissions];
    return new Map(
      allPermissions.map((permission) => [permission.name, permission]),
    );
  }

  /**
   * Creates or updates a role with the specified permissions.
   *
   * @param {string} roleName - The name of the role.
   * @param {string[]} permissionNames - An array of permission names.
   * @param {Map<string, Permissions>} permissionMap - A map of permissions.
   * @return {Promise<void>} A promise that resolves when the role is created or updated.
   */
  private async createOrUpdateRole(
    roleName: string,
    permissionNames: string[],
    permissionMap: Map<string, Permissions>,
  ): Promise<void> {
    // Check if the role exists
    let role = await this.roleRepository.findOne({
      where: { name: roleName },
      relations: { permissions: true },
    });

    if (!role) {
      // Create a new role if it doesn't exist
      role = this.roleRepository.create({ name: roleName, permissions: [] });
    }

    const permissions = permissionNames.map((name) => {
      const permission = permissionMap.get(name);
      if (!permission) {
        throw new Error(`Permission '${name}' not found`);
      }
      return permission;
    });

    role.permissions.push(...permissions);
    await this.roleRepository.save(role);
  }
}
