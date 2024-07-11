import { UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard'; // Adjust the import path as necessary
import { TestBed } from '@automock/jest';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    const { unit } = TestBed.create(JwtAuthGuard).compile();

    guard = unit;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if there is an error and info is TokenExpiredError', () => {
    const err = new Error();
    const info = new TokenExpiredError('Token expired', new Date());
    expect(() => guard.handleRequest(err, null, info)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if there is an error and info has a message', () => {
    const err = new Error();
    const info = { message: 'Some error message' };
    expect(() => guard.handleRequest(err, null, info)).toThrow(
      new UnauthorizedException('Some error message'),
    );
  });

  it('should throw UnauthorizedException if there is an error and no info', () => {
    const err = new Error();
    expect(() => guard.handleRequest(err, null, null)).toThrow(
      new UnauthorizedException('Unauthorized'),
    );
  });

  it('should throw UnauthorizedException if info is JsonWebTokenError', () => {
    const err = null;
    const info = new JsonWebTokenError('Invalid token');
    expect(() => guard.handleRequest(err, null, info)).toThrow(
      new UnauthorizedException('Invalid token'),
    );
  });

  it('should return the user if no errors and info is null', () => {
    const err = null;
    const user = { id: 1, username: 'testuser' };
    const info = null;
    expect(guard.handleRequest(err, user, info)).toEqual(user);
  });
});
