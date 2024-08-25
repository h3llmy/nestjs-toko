import { EncryptionService } from './encryption.service';
import bcrypt from 'bcryptjs';
import { TestBed } from '@automock/jest';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    const { unit } = TestBed.create(EncryptionService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should generate a hashed password', () => {
      const password = 'password123';
      const hashedPassword = service.hash(password);

      expect(bcrypt.compareSync(password, hashedPassword)).toBe(true);
      expect(hashedPassword).not.toBe(password);
    });
  });

  describe('match', () => {
    it('should return true if password matches hashed password', () => {
      const password = 'password123';
      const hashedPassword = bcrypt.hashSync(password, 10);

      expect(service.match(password, hashedPassword)).toBe(true);
    });

    it('should return false if password does not match hashed password', () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = bcrypt.hashSync(password, 10);

      expect(service.match(wrongPassword, hashedPassword)).toBe(false);
    });
  });
});
