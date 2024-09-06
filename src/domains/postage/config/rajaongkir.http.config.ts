import { HttpModuleAsyncOptions } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export const rajaOngkirHttpConfig: HttpModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    baseURL: 'https://api.rajaongkir.com/starter',
    headers: {
      key: config.get<string>('RAJAONGKIR_API_KEY'),
    },
  }),
};
