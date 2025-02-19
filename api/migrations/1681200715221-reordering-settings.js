const {
  DB,
  COLLECTION
} = require('./lib');

async function reorderSettings(group, arrayKeys = []) {
  const settings = await DB.collection(COLLECTION.SETTING).find({
    group
  }).toArray();
  let tmp = 0;
  await settings.reduce(async (lp, setting) => {
    await lp;
    const index = arrayKeys.indexOf(setting.key);
    let ordering = index;
    if (index === -1) {
      ordering = arrayKeys.length + tmp;
      tmp += 1;
    }
    await DB.collection(COLLECTION.SETTING).updateOne({
      _id: setting._id
    }, {
      $set: {
        ordering
      }
    });
  }, Promise.resolve());
}

module.exports.reorderSettings = reorderSettings;

module.exports.up = async function up(next) {
  // general tab
  await reorderSettings('general', [
    'siteName',
    'logoUrl',
    'favicon',
    'loginPlaceholderImage',
    'userBenefit',
    'modelBenefit',
    'footerContent',
    'performerVerifyNumber',
    'requireEmailVerification',
    'maintenanceMode'
  ]);

  // email tab
  await reorderSettings('email', [
    'adminEmail',
    'senderEmail'
  ]);

  // smtp
  // custom
  await reorderSettings('custom', [
    'homeTitle',
    'homeMetaKeywords',
    'homeMetaDescription',
    'headerScript',
    'afterBodyScript'
  ]);

  await reorderSettings('agora', [
    'agoraEnable',
    'agoraAppId',
    'agoraCertificate'
  ]);

  // socials
  await DB.collection(COLLECTION.SETTING).updateOne({
    key: 'googleHr'
  }, {
    $set: {
      value: null,
      name: 'Google Login',
      description: 'Provide login info for Google',
      public: false,
      group: 'socials',
      editable: true,
      type: 'hr',
      autoload: false
    }
  }, {
    upsert: true
  });
  await DB.collection(COLLECTION.SETTING).updateOne({
    key: 'twitterHr'
  }, {
    $set: {
      value: null,
      name: 'Twitter Login',
      description: 'Provide login info for Twitter',
      public: false,
      group: 'socials',
      editable: true,
      type: 'hr',
      autoload: false
    }
  }, {
    upsert: true
  });
  await reorderSettings('socials', [
    'googleHr',
    'googleClientId',
    'googleClientSecret',
    'twitterHr',
    'twitterClientId',
    'twitterLoginClientSecret'
  ]);

  next();
};

module.exports.down = function down(next) {
  next();
};