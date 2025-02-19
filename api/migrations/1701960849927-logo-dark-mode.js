const { DB, COLLECTION } = require('./lib');
const { reorderSettings } = require('./1681200715221-reordering-settings');

const SETTING_KEYS = {
  DARKMODE_LOGO_URL: 'darkmodeLogoUrl'
};

const settings = [
  {
    key: SETTING_KEYS.DARKMODE_LOGO_URL,
    value: '',
    name: 'Darkmode Logo',
    description: 'The logo for darkmode',
    public: true,
    group: 'general',
    editable: true,
    autoload: true,
    meta: {
      upload: true,
      image: true
    }
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
  await reorderSettings('general', [
    'siteName',
    'logoUrl',
    'darkmodeLogoUrl',
    'favicon',
    'loginPlaceholderImage',
    'userBenefit',
    'modelBenefit',
    'footerContent',
    'performerVerifyNumber',
    'requireEmailVerification',
    'maintenanceMode'
  ]);

  next();
};

module.exports.down = function (next) {
  next();
};
