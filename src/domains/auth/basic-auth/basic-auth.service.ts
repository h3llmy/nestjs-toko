import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '@domains/users/users.service';
import { EncryptionService } from '@libs/encryption';
import { ConfigService } from '@nestjs/config';
import { RandomizeService } from '@libs/randomize';
import { LoginDto } from './dto/login-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ILoginTokenPayload,
  IRegisterTokenPayload,
  AuthTokenService,
  AuthTokenSchema,
} from '@libs/auth-token';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResendRegisterEmailDto } from './dto/resend-register-email.dto';
import { SocialAuthResponse } from '../social-auth.abstract';
import { SocialAuthType } from '../social-auth.enum';
import { User } from '@domains/users/entities/user.entity';

/**
 * AuthService handles the authentication and authorization logic.
 */
@Injectable()
export class BasicAuthService {
  constructor(
    private readonly usersServices: UsersService,
    private readonly encryptionService: EncryptionService,
    protected readonly authTokenService: AuthTokenService,
    protected readonly configService: ConfigService,
    protected readonly mailerService: MailerService,
    protected readonly randomizeService: RandomizeService,
  ) {}

  /**
   * Re-sends the registration email to the specified email address.
   *
   * @param {ResendRegisterEmailDto} resendEmailDto - The DTO containing the email address.
   * @return {Promise<User>} The user entity if the email is sent successfully.
   * @throws {NotFoundException} If the user with the specified email address is not found.
   * @throws {BadRequestException} If the user with the specified email address is already verified.
   */
  async resendEmail(resendEmailDto: ResendRegisterEmailDto): Promise<User> {
    const user = await this.usersServices.findOneByEmail(resendEmailDto.email);

    if (!user)
      throw new NotFoundException(
        `User with email ${resendEmailDto.email} not found`,
      );

    if (user.emailVerifiedAt) {
      throw new BadRequestException(
        `User with email ${resendEmailDto.email} already verified`,
      );
    }

    return user;
  }

  /**
   * Verifies the user's email using the provided token and updates the user's email verification status.
   *
   * @param {string} token - The verification token sent to the user's email.
   * @return {Promise<User>} The updated user entity if the email verification is successful.
   */
  async verifyEmail(credential: IRegisterTokenPayload): Promise<User> {
    const user = await this.usersServices.findOne(credential.id);
    if (!user)
      throw new NotFoundException(`User with id ${credential.id} not found`);

    if (user.emailVerifiedAt) {
      throw new BadRequestException('User already verified');
    }

    return this.usersServices.update(credential.id, {
      emailVerifiedAt: Date.now(),
    });
  }

  /**
   * Authenticates a user based on the provided login credentials.
   *
   * @param {LoginDto} loginDto - The login credentials containing email and password.
   * @return {Promise<User>} The authenticated user entity if the credentials are valid.
   */
  async login(loginDto: LoginDto): Promise<User> {
    const userCheck = await this.usersServices.findOneByEmail(loginDto.email);

    if (userCheck.socialType) {
      throw new BadRequestException(
        `user is already logged in with ${userCheck.socialType}`,
      );
    }

    if (
      !userCheck ||
      !this.encryptionService.match(loginDto.password, userCheck.password)
    ) {
      throw new BadRequestException('Invalid credential');
    }

    if (!userCheck.emailVerifiedAt) {
      throw new BadRequestException('User is not verified');
    }

    return userCheck;
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<User> {
    const user = await this.usersServices.findOneByEmail(
      forgetPasswordDto.email,
    );

    if (user.socialType) {
      throw new BadRequestException(
        `user is logged in with ${user.socialType}`,
      );
    }

    return user;
  }

  /**
   * Refreshes the access token using the provided refresh token.
   *
   * @param {ILoginTokenPayload} credential - The refresh token used to refresh the access token.
   * @return {Promise<User>} The user entity associated with the provided refresh token.
   */
  async checkRefreshTokenCredential(
    credential: ILoginTokenPayload,
  ): Promise<User> {
    const userCheck = await this.usersServices.findOne(credential.id);
    if (!userCheck) throw new BadRequestException('invalid token');

    return userCheck;
  }

  /**
   * Validates a social login by finding a user by social ID and social type, or registering a new user if not found.
   *
   * @param {SocialAuthType} socialType - The social authentication type.
   * @param {SocialAuthResponse} socialData - The social authentication response containing the user's ID, username, email, and social ID.
   * @return {Promise<AuthTokenSchema>} A promise that resolves to an authentication token schema containing the access and refresh tokens.
   */
  async validateSocialLogin(
    socialType: SocialAuthType,
    socialData: SocialAuthResponse,
  ): Promise<AuthTokenSchema> {
    const user =
      (await this.usersServices.findOneBySocialId(socialType, socialData.id)) ??
      (await this.usersServices.registerSocial({
        username: socialData.username,
        email: socialData.email,
        socialId: socialData.id,
        socialType,
        emailVerifiedAt: Date.now(),
      }));

    return this.authTokenService.createLoginToken(user);
  }
}
