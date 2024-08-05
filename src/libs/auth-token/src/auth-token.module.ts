import { Module } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthTokenService, JwtService],
  exports: [AuthTokenService, JwtService],
})
export class AuthTokenModule {}
