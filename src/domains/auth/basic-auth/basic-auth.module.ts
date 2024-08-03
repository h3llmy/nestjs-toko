import { Module } from '@nestjs/common';
import { BasicAuthService } from './basic-auth.service';
import { BasicAuthController } from './basic-auth.controller';
import { UsersModule } from '../../users/users.module';
import { JwtStrategies } from '../strategies/auth.strategies';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from '../guard/permissions.guard';
import { EncryptionModule } from '@app/encryption';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { RandomizeModule } from '@app/randomize';
import { AuthTokenModule } from '@app/auth-token';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    EncryptionModule,
    RandomizeModule,
    AuthTokenModule,
  ],
  controllers: [BasicAuthController],
  providers: [
    BasicAuthService,
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
  exports: [BasicAuthService],
})
export class BasicAuthModule {}
