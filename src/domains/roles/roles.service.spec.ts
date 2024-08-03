import { TestBed } from '@automock/jest';
import { RolesService } from './roles.service';
import { RoleRepository } from './role.repository';
import { Role } from './entities/role.entity';
import { IPaginationResponse } from '@app/common';
import { PaginationRoleDto } from './dto/pagination-role.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { Permissions } from '../permissions/entities/permission.entity';

describe('RolesService', () => {
  let roleService: RolesService;
  let roleRepository: jest.Mocked<RoleRepository>;
  let permissionService: jest.Mocked<PermissionsService>;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRolePagination: IPaginationResponse<Role> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockRole],
  };

  const mockPermissions: Permissions = {
    id: '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
    name: 'admin',
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RolesService).compile();

    roleService = unit;
    roleRepository = unitRef.get(RoleRepository);
    permissionService = unitRef.get(PermissionsService);
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
    expect(roleRepository).toBeDefined();
    expect(permissionService).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      roleRepository.saveEntity.mockResolvedValue({
        ...mockRole,
        permissions: [mockPermissions],
      });
      permissionService.findManyById.mockResolvedValue([mockPermissions]);
      const role = await roleService.create({
        name: 'admin',
        permissionId: ['0d8e1e88-6c15-4aa8-ab33-2091ce62a27a'],
      });
      expect(role).toEqual({
        ...mockRole,
        permissions: [mockPermissions],
      });
      expect(permissionService.findManyById).toHaveBeenCalledWith([
        '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
      ]);
      expect(roleRepository.saveEntity).toHaveBeenCalledWith(
        { name: 'admin', permissions: [mockPermissions] },
        undefined,
      );
    });
  });

  describe('findAll', () => {
    it('should find all roles', async () => {
      roleRepository.findPagination.mockResolvedValue(mockRolePagination);
      const paginationOption: PaginationRoleDto = {
        page: 1,
        limit: 10,
      };
      const roles = await roleService.findAll(paginationOption);
      expect(roles).toEqual(mockRolePagination);
      expect(roleRepository.findPagination).toHaveBeenCalledWith(
        paginationOption,
      );
    });
  });

  describe('findOne', () => {
    it('should find a role by id', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole);
      const role = await roleService.findOne('1');
      expect(role).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findOneByName', () => {
    it('should find a role by name', async () => {
      roleRepository.findOne.mockResolvedValue(mockRole);
      const role = await roleService.findOneByName('admin');
      expect(role).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'admin' },
      });
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      roleRepository.updateAndFind.mockResolvedValue({
        ...mockRole,
        permissions: [mockPermissions],
      });
      permissionService.findManyById.mockResolvedValue([mockPermissions]);
      const productCategory = await roleService.update('1', {
        name: 'test',
        permissionId: ['0d8e1e88-6c15-4aa8-ab33-2091ce62a27a'],
      });
      expect(productCategory).toEqual({
        ...mockRole,
        permissions: [mockPermissions],
      });
      expect(permissionService.findManyById).toHaveBeenCalledWith([
        '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
      ]);
      expect(roleRepository.updateAndFind).toHaveBeenCalledWith(
        { id: '1' },
        {
          name: 'test',
          permissions: [mockPermissions],
        },
      );
    });
  });

  describe('remove', () => {
    it('should delete a role', async () => {
      const deletedValue = {
        raw: null,
        affected: 1,
        generatedMaps: [],
      };
      roleRepository.softDelete.mockResolvedValue(deletedValue);
      const productCategory = await roleService.remove('1');
      expect(productCategory).toEqual(deletedValue);
      expect(roleRepository.softDelete).toHaveBeenCalledWith('1');
    });
  });
});
