import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { configModuleConfig } from './config/configModule.config';
import { throttlerModuleConfig } from './config/throttlerModule.config';
import { cacheModuleConfig } from './config/cacheModule.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(configModuleConfig),
    ThrottlerModule.forRootAsync(throttlerModuleConfig),
    CacheModule.registerAsync(cacheModuleConfig),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class CommonModule {}
