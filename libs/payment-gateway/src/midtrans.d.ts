import { CreatePaymentTransaction } from './dto/create-payment-transaction.dto';
import { PaymentOrderResponseDto } from './dto/payment-order-response.dto';

declare module 'midtrans-client' {
  export declare class ApiConfig {
    static CORE_PRODUCTION_BASE_URL: string;
    static CORE_SANDBOX_BASE_URL: string;
    static SNAP_PRODUCTION_BASE_URL: string;
    static SNAP_SANDBOX_BASE_URL: string;
    static IRIS_PRODUCTION_BASE_URL: string;
    static IRIS_SANDBOX_BASE_URL: string;

    isProduction: boolean;
    serverKey: string;
    clientKey: string;

    constructor(options?: {
      isProduction?: boolean;
      serverKey?: string;
      clientKey?: string;
    });

    get(): {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    };

    set(options: {
      isProduction?: boolean;
      serverKey?: string;
      clientKey?: string;
    }): void;

    getCoreApiBaseUrl(): string;
    getSnapApiBaseUrl(): string;
    getIrisApiBaseUrl(): string;
  }
  export declare class HttpClient {
    constructor(parentObj?: any);
    request(
      httpMethod: string,
      serverKey: string,
      requestUrl: string,
      firstParam?: object | null,
      secondParam?: object | null,
    ): Promise<any>;
  }
  export declare class Transaction {
    parent: any;
    constructor(parentObj?: any);
    status(transactionId?: string): Promise<any>;
    statusb2b(transactionId?: string): Promise<any>;
    approve(transactionId?: string): Promise<any>;
    deny(transactionId?: string): Promise<any>;
    cancel(transactionId?: string): Promise<any>;
    expire(transactionId?: string): Promise<any>;
    refund(transactionId?: string, parameter?: any): Promise<any>;
    refundDirect(transactionId?: string, parameter?: any): Promise<any>;
    notification(notificationObj?: any): Promise<any>;
  }
  export declare class Snap {
    private apiConfig: ApiConfig;
    private httpClient: HttpClient;
    transaction: Transaction;

    constructor(options?: SnapOptions);

    createTransaction(
      parameter?: CreatePaymentTransaction,
    ): Promise<PaymentOrderResponseDto>;

    createTransactionToken(
      parameter?: CreatePaymentTransaction,
    ): Promise<string>;

    createTransactionRedirectUrl(
      parameter?: CreatePaymentTransaction,
    ): Promise<string>;
  }
  export declare class CoreApi {
    apiConfig: ApiConfig;
    httpClient: HttpClient;
    transaction: Transaction;

    constructor(options?: {
      isProduction?: boolean;
      serverKey?: string;
      clientKey?: string;
    });

    charge(parameter?: object): Promise<object>;
    capture(parameter?: object): Promise<object>;
    cardRegister(parameter?: object): Promise<object>;
    cardToken(parameter?: object): Promise<object>;
    cardPointInquiry(tokenId: string): Promise<object>;
    linkPaymentAccount(parameter?: object): Promise<object>;
    getPaymentAccount(accountId: string): Promise<object>;
    unlinkPaymentAccount(accountId: string): Promise<object>;
    createSubscription(parameter?: object): Promise<object>;
    getSubscription(subscriptionId: string): Promise<object>;
    disableSubscription(subscriptionId: string): Promise<object>;
    enableSubscription(subscriptionId: string): Promise<object>;
    updateSubscription(
      subscriptionId: string,
      parameter?: object,
    ): Promise<object>;
  }
  export declare class Iris {
    constructor(options?: IrisOptions);
    ping(): Promise<any>;
    createBeneficiaries(parameter?: any): Promise<any>;
    updateBeneficiaries(aliasName: string, parameter?: any): Promise<any>;
    getBeneficiaries(): Promise<any>;
    createPayouts(parameter?: any): Promise<any>;
    approvePayouts(parameter?: any): Promise<any>;
    rejectPayouts(parameter?: any): Promise<any>;
    getPayoutDetails(referenceNo: string): Promise<any>;
    getTransactionHistory(parameter?: any): Promise<any>;
    getTopupChannels(): Promise<any>;
    getBalance(): Promise<any>;
    getFacilitatorBankAccounts(): Promise<any>;
    getFacilitatorBalance(bankAccountId: string): Promise<any>;
    getBeneficiaryBanks(): Promise<any>;
    validateBankAccount(parameter?: any): Promise<any>;
  }
  export interface SnapOptions {
    isProduction?: boolean;
    serverKey: string;
    clientKey: string;
  }
  export interface IrisOptions {
    isProduction?: boolean;
    serverKey: string;
  }
}
