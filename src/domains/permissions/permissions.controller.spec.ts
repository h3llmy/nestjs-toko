import { TestBed } from '@automock/jest';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { Permissions } from './entities/permission.entity';
import { NotFoundException } from '@nestjs/common';

describe('PermissionsController', () => {
  let permissionsController: PermissionsController;
  let permissionsService: jest.Mocked<PermissionsService>;

  const mockPermissions: Permissions = {
    id: '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
    name: 'admin',
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(PermissionsController).compile();

    permissionsController = unit;
    permissionsService = unitRef.get(PermissionsService);
  });

  it('should be defined', () => {
    expect(permissionsController).toBeDefined();
    expect(permissionsService).toBeDefined();
  });

  describe('findAllPagination', () => {
    it('should be defined', () => {
      expect(permissionsController.findAllPagination).toBeDefined();
    });
    it('should get list permissions with pagination', async () => {
      const mockPermissionsPagination = {
        totalData: 1,
        totalPages: 1,
        page: 1,
        limit: 10,
        data: [mockPermissions],
      };
      permissionsService.findAllPagination.mockResolvedValue(
        mockPermissionsPagination,
      );
      const result = await permissionsController.findAllPagination({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockPermissionsPagination);
      expect(permissionsService.findAllPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(permissionsController.findOne).toBeDefined();
    });
    it('should get list permissions by ids', async () => {
      permissionsService.findOne.mockResolvedValue(mockPermissions);
      const result = await permissionsController.findOne(mockPermissions.id);
      expect(result).toEqual(mockPermissions);
      expect(permissionsService.findOne).toHaveBeenCalledWith(
        mockPermissions.id,
      );
    });
    it('should throw not found exception if permission not found', async () => {
      permissionsService.findOne.mockResolvedValue(null);
      await expect(
        permissionsController.findOne(mockPermissions.id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
