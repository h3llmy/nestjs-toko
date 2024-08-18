import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { BasicAuthService } from './basic-auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  BasicErrorSchema,
  BasicSuccessSchema,
  validationErrorSchemaFactory,
  ErrorMessageSchema,
} from '@libs/common';
import { LoginErrorValidationDto } from './dto/login-error-validation.dto';
import { RegisterErrorValidationDto } from './dto/register-error-validation.dto';
import { ForgetPasswordErrorValidationDto } from './dto/forget-password-error-validation.dto';
import { Throttle } from '@nestjs/throttler';
import { ResetPasswordErrorValidationDto } from './dto/reset-password-error-validation';
import { RefreshTokenErrorValidationDto } from './dto/refresh-token-error-validation';
import { ResendRegisterEmailDto } from './dto/resend-register-email.dto';
import { ResendRegisterEmailErrorValidationDto } from './dto/resend-register-email-error-validation.dto';
import { AuthTokenSchema, AuthTokenService } from '@libs/auth-token';
import { MailService } from '@domains/mail/mail.service';
import { UsersService } from '@domains/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class BasicAuthController {
  constructor(
    private readonly basicAuthService: BasicAuthService,
    private readonly userService: UsersService,
    private readonly authTokenService: AuthTokenService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: BasicSuccessSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(RegisterErrorValidationDto),
  })
  @ApiBadRequestResponse({
    description: 'User already exists',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async register(
    @Body() createAuthDto: RegisterUserDto,
  ): Promise<BasicSuccessSchema> {
    const user = await this.userService.register(createAuthDto);
    const token = this.authTokenService.generateRegisterToken({
      id: user.id,
    });
    this.mailService.sendRegisterMail(user, token);
    return { message: 'Registration Success' };
  }

  @Post('resend-email')
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiCreatedResponse({
    description: 'Email sent successfully',
    type: BasicSuccessSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(ResendRegisterEmailErrorValidationDto),
  })
  @ApiBadRequestResponse({
    description: 'User already exists',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async resendEmail(
    @Body() createAuthDto: ResendRegisterEmailDto,
  ): Promise<BasicSuccessSchema> {
    const user = await this.basicAuthService.validateResendEmail(createAuthDto);
    const token = this.authTokenService.generateRegisterToken({
      id: user.id,
    });
    this.mailService.sendRegisterMail(user, token);
    return { message: 'Resend email success' };
  }

  @Post('verify-email/:token')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiParam({ name: 'token', description: 'Email verification token' })
  @ApiCreatedResponse({
    description: 'Email verified successfully',
    type: AuthTokenSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: BasicErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'User already verified',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async verifyEmail(@Param('token') token: string): Promise<AuthTokenSchema> {
    const credential = this.authTokenService.verifyRegisterToken(token);
    const user = await this.basicAuthService.verifyEmail(credential);
    return this.authTokenService.createLoginToken(user);
  }

  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 1000 * 60 * 5 } })
  @ApiOperation({ summary: 'Login a user' })
  @ApiCreatedResponse({
    description: 'Login successfully',
    type: AuthTokenSchema,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BasicErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'User already verified',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(LoginErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthTokenSchema> {
    const user = await this.basicAuthService.login(loginDto);
    return this.authTokenService.createLoginToken(user);
  }

  @Post('forget-password')
  @Throttle({ default: { limit: 3, ttl: 1000 * 60 * 5 } })
  @ApiOperation({ summary: 'Request password reset' })
  @ApiCreatedResponse({
    description: 'Email sent successfully',
    type: BasicSuccessSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(ForgetPasswordErrorValidationDto),
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BasicErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'User already login with social account',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<BasicSuccessSchema> {
    const user = await this.basicAuthService.forgetPassword(forgetPasswordDto);
    const token = this.authTokenService.generateForgetPasswordToken({
      id: user.id,
    });
    this.mailService.sendForgetPasswordMail(user, token);
    return { message: 'Email sent successfully' };
  }

  @Put('reset-password/:token')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiParam({ name: 'token', description: 'Password reset token' })
  @ApiCreatedResponse({
    description: 'Password reset successful',
    type: BasicSuccessSchema,
  })
  @ApiBadRequestResponse({
    description: 'failed to reset password',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(ResetPasswordErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<BasicSuccessSchema> {
    const credential = this.authTokenService.verifyForgetPasswordToken(token);
    await this.userService.update(
      credential.id,
      {
        password: resetPasswordDto.password,
      },
      'Fail to update Password',
    );
    return { message: 'Password has been updated' };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCreatedResponse({
    description: 'Refresh token successful',
    type: AuthTokenSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(RefreshTokenErrorValidationDto),
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthTokenSchema> {
    const credential = this.authTokenService.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );
    const user =
      await this.basicAuthService.checkRefreshTokenCredential(credential);
    return this.authTokenService.createLoginToken(user);
  }
}
