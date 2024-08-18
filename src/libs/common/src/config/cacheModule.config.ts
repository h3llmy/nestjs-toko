import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

export const cacheModuleConfig: CacheModuleAsyncOptions = {
  inject: [ConfigService],
  isGlobal: true,
  useFactory: async (config: ConfigService) => ({
    store: await redisStore({
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: config.get<string>('REDIS_PASSWORD', ''),
    }),
  }),
};
