import { ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

export const throttlerModuleConfig: ThrottlerAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return {
      throttlers: [
        {
          ttl: config.get<number>('THROTTLE_TTL'),
          limit: config.get<number>('THROTTLE_LIMIT'),
        },
      ],
      errorMessage: 'Too many requests',
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD', ''),
          retryStrategy(times: number) {
            // Retry after 2 seconds multiplied by the number of attempts
            return Math.min(times * 2000, 10000);
          },
        }),
      ),
    };
  },
};
