import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from '../users/users.service';
import { EncryptionService } from '@app/encryption';
import { ConfigService } from '@nestjs/config';
import { RandomizeService } from '@app/randomize';
import { LoginDto } from './dto/login-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  IForgetPasswordPayload,
  ILoginTokenPayload,
  IRegisterTokenPayload,
} from './auth.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { AuthTokenSchema, BasicSuccessSchema } from '@app/common';
import { ResendRegisterEmailDto } from './dto/resend-register-email.dto';
import { AuthTokenService } from './authToken.service';

/**
 * AuthService handles the authentication and authorization logic.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersServices: UsersService,
    private readonly encryptionService: EncryptionService,
    protected readonly authTokenService: AuthTokenService,
    protected readonly configService: ConfigService,
    protected readonly mailerService: MailerService,
    protected readonly randomizeService: RandomizeService,
  ) {}

  /**
   * Registers a new user and sends a verification email.
   *
   * @param {RegisterUserDto} registerDto - Data Transfer Object containing user registration information.
   * @return {Promise<BasicSuccessSchema>} A message indicating registration success.
   */
  async register(registerDto: RegisterUserDto): Promise<BasicSuccessSchema> {
    const user = await this.usersServices.register(registerDto);

    const tokenPayload: IRegisterTokenPayload = {
      id: user.id,
    };

    const token = this.authTokenService.generateRegisterToken(tokenPayload);

    const webUrl = this.configService.get<string>('WEB_URL');
    const webVerifyRoute = this.configService.get<string>('WEB_VERIFY_ROUTE');
    const confirmationLink = `${webUrl}/${webVerifyRoute}/${token}`;

    this.mailerService.sendMail({
      template: 'email/register',
      to: registerDto.email,
      subject: 'Registration Email',
      context: {
        confirmationLink,
        user,
      },
    });

    return { message: 'Registration Success' };
  }

  /**
   * Re sends the registration email to the specified email address.
   *
   * @param {ResendRegisterEmailDto} resendEmailDto - The DTO containing the email address.
   * @return {Promise<BasicSuccessSchema>} A promise that resolves to a success message.
   * @throws {NotFoundException} If the user with the specified email address is not found.
   */
  async resendEmail(
    resendEmailDto: ResendRegisterEmailDto,
  ): Promise<BasicSuccessSchema> {
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

    const tokenPayload: IRegisterTokenPayload = {
      id: user.id,
    };

    const token = this.authTokenService.generateRegisterToken(tokenPayload);

    const webUrl = this.configService.get<string>('WEB_URL');
    const webVerifyRoute = this.configService.get<string>('WEB_VERIFY_ROUTE');
    const confirmationLink = `${webUrl}/${webVerifyRoute}/${token}`;

    this.mailerService.sendMail({
      template: 'email/register',
      to: resendEmailDto.email,
      subject: 'Registration Email',
      context: {
        confirmationLink,
        user,
      },
    });

    return { message: 'Resend email success' };
  }

  /**
   * Verifies the user's email using the provided token.
   *
   * @param {string} token - The verification token sent to the user's email.
   * @return {Promise<AuthTokenSchema>} Login tokens if the email verification is successful.
   */
  async verifyEmail(token: string): Promise<AuthTokenSchema> {
    const credential: IRegisterTokenPayload =
      this.authTokenService.verifyRegisterToken(token);

    const user = await this.usersServices.findOne(credential.id);
    if (!user)
      throw new NotFoundException(`User with id ${credential.id} not found`);

    if (user.emailVerifiedAt) {
      throw new BadRequestException('User already verified');
    }

    this.usersServices.update(credential.id, {
      emailVerifiedAt: Date.now(),
    });

    return this.authTokenService.createLoginToken(user);
  }

  /**
   * Authenticates a user using their email and password.
   *
   * @param {LoginDto} loginDto - Data Transfer Object containing login information.
   * @returns {Promise<AuthTokenSchema>} Access and refresh tokens if authentication is successful.
   * @throws {BadRequestException} if the credentials are invalid or the user is not verified.
   */
  async login(loginDto: LoginDto): Promise<AuthTokenSchema> {
    const userCheck = await this.usersServices.findOneByEmail(loginDto.email);

    if (
      !userCheck ||
      !this.encryptionService.match(loginDto.password, userCheck.password)
    ) {
      throw new BadRequestException('Invalid credential');
    }

    if (!userCheck.emailVerifiedAt) {
      throw new BadRequestException('User is not verified');
    }

    return this.authTokenService.createLoginToken(userCheck);
  }

  /**
   * Initiates the password reset process by sending an email with a reset link.
   *
   * @param {ForgetPasswordDto} forgetPasswordDto - Data Transfer Object containing the user's email.
   * @return {Promise<BasicSuccessSchema>} A message indicating the email has been sent.
   */
  async forgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
  ): Promise<BasicSuccessSchema> {
    const user = await this.usersServices.findOneByEmail(
      forgetPasswordDto.email,
    );

    const tokenPayload: IForgetPasswordPayload = {
      id: user.id,
    };

    const token =
      this.authTokenService.generateForgetPasswordToken(tokenPayload);

    const webUrl = this.configService.get<string>('WEB_URL');
    const forgetPasswordRoute = this.configService.get<string>(
      'WEB_FORGET_PASSWORD_ROUTE',
    );
    const redirectLink = `${webUrl}/${forgetPasswordRoute}/${token}`;

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password',
      context: {
        redirectLink,
        user,
      },
      template: 'email/forget-password',
    });

    return { message: 'Email Sended' };
  }

  /**
   * Resets the user's password using the provided token and new password.
   *
   * @param {string} token - The token sent to the user's email for password reset.
   * @param {ResetPasswordDto} resetPassword - Data Transfer Object containing the new password.
   * @return {Promise<BasicSuccessSchema>} A message indicating the password has been updated.
   */
  async resetPassword(
    token: string,
    resetPassword: ResetPasswordDto,
  ): Promise<BasicSuccessSchema> {
    const credential: IForgetPasswordPayload =
      this.authTokenService.verifyForgetPasswordToken(token);

    this.usersServices.update(
      credential.id,
      {
        password: resetPassword.password,
      },
      'Fail to update Password',
    );

    return { message: 'Password has been updated' };
  }

  /**
   * Refreshes the access token using the provided refresh token.
   *
   * @param {RefreshTokenDto} refreshToken - The refresh token used to refresh the access token.
   * @return {Promise<AuthTokenSchema>} The new access and refresh tokens.
   */
  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): Promise<AuthTokenSchema> {
    const credential: ILoginTokenPayload =
      this.authTokenService.verifyRefreshToken(refreshToken);

    const userCheck = await this.usersServices.findOne(credential.id);
    if (!userCheck) throw new BadRequestException('invalid token');

    return this.authTokenService.createLoginToken(userCheck);
  }
}
