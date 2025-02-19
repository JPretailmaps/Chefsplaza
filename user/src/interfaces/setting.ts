export interface IError {
  statusCode: number;
  message: string;
}

export interface IContact {
  email: string;
  message: any;
  name: string;
}

export interface ISettings {
  requireEmailVerification: boolean;
  stripePublishableKey: string;
  paymentGateway: string;
  minimumSubscriptionPrice: number;
  maximumSubscriptionPrice: number;
  freeSubscriptionEnabled: boolean;
  freeSubscriptionDuration: number;
  minimumWalletPrice: number;
  maximumWalletPrice: number;
  minimumTipPrice: number;
  maximumTipPrice: number;
  minimumPayoutAmount: number;
}
