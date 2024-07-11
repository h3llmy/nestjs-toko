import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmModuleConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST', 'localhost'),
    port: configService.get<number>('POSTGRES_PORT', 5432),
    username: configService.get<string>('POSTGRES_USER', 'user'),
    password: configService.get<string>('POSTGRES_PASSWORD', ''),
    database: configService.get<string>('POSTGRES_DB', ''),
    autoLoadEntities:
      configService.get<string>('NODE_ENV', 'development') === 'development',
    synchronize:
      configService.get<string>('RUN_MIGRATIONS', 'false') === 'true',
    ssl: { rejectUnauthorized: false },
    logging: configService.get<string>('POSTGRES_LOGGING', 'false') === 'true',
  }),
};
