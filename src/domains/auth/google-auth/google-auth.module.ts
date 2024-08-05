import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { UsersModule } from '@domains/users/users.module';
import { BasicAuthModule } from '../basic-auth/basic-auth.module';
import { AuthTokenModule } from '@libs/auth-token';

@Module({
  imports: [UsersModule, AuthTokenModule, BasicAuthModule],
  providers: [GoogleAuthService],
  controllers: [GoogleAuthController],
})
export class GoogleAuthModule {}
