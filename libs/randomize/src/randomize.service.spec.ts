import { RandomizeService } from './randomize.service';
import { TestBed } from '@automock/jest';

describe('RandomizeService', () => {
  let service: RandomizeService;

  beforeEach(() => {
    const { unit } = TestBed.create(RandomizeService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('stringNumber', () => {
    it('should generate a string of numbers with the specified length', () => {
      const length = 8;
      const result = service.stringNumber(length);
      expect(result).toHaveLength(length);
      expect(result).toMatch(/^\d+$/);
    });

    it('should generate a string of numbers with the default length', () => {
      const result = service.stringNumber();
      expect(result).toHaveLength(6);
      expect(result).toMatch(/^\d+$/);
    });
  });

  describe('lowercaseString', () => {
    it('should generate a lowercase string with the specified length', () => {
      const length = 10;
      const result = service.lowercaseString(length);
      expect(result).toHaveLength(length);
      expect(result).toMatch(/^[a-z]+$/);
    });

    it('should generate a lowercase string with the default length', () => {
      const result = service.lowercaseString();
      expect(result).toHaveLength(6);
      expect(result).toMatch(/^[a-z]+$/);
    });
  });

  describe('uppercaseString', () => {
    it('should generate an uppercase string with the specified length', () => {
      const length = 10;
      const result = service.uppercaseString(length);
      expect(result).toHaveLength(length);
      expect(result).toMatch(/^[A-Z]+$/);
    });

    it('should generate an uppercase string with the default length', () => {
      const result = service.uppercaseString();
      expect(result).toHaveLength(6);
      expect(result).toMatch(/^[A-Z]+$/);
    });
  });

  describe('random', () => {
    it('should generate a random string with the specified length', () => {
      const length = 15;
      const result = service.random(length);
      expect(result).toHaveLength(length);
    });

    it('should generate a random string with the default length', () => {
      const result = service.random();
      expect(result).toHaveLength(10);
    });
  });

  describe('number', () => {
    it('should generate a random number with the specified length', () => {
      const length = 8;
      const result = service.number(length);
      expect(result.toString()).toHaveLength(length);
      expect(result).toBeGreaterThanOrEqual(Math.pow(10, length - 1));
      expect(result).toBeLessThan(Math.pow(10, length));
    });

    it('should generate a random number with the default length', () => {
      const result = service.number();
      expect(result.toString()).toHaveLength(6);
      expect(result).toBeGreaterThanOrEqual(100000);
      expect(result).toBeLessThan(1000000);
    });
  });
});
