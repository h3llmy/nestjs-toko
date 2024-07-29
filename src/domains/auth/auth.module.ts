import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategies } from './strategies/auth.strategies';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './guard/permissions.guard';
import { EncryptionModule } from '@app/encryption';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { RandomizeModule } from '@app/randomize';
import { AuthTokenService } from './authToken.service';

@Module({
  imports: [PassportModule, UsersModule, EncryptionModule, RandomizeModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokenService,
    JwtService,
    JwtStrategies,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [AuthService, AuthTokenService],
})
export class AuthModule {}
