const {
  DB, COLLECTION
} = require('./lib');

module.exports.up = async function up(next) {
  await DB.collection(COLLECTION.AUTH).deleteMany({
    type: 'username'
  });

  await DB.collection(COLLECTION.AUTH).updateMany({
    type: 'email'
  }, {
    $set: {
      type: 'password'
    }
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
