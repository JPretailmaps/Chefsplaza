const {
  DB,
  COLLECTION
} = require('./lib');

module.exports.up = async function up(next) {
  // eslint-disable-next-line no-console
  console.log('Update payment card settings');
  const users = await DB.collection(COLLECTION.USER).find({}).toArray();
  const stripeSecretKey = await DB.collection(COLLECTION.SETTING).findOne({
    key: 'stripeSecretKey'
  });
  if (!stripeSecretKey) {
    next();
    return;
  }
  const isProduction = stripeSecretKey && stripeSecretKey.value && stripeSecretKey.value.includes('live');
  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    if (user.stripeCardIds && user.stripeCardIds.length > 0 && user.stripeCustomerId) {
      const name = (user.firstName && user.lastName && `${user.firstName} ${user.lastName}`) || user.name || user.username;
      // eslint-disable-next-line no-await-in-loop
      await DB.collection('paymentcards').insertOne({
        isProduction,
        holderName: name,
        token: user.stripeCardIds[0],
        customerId: user.stripeCustomerId,
        source: 'user',
        sourceId: user._id,
        paymentGateway: 'stripe'
      });
      // eslint-disable-next-line no-await-in-loop
      await DB.collection('paymentcustomers').insertOne({
        isProduction,
        customerId: user.stripeCustomerId,
        source: 'user',
        sourceId: user._id,
        paymentGateway: 'stripe',
        name,
        email: user.email
      });
    }
  }
  // to remove old data
  await DB.collection(COLLECTION.USER).updateMany({ }, { $unset: { stripeCardIds: 1, stripeCustomerId: 1 } });

  // eslint-disable-next-line no-console
  console.log('Update payment card settings done');
  next();
};

module.exports.down = function down(next) {
  next();
};
