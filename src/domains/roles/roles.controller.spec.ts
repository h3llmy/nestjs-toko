import { TestBed } from '@automock/jest';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { IPaginationResponse } from '@app/common';
import { PaginationRoleDto } from './dto/pagination-role.dto';
import { NotFoundException } from '@nestjs/common';
import { Permissions } from '../permissions/entities/permission.entity';

describe('RolesController', () => {
  let roleController: RolesController;
  let roleService: jest.Mocked<RolesService>;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPermissions: Permissions = {
    id: '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
    name: 'admin',
  };

  const mockRolePagination: IPaginationResponse<Role> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockRole],
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(RolesController).compile();

    roleController = unit;
    roleService = unitRef.get(RolesService);
  });

  it('should be defined', () => {
    expect(roleController).toBeDefined();
    expect(roleService).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      roleService.create.mockResolvedValue(mockRole);
      const role = await roleController.create({ name: 'admin' });
      expect(role).toEqual(mockRole);
      expect(roleService.create).toHaveBeenCalledWith({ name: 'admin' });
    });
  });

  describe('findAll', () => {
    it('should find all roles', async () => {
      roleService.findAll.mockResolvedValue(mockRolePagination);
      const paginationOption: PaginationRoleDto = {
        page: 1,
        limit: 10,
      };
      const pagination = await roleController.findAll(paginationOption);
      expect(pagination).toEqual(mockRolePagination);
      expect(roleService.findAll).toHaveBeenCalledWith(paginationOption);
    });
  });

  describe('findOne', () => {
    it('should find one role', async () => {
      roleService.findOne.mockResolvedValue(mockRole);
      const productCategory = await roleController.findOne('1');
      expect(productCategory).toEqual(mockRole);
      expect(roleService.findOne).toHaveBeenCalledWith('1', {
        permissions: true,
      });
    });

    it('should throw error if role not found', async () => {
      roleService.findOne.mockResolvedValue(null);
      expect(roleController.findOne('1')).rejects.toThrow(NotFoundException);
      expect(roleService.findOne).toHaveBeenCalledWith('1', {
        permissions: true,
      });
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      roleService.update.mockResolvedValue({
        ...mockRole,
        permissions: [mockPermissions],
      });
      const productCategory = await roleController.update('1', {
        ...mockRole,
        permissionId: ['0d8e1e88-6c15-4aa8-ab33-2091ce62a27a'],
      });
      expect(productCategory).toEqual({
        ...mockRole,
        permissions: [mockPermissions],
      });
      expect(roleService.update).toHaveBeenCalledWith('1', {
        ...mockRole,
        permissionId: ['0d8e1e88-6c15-4aa8-ab33-2091ce62a27a'],
      });
    });

    it('should throw error if role not found', async () => {
      roleService.update.mockResolvedValue(null);
      expect(
        roleController.update('1', {
          ...mockRole,
          permissionId: ['0d8e1e88-6c15-4aa8-ab33-2091ce62a27a'],
        }),
      ).rejects.toThrow(NotFoundException);
      expect(roleService.update).toHaveBeenCalledWith('1', {
        ...mockRole,
        permissionId: ['0d8e1e88-6c15-4aa8-ab33-2091ce62a27a'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      roleService.remove.mockResolvedValue({
        generatedMaps: [],
        raw: null,
        affected: 1,
      });
      const productCategory = await roleController.remove('1');
      expect(productCategory).toBeDefined();
      expect(roleService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw error if role not found', async () => {
      roleService.remove.mockResolvedValue(null);
      expect(roleController.remove('1')).rejects.toThrow(NotFoundException);
      expect(roleService.remove).toHaveBeenCalledWith('1');
    });
  });
});
