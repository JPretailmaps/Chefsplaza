const {
  DB, COLLECTION
} = require('./lib');

module.exports.up = async function up(next) {
  await DB.collection(COLLECTION.SETTING).updateMany({
    public: true,
    autoload: null
  }, {
    $set: {
      autoload: true
    }
  });

  await DB.collection(COLLECTION.SETTING).updateMany({
    key: {
      $in: [
        'userBenefit',
        'modelBenefit',
        'footerContent',
        'loginPlaceholderImage',
        'homeTitle',
        'homeMetaKeywords',
        'homeMetaDescription',
        'headerScript',
        'afterBodyScript',
        'twitterClientId',
        'googleClientId'
      ]
    }
  }, {
    $set: {
      autoload: false
    }
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
