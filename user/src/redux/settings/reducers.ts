import { createReducers } from '@lib/redux';
import { merge } from 'lodash';

import { updateSettings } from './actions';

// TODO -
const initialState = {
  requireEmailVerification: false,
  stripePublishableKey: '',
  paymentGateway: 'stripe',
  freeSubscriptionEnabled: true,
  freeSubscriptionDuration: 1,
  minimumSubscriptionPrice: 2.95,
  maximumSubscriptionPrice: 300,
  minimumWalletPrice: 2.95,
  maximumWalletPrice: 300,
  minimumTipPrice: 10,
  maximumTipPrice: 10000,
  minimumPayoutAmount: 50
};

const settingReducers = [
  {
    on: updateSettings,
    reducer(state: any, data: any) {
      return {
        ...data.payload
      };
    }
  }
];

export default merge({}, createReducers('settings', [settingReducers], initialState));
