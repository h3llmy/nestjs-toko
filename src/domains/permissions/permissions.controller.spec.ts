import { TestBed } from '@automock/jest';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

describe('PermissionsController', () => {
  let permissionsController: PermissionsController;
  let permissionsService: jest.Mocked<PermissionsService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(PermissionsController).compile();

    permissionsController = unit;
    permissionsService = unitRef.get(PermissionsService);
  });

  it('should be defined', () => {
    expect(permissionsController).toBeDefined();
    expect(permissionsService).toBeDefined();
  });
});
