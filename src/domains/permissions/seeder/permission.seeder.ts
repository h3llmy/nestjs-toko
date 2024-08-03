import { SeederRunner } from '../../../seeder/seeder.interface';
import { Seeder } from '../../../seeder/seeder.decorator';
import { Permissions } from '../entities/permission.entity';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../../../domains/roles/entities/role.entity';

// TODO: refactor this
@Seeder()
export default class PermissionSeeder implements SeederRunner {
  async run(dataSource: DataSource): Promise<void> {
    const permissionRepository: Repository<Permissions> =
      dataSource.getRepository(Permissions);
    const roleRepository: Repository<Role> = dataSource.getRepository(Role);

    // Fetch roles and create a map for quick lookup
    const roles = await roleRepository.find();
    const rolesMap = new Map(roles.map((role) => [role.name, role]));

    // Define the permissions once
    const permissions = [
      // UserController
      'get all users',
      'get user profile',
      'get user by id',
      'update profile',
      'delete user',
      // RoleController
      'create role',
      'get all roles',
      'get role by id',
      'update role',
      'delete role',
      // ProductController
      'create product',
      'get all product',
      'get product by id',
      'update product',
      'delete product',
      // ProductCategoryController
      'create product category',
      'get all product category',
      'get product category by id',
      'update product category',
      'delete product category',
      // PermissionController
      'get all permissions',
      'get permission by id',
      // OrderController
      'create order',
      'get all orders',
      'get order by id',
      // InventoryController
      'get inventories by id',
      'update inventories',
      'increase inventory stock by id',
      // DiscountController
      'create discount',
      'get all discount',
      'get discount by id',
      'update discount',
      'delete discount',
    ].map((name) => ({ name }));

    // Fetch existing permissions from the database
    const existingPermissions = await permissionRepository.find();
    const existingPermissionNames = new Set(
      existingPermissions.map((p) => p.name),
    );

    // Filter out permissions that already exist
    const newPermissions = permissions.filter(
      (p) => !existingPermissionNames.has(p.name),
    );

    // Create new permissions in the database
    const createdPermissions =
      newPermissions.length > 0
        ? await permissionRepository.save(newPermissions)
        : [];
    const permissionMap = new Map(
      [...existingPermissions, ...createdPermissions].map((permission) => [
        permission.name,
        permission,
      ]),
    );

    // Attach permissions to the 'admin' role
    const adminRole = rolesMap.get('admin');
    if (!adminRole) {
      throw new Error('Admin role not found');
    }
    if (adminRole) {
      const adminPermissions = [
        // UserController
        'get all users',
        'get user profile',
        'get user by id',
        'update profile',
        'delete user',
        // RoleController
        'create role',
        'get all roles',
        'get role by id',
        'update role',
        'delete role',
        // ProductController
        'create product',
        'get all product',
        'get product by id',
        'update product',
        'delete product',
        // ProductCategoryController
        'create product category',
        'get all product category',
        'get product category by id',
        'update product category',
        'delete product category',
        // PermissionController
        'get all permissions',
        'get permission by id',
        // OrderController
        'get all orders',
        'get order by id',
        // InventoryController
        'get inventories by id',
        'update inventories',
        'increase inventory stock by id',
        // DiscountController
        'create discount',
        'get all discount',
        'get discount by id',
        'update discount',
        'delete discount',
      ];
      adminRole.permissions = adminPermissions.map((name) => {
        const permission = permissionMap.get(name);
        if (!permission) {
          throw new Error(`Permission '${name}' not found`);
        }
        return permission;
      });
      await roleRepository.save(adminRole);
    }

    const userRole = rolesMap.get('user');
    if (!userRole) {
      throw new Error('User role not found');
    }
    if (userRole) {
      const userPermissions = [
        // UserController
        'get user profile',
        'update profile',
        // ProductController
        'get all product',
        'get product by id',
        // ProductCategoryController
        'get all product category',
        'get product category by id',
        // OrderController
        'create order',
        'get all orders',
        'get order by id',
        // InventoryController
        'get inventories by id',
        // DiscountController
        'get all discount',
        'get discount by id',
      ];
      userRole.permissions = userPermissions.map((name) => {
        const permission = permissionMap.get(name);
        if (!permission) {
          throw new Error(`Permission '${name}' not found`);
        }
        return permission;
      });
      await roleRepository.save(userRole);
    }
  }
}
