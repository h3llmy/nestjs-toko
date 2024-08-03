import { Module } from '@nestjs/common';
import { BasicAuthModule } from './basic-auth/basic-auth.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';

@Module({
  imports: [BasicAuthModule, GoogleAuthModule],
})
export class AuthModule {}
