const { DB, COLLECTION } = require('./lib');
const { reorderSettings } = require('./1681200715221-reordering-settings');

const SETTING_KEYS = {
  FREE_SUBSCRIPTION_HR: 'freeSubscriptionHr',
  FREE_SUBSCRIPTION_ENABLED: 'freeSubscriptionEnabled',
  FREE_SUBSCRIPTION_DURATION: 'freeSubscriptionDuration',
  SUBSCRIPTION_PRICING_HR: 'subscriptionPricingHr',
  MINIMUM_SUBSCRIPTION_PRICE: 'minimumSubscriptionPrice',
  MAXIMUM_SUBSCRIPTION_PRICE: 'maximumSubscriptionPrice',
  WALLET_PRICING_HR: 'walletPricingHr',
  MINIMUM_WALLET_PRICE: 'minimumWalletPrice',
  MAXIMUM_WALLET_PRICE: 'maximumWalletPrice',
  TIP_PRICING_HR: 'tipPricingHr',
  MINIMUM_TIP_PRICE: 'minimumTipPrice',
  MAXIMUM_TIP_PRICE: 'maximumTipPrice',
  PAYOUT_PRICING_HR: 'payoutPricingHr',
  MINIMUM_PAYOUT_AMOUNT: 'minimumPayoutAmount'
};

const settings = [
  {
    key: SETTING_KEYS.FREE_SUBSCRIPTION_HR,
    value: null,
    name: 'Free Subscription',
    public: false,
    group: 'subscription',
    editable: true,
    type: 'hr'
  },
  {
    key: SETTING_KEYS.FREE_SUBSCRIPTION_ENABLED,
    value: true,
    name: 'Disable free subscription',
    description: 'Enable/disable free subscription. This will enable/disable the free subscription on all creators',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'boolean',
    autoload: true
  },
  {
    key: SETTING_KEYS.FREE_SUBSCRIPTION_DURATION,
    value: 1,
    name: 'Free subscription duration (days)',
    description: 'Apply free subscription duration on all creators',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  },
  {
    key: SETTING_KEYS.SUBSCRIPTION_PRICING_HR,
    value: null,
    name: 'Subscription Pricing',
    public: false,
    group: 'subscription',
    editable: true,
    type: 'hr'
  }, {
    key: SETTING_KEYS.MINIMUM_SUBSCRIPTION_PRICE,
    value: 2.95,
    name: 'Minimum subscription price',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  },
  {
    key: SETTING_KEYS.MAXIMUM_SUBSCRIPTION_PRICE,
    value: 300,
    name: 'Maximum subscription price',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  },
  {
    key: SETTING_KEYS.WALLET_PRICING_HR,
    value: null,
    name: 'Wallet',
    public: false,
    group: 'subscription',
    editable: true,
    type: 'hr'
  },
  {
    key: SETTING_KEYS.MINIMUM_WALLET_PRICE,
    value: 10,
    name: 'Minimum top up wallet amount',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  },
  {
    key: SETTING_KEYS.MAXIMUM_WALLET_PRICE,
    value: 10000,
    name: 'Maximum top up wallet amount',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  },
  {
    key: SETTING_KEYS.TIP_PRICING_HR,
    value: null,
    name: 'Tipping',
    public: false,
    group: 'subscription',
    editable: true,
    type: 'hr'
  },
  {
    key: SETTING_KEYS.MINIMUM_TIP_PRICE,
    value: 10,
    name: 'Minimum tipping amount',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  },
  {
    key: SETTING_KEYS.MAXIMUM_TIP_PRICE,
    value: 10000,
    name: 'Maximum tipping amount',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  },
  {
    key: SETTING_KEYS.PAYOUT_PRICING_HR,
    value: null,
    name: 'Payout',
    public: false,
    group: 'subscription',
    editable: true,
    type: 'hr'
  },
  {
    key: SETTING_KEYS.MINIMUM_PAYOUT_AMOUNT,
    value: 50,
    name: 'Minimum payout amount',
    public: true,
    group: 'subscription',
    editable: true,
    type: 'number',
    autoload: true
  }
];

module.exports.up = async function (next) {
  // eslint-disable-next-line no-restricted-syntax
  for (const setting of settings) {
    // eslint-disable-next-line no-await-in-loop
    const checkKey = await DB.collection(COLLECTION.SETTING).findOne({
      key: setting.key
    });
    if (!checkKey) {
      // eslint-disable-next-line no-await-in-loop
      await DB.collection(COLLECTION.SETTING).insertOne({
        ...setting,
        type: setting.type || 'text',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      // eslint-disable-next-line no-console
      console.log(`Inserted setting: ${setting.key}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Setting: ${setting.key} exists`);
    }
  }
  // Reorder settings
  await reorderSettings('subscription', [
    SETTING_KEYS.FREE_SUBSCRIPTION_HR,
    SETTING_KEYS.FREE_SUBSCRIPTION_ENABLED,
    SETTING_KEYS.FREE_SUBSCRIPTION_DURATION,
    SETTING_KEYS.SUBSCRIPTION_PRICING_HR,
    SETTING_KEYS.MINIMUM_SUBSCRIPTION_PRICE,
    SETTING_KEYS.MAXIMUM_SUBSCRIPTION_PRICE,
    SETTING_KEYS.WALLET_PRICING_HR,
    SETTING_KEYS.MINIMUM_WALLET_PRICE,
    SETTING_KEYS.MAXIMUM_WALLET_PRICE,
    SETTING_KEYS.TIP_PRICING_HR,
    SETTING_KEYS.MINIMUM_TIP_PRICE,
    SETTING_KEYS.MAXIMUM_TIP_PRICE,
    SETTING_KEYS.PAYOUT_PRICING_HR,
    SETTING_KEYS.MINIMUM_PAYOUT_AMOUNT
  ]);

  await DB.collection(COLLECTION.SETTING).updateMany({ group: 'subscription' }, { $set: { group: 'pricing' } });

  next();
};

module.exports.down = function (next) {
  next();
};
