import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

/**
 * Custom JWT (JSON Web Token) authentication guard.
 * Extends `AuthGuard` from `@nestjs/passport`.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Handles the request by checking for errors and throwing appropriate exceptions.
   *
   * @param {unknown} err - The error encountered during authentication.
   * @param {ILoginTokenPayload} user - The user object if authentication is successful.
   * @param {any} info - Additional information about the authentication process.
   * @returns {ILoginTokenPayload} The user object if authentication is successful, otherwise undefined.
   * @throws {UnauthorizedException} If the token has expired, if there is an error message in info, or if there is no info.
   * @throws {UnauthorizedException} If the info is an instance of JsonWebTokenError.
   */
  handleRequest<ILoginTokenPayload>(
    err: unknown,
    user: ILoginTokenPayload,
    info: any,
  ): ILoginTokenPayload {
    if (err) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (info) {
        throw new UnauthorizedException(info.message);
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
