export interface IPaymentGatewayOptions {
  isProduction: boolean;
  serverKey: string;
  clientKey: string;
}

export interface IPaymentGatewayAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<IPaymentGatewayOptions> | IPaymentGatewayOptions;
  inject?: any[];
}
