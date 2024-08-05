import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthLoginDto } from './dto/google-auth-login.dto';
import { BasicAuthService } from '../basic-auth/basic-auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SocialAuthType } from '../social-auth.enum';
import { AuthTokenSchema } from '@libs/auth-token';
import {
  BasicErrorSchema,
  ErrorMessageSchema,
  validationErrorSchemaFactory,
} from '@libs/common';
import { GoogleAuthLoginErrorValidationDto } from './dto/google-auth-login-error-validation.dto';

@ApiTags('Auth')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly basicAuthService: BasicAuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with google' })
  @ApiCreatedResponse({
    description: 'Login successfully',
    type: AuthTokenSchema,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BasicErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'User email already used',
    type: BasicErrorSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: validationErrorSchemaFactory(GoogleAuthLoginErrorValidationDto),
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async login(@Body() loginDto: GoogleAuthLoginDto): Promise<AuthTokenSchema> {
    const socialProfile = await this.googleAuthService.getProfile(loginDto);

    return this.basicAuthService.validateSocialLogin(
      SocialAuthType.GOOGLE,
      socialProfile,
    );
  }
}
