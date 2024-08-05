import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentGatewayService } from './payment-gateway.service';
import { PAYMENT_GATEWAY_OPTIONS } from './payment-gateway.constant';
import {
  IPaymentGatewayAsyncOptions,
  IPaymentGatewayOptions,
} from './payment-gateway.interface';

@Module({})
export class PaymentGatewayModule {
  /**
   * Creates a dynamic module for the PaymentGatewayModule.
   *
   * @param {IPaymentGatewayOptions} options - The options for the payment gateway.
   * @return {DynamicModule} The created dynamic module.
   */
  static forRoot(options: IPaymentGatewayOptions): DynamicModule {
    const paymentGatewayOptionsProvider: Provider = {
      provide: PAYMENT_GATEWAY_OPTIONS,
      useValue: options,
    };

    return {
      module: PaymentGatewayModule,
      providers: [paymentGatewayOptionsProvider, PaymentGatewayService],
      exports: [PaymentGatewayService],
    };
  }

  /**
   * Creates a dynamic module for the PaymentGatewayModule.
   *
   * @param {IPaymentGatewayAsyncOptions} options - The options for the async payment gateway.
   * @return {DynamicModule} The created dynamic module.
   */
  static forRootAsync(options: IPaymentGatewayAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: PaymentGatewayModule,
      imports: options.inject ? [ConfigModule] : [],
      providers: [
        ...asyncProviders,
        {
          provide: PaymentGatewayService,
          useFactory: (
            configService: ConfigService,
            gatewayOptions: IPaymentGatewayOptions,
          ) => {
            const midtransOptions: IPaymentGatewayOptions = {
              isProduction: gatewayOptions.isProduction,
              serverKey: gatewayOptions.serverKey,
              clientKey: gatewayOptions.clientKey,
            };
            return new PaymentGatewayService(midtransOptions);
          },
          inject: [ConfigService, PAYMENT_GATEWAY_OPTIONS],
        },
      ],
      exports: [PaymentGatewayService],
    };
  }

  /**
   * Creates an array of providers for asynchronous configuration of the PaymentGatewayModule.
   *
   * @param {IPaymentGatewayAsyncOptions} options - The options for the asynchronous payment gateway configuration.
   * @return {Provider[]} An array of providers for the PaymentGatewayModule.
   */
  private static createAsyncProviders(
    options: IPaymentGatewayAsyncOptions,
  ): Provider[] {
    return [
      {
        provide: PAYMENT_GATEWAY_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
  }
}
