const { DB, COLLECTION } = require('./lib');

module.exports.up = async function (next) {
  const subscriptions = await DB.collection(COLLECTION.USER_SUBSCRIPTIONS).find({}).toArray();

  if (!subscriptions.length) return;
  await subscriptions.reduce(async (cb, subscription) => {
    await cb;
    const conversation = await DB.collection(COLLECTION.CONVERSATIONS).findOne({
      type: 'private',
      recipients: {
        $all: [
          {
            source: 'user',
            sourceId: subscription.userId
          },
          {
            source: 'performer',
            sourceId: subscription.performerId
          }
        ]
      }
    });
    if (conversation) return Promise.resolve();
    await DB.collection(COLLECTION.CONVERSATIONS).insertOne({
      type: 'private',
      recipients: [
        {
          source: 'user',
          sourceId: subscription.userId
        },
        {
          source: 'performer',
          sourceId: subscription.performerId
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return Promise.resolve();
  }, Promise.resolve());
  next();
};

module.exports.down = function (next) {
  next();
};
