const { reorderSettings } = require('./1681200715221-reordering-settings');
const {
  DB
} = require('./lib');

module.exports.up = async function up(next) {
  const twitterEnabled = await DB.collection('settings').findOne({ key: 'twitterLoginEnabled' });
  if (!twitterEnabled) {
    await DB.collection('settings').insertOne({
      key: 'twitterLoginEnabled',
      value: false,
      name: 'Enable Twitter login',
      description: 'Enable/disable Twitter login. The button will be shown/hided in the user end',
      public: true,
      autoload: false,
      group: 'socials',
      editable: true,
      visible: true,
      type: 'boolean',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  const googleLoginEnabled = await DB.collection('settings').findOne({ key: 'googleLoginEnabled' });
  if (!googleLoginEnabled) {
    await DB.collection('settings').insertOne({
      key: 'googleLoginEnabled',
      value: false,
      name: 'Enable Google login',
      description: 'Enable/disable Google login. The button will be shown/hided in the user end',
      public: true,
      autoload: false,
      group: 'socials',
      editable: true,
      visible: true,
      type: 'boolean',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // rename google login key
  await DB.collection('settings').updateOne({
    key: 'googleClientId'
  }, {
    $set: {
      key: 'googleLoginClientId'
    }
  });
  await DB.collection('settings').updateOne({
    key: 'googleClientSecret'
  }, {
    $set: {
      key: 'googleLoginClientSecret'
    }
  });

  await DB.collection('settings').updateOne({
    key: 'twitterClientId'
  }, {
    $set: {
      key: 'twitterLoginClientId'
    }
  });
  await DB.collection('settings').updateOne({
    key: 'twitterClientSecret'
  }, {
    $set: {
      key: 'twitterLoginClientSecret'
    }
  });

  await reorderSettings('socials', [
    'googleHr',
    'googleLoginClientId',
    'googleLoginClientSecret',
    'googleLoginEnabled',
    'twitterHr',
    'twitterLoginClientId',
    'twitterLoginClientSecret',
    'twitterLoginEnabled'
  ]);

  next();
};

module.exports.down = function down(next) {
  next();
};
