import { ConfigModuleOptions } from '@nestjs/config';

export const configModuleConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
};
