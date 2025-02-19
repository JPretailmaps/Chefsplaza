const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  // eslint-disable-next-line no-console
  console.log('Start updating subscription stats');
  const performers = await DB.collection(COLLECTION.PERFORMER).find({
    status: 'active'
  }).toArray();
  // eslint-disable-next-line no-restricted-syntax
  for (const performer of performers) {
    // eslint-disable-next-line no-await-in-loop
    const count = await DB.collection(COLLECTION.USER_SUBSCRIPTIONS).countDocuments({
      performerId: performer._id,
      status: 'active'
    });
    // eslint-disable-next-line no-await-in-loop
    await DB.collection(COLLECTION.PERFORMER).updateOne({
      _id: performer._id
    }, {
      $set: {
        'stats.subscribers': count || 0
      }
    });
  }
  const users = await DB.collection(COLLECTION.USER).find({
    status: 'active'
  }).toArray();
  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    // eslint-disable-next-line no-await-in-loop
    const count = await DB.collection(COLLECTION.USER_SUBSCRIPTIONS).countDocuments({
      userId: user._id,
      status: 'active'
    });
    // eslint-disable-next-line no-await-in-loop
    await DB.collection(COLLECTION.USER).updateOne({
      _id: user._id
    }, {
      $set: {
        'stats.totalSubscriptions': count || 0
      }
    });
  }
  // eslint-disable-next-line no-console
  console.log('Updated subscription stats done');
  next();
};

module.exports.down = function down(next) {
  next();
};
