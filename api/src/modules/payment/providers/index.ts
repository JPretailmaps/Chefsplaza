import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import {
  PaymentTransactionSchema, PaymentCardSchema, SubscriptionPlanSchema, PaymentCustomerSchema
} from '../schemas';

export const PAYMENT_TRANSACTION_MODEL_PROVIDER = 'PAYMENT_TRANSACTION_MODEL_PROVIDER';
export const SUBSCRIPTION_PLAN_MODEL_PROVIDER = 'SUBSCRIPTION_PLAN_MODEL_PROVIDER';
export const PAYMENT_CUSTOMER_MODEL_PROVIDER = 'PAYMENT_CUSTOMER_MODEL_PROVIDER';
export const PAYMENT_CARD_MODEL_PROVIDER = 'PAYMENT_CARD_MODEL_PROVIDER';

export const paymentProviders = [
  {
    provide: PAYMENT_TRANSACTION_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('PaymentTransaction', PaymentTransactionSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: SUBSCRIPTION_PLAN_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SubscriptionPlans', SubscriptionPlanSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: PAYMENT_CUSTOMER_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('PaymentCustomer', PaymentCustomerSchema),
    inject: [MONGO_DB_PROVIDER]
  },
  {
    provide: PAYMENT_CARD_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('PaymentCard', PaymentCardSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
