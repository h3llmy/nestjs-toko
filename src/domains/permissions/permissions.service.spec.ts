import { In } from 'typeorm';
import { Permissions } from './entities/permission.entity';
import { PermissionRepository } from './permission.repository';
import { PermissionsService } from './permissions.service';
import { TestBed } from '@automock/jest';
import { IPaginationResponse } from '@libs/database';

describe('PermissionsService', () => {
  let permissionService: PermissionsService;
  let permissionRepository: jest.Mocked<PermissionRepository>;

  const mockPermissions: Permissions = {
    id: '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
    name: 'admin',
  };

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(PermissionsService).compile();

    permissionService = unit;
    permissionRepository = unitRef.get(PermissionRepository);
  });

  it('should be defined', () => {
    expect(permissionService).toBeDefined();
    expect(permissionRepository).toBeDefined();
  });

  describe('findAllPagination', () => {
    it('should be defined', () => {
      expect(permissionService.findAllPagination).toBeDefined();
    });
    it('should get list permissions with pagination', async () => {
      const mockPermissionsPagination: IPaginationResponse<Permissions> = {
        totalData: 1,
        totalPages: 1,
        page: 1,
        limit: 10,
        data: [mockPermissions],
      };
      permissionRepository.findPagination.mockResolvedValue(
        mockPermissionsPagination,
      );
      const result = await permissionService.findAllPagination({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockPermissionsPagination);
      expect(permissionRepository.findPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findManyById', () => {
    it('should be defined', () => {
      expect(permissionService.findManyById).toBeDefined();
    });
    it('should get list permissions by ids', async () => {
      permissionRepository.find.mockResolvedValue([mockPermissions]);
      const result = await permissionService.findManyById([mockPermissions.id]);
      expect(result).toEqual([mockPermissions]);
      expect(permissionRepository.find).toHaveBeenCalledWith({
        where: {
          id: In([mockPermissions.id]),
        },
      });
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(permissionService.findOne).toBeDefined();
    });
    it('should get permission by id', async () => {
      permissionRepository.findOne.mockResolvedValue(mockPermissions);
      const result = await permissionService.findOne(mockPermissions.id);
      expect(result).toEqual(mockPermissions);
    });
  });
});
