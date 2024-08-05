import { ConfigService } from '@nestjs/config';
import { IPaymentGatewayAsyncOptions } from '../payment-gateway.interface';

export const paymentGatewayConfig: IPaymentGatewayAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    isProduction:
      configService.getOrThrow<string>('NODE_ENV', 'development') ===
      'production',
    serverKey: configService.getOrThrow<string>('MIDTRANS_SERVER_KEY'),
    clientKey: configService.getOrThrow<string>('MIDTRANS_CLIENT_KEY'),
  }),
};
