const {
  DB
} = require('./lib');

module.exports.up = async function (next) {
  await DB.collection('settings').updateMany({ key: { $in: ['agoraAppId', 'agoraEnable'] } }, {
    $set: {
      autoload: true
    }
  });
  next();
};

module.exports.down = function (next) {
  next();
};
