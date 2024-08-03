import { TestBed } from '@automock/jest';
import { GoogleAuthController } from './google-auth.controller';

describe('GoogleAuthController', () => {
  let controller: GoogleAuthController;

  beforeEach(() => {
    const { unit } = TestBed.create(GoogleAuthController).compile();

    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
