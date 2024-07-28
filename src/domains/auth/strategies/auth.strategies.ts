import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { ILoginTokenPayload } from '../auth.interface';
import { User } from '../../users/entities/user.entity';

/**
 * JWT (JSON Web Token) authentication strategy.
 * Extends `PassportStrategy` from `@nestjs/passport`.
 */
@Injectable()
export class JwtStrategies extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    } as StrategyOptions);
  }

  /**
   * Validates the user based on the payload data.
   *
   * @param {ILoginTokenPayload} payload - The payload extracted from the JWT token.
   * @return {Promise<User>} A promise that resolves to the user object if validation is successful.
   * @throws {UnauthorizedException} If the token is invalid.
   */
  async validate(payload: ILoginTokenPayload): Promise<User> {
    // Validate the user based on the payload data
    const user = await this.userService.findOne(payload.id, {
      role: true,
    });

    if (!user?.emailVerifiedAt) throw new UnauthorizedException('Unauthorized');

    return user;
  }
}
