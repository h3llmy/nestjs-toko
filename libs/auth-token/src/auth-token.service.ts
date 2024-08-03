import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  IForgetPasswordPayload,
  ILoginTokenPayload,
  IRegisterTokenPayload,
} from '@app/auth-token';

import { Injectable } from '@nestjs/common';
import { AuthTokenSchema } from './dto/authToken.schema';

@Injectable()
export class AuthTokenService {
  private readonly REGISTER_EXPIRED_TIME: string | number = '5m';
  private readonly ACCESS_EXPIRED_TIME: string | number = '30d';
  private readonly REFRESH_EXPIRED_TIME: string | number = '30d';
  private readonly FORGET_PASSWORD_EXPIRED_TIME: string | number = '5m';
  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly REFRESH_TOKEN_SECRET: string;
  private readonly REGISTER_TOKEN_SECRET: string;
  private readonly FORGET_PASSWORD_TOKEN_SECRET: string;

  constructor(
    private readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_SECRET = configService.get<string>('ACCESS_TOKEN_SECRET');
    this.REFRESH_TOKEN_SECRET = configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    this.REGISTER_TOKEN_SECRET = configService.get<string>(
      'REGISTER_TOKEN_SECRET',
    );
    this.FORGET_PASSWORD_TOKEN_SECRET = configService.get<string>(
      'FORGET_PASSWORD_TOKEN_SECRET',
    );
  }

  /**
   * A function that generates a register token.
   *
   * @param {IRegisterTokenPayload} payload - The payload for generating the token.
   * @return {string} The generated register token.
   */
  generateRegisterToken(payload: IRegisterTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.REGISTER_TOKEN_SECRET,
      expiresIn: this.REGISTER_EXPIRED_TIME,
    });
  }

  /**
   * Verifies a register token and returns the payload.
   *
   * @param {string} token - The register token to verify.
   * @return {IRegisterTokenPayload} The payload of the verified register token.
   */
  verifyRegisterToken(token: string): IRegisterTokenPayload {
    return this.jwtService.verify(token, {
      secret: this.REGISTER_TOKEN_SECRET,
    });
  }

  /**
   * Generates a forget password token using the provided payload.
   *
   * @param {IForgetPasswordPayload} payload - The payload used to generate the token.
   * @return {string} The generated forget password token.
   */
  generateForgetPasswordToken(payload: IForgetPasswordPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.FORGET_PASSWORD_TOKEN_SECRET,
      expiresIn: this.FORGET_PASSWORD_EXPIRED_TIME,
    });
  }

  /**
   * Verifies a forget password token and returns the payload.
   *
   * @param {string} token - The forget password token to verify.
   * @return {IForgetPasswordPayload} The payload of the verified forget password token.
   */
  verifyForgetPasswordToken(token: string): IForgetPasswordPayload {
    return this.jwtService.verify(token, {
      secret: this.FORGET_PASSWORD_TOKEN_SECRET,
    });
  }

  /**
   * Generates a refresh token for a given payload.
   *
   * @param {ILoginTokenPayload} payload - The payload used to generate the token.
   * @return {string} The generated refresh token.
   */
  generateRefreshToken(payload: ILoginTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.REFRESH_TOKEN_SECRET,
      expiresIn: this.REFRESH_EXPIRED_TIME,
    });
  }

  /**
   * Generates an access token for the provided payload.
   *
   * @param {ILoginTokenPayload} payload - The payload used to generate the token.
   * @return {string} The generated access token.
   */
  generateAccessToken(payload: ILoginTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_TOKEN_SECRET,
      expiresIn: this.ACCESS_EXPIRED_TIME,
    });
  }

  /**
   * Verifies a refresh token and returns the login token payload.
   *
   * @param {string} token - The refresh token to verify.
   * @return {ILoginTokenPayload} The payload of the verified login token.
   */
  verifyRefreshToken(token: string): ILoginTokenPayload {
    return this.jwtService.verify(token, {
      secret: this.REFRESH_TOKEN_SECRET,
    });
  }

  /**
   * Create login token for a given user payload.
   *
   * @param {ILoginTokenPayload} payload - The user object for which to create the token.
   * @return {AuthTokenSchema} The access and refresh tokens.
   */
  createLoginToken(payload: ILoginTokenPayload): AuthTokenSchema {
    const tokenPayload: ILoginTokenPayload = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
    };
    return {
      accessToken: this.generateAccessToken(tokenPayload),
      refreshToken: this.generateRefreshToken(tokenPayload),
    };
  }
}
