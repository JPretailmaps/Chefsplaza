const {
  DB
} = require('./lib');

module.exports.up = async function up(next) {
  await DB.collection('reacts').updateMany({ action: 'book_mark' }, {
    $set: {
      action: 'bookmark'
    }
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
