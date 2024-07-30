import { PermissionRepository } from './permission.repository';
import { PermissionsService } from './permissions.service';
import { TestBed } from '@automock/jest';

describe('PermissionsService', () => {
  let permissionService: PermissionsService;
  let permissionRepository: jest.Mocked<PermissionRepository>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(PermissionsService).compile();

    permissionService = unit;
    permissionRepository = unitRef.get(PermissionRepository);
  });

  it('should be defined', () => {
    expect(permissionService).toBeDefined();
    expect(permissionRepository).toBeDefined();
  });
});
