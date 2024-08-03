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
} from '@app/common';
import { LoginErrorValidationDto } from './dto/login-error-validation.dto';
import { RegisterErrorValidationDto } from './dto/register-error-validation.dto';
import { ForgetPasswordErrorValidationDto } from './dto/forget-password-error-validation.dto';
import { Throttle } from '@nestjs/throttler';
import { ResetPasswordErrorValidationDto } from './dto/reset-password-error-validation';
import { RefreshTokenErrorValidationDto } from './dto/refresh-token-error-validation';
import { ResendRegisterEmailDto } from './dto/resend-register-email.dto';
import { ResendRegisterEmailErrorValidationDto } from './dto/resend-register-email-error-validation.dto';
import { AuthTokenSchema } from '@app/auth-token';

@ApiTags('Auth')
@Controller('auth')
export class BasicAuthController {
  constructor(private readonly basicAuthService: BasicAuthService) {}

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
  register(
    @Body() createAuthDto: RegisterUserDto,
  ): Promise<BasicSuccessSchema> {
    return this.basicAuthService.register(createAuthDto);
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
  resendEmail(
    @Body() createAuthDto: ResendRegisterEmailDto,
  ): Promise<BasicSuccessSchema> {
    return this.basicAuthService.resendEmail(createAuthDto);
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
  verifyEmail(@Param('token') token: string): Promise<AuthTokenSchema> {
    return this.basicAuthService.verifyEmail(token);
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
  login(@Body() loginDto: LoginDto): Promise<AuthTokenSchema> {
    return this.basicAuthService.login(loginDto);
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
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<BasicSuccessSchema> {
    return this.basicAuthService.forgetPassword(forgetPasswordDto);
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
  resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<BasicSuccessSchema> {
    return this.basicAuthService.resetPassword(token, resetPasswordDto);
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
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthTokenSchema> {
    return this.basicAuthService.refreshToken(refreshTokenDto);
  }
}
