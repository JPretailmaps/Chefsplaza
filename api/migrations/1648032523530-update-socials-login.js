const {
  DB,
  COLLECTION
} = require('./lib');

module.exports.up = async function up(next) {
  // eslint-disable-next-line no-console
  console.log('Updating socials login');
  const users = await DB.collection(COLLECTION.USER).find({}).toArray();
  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    if (user.twitterProfile && user.twitterProfile.length) {
      // eslint-disable-next-line no-await-in-loop
      await DB.collection('oauthloginsocials').insertOne({
        source: 'user',
        sourceId: user._id,
        provider: 'twitter',
        value: user.twitterProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    if (user.googleProfile && user.googleProfile.length) {
      // eslint-disable-next-line no-await-in-loop
      await DB.collection('oauthloginsocials').insertOne({
        source: 'user',
        sourceId: user._id,
        provider: 'google',
        value: user.googleProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  const performers = await DB.collection(COLLECTION.PERFORMER).find({}).toArray();
  // eslint-disable-next-line no-restricted-syntax
  for (const performer of performers) {
    if (performer.twitterProfile && performer.twitterProfile.length) {
      // eslint-disable-next-line no-await-in-loop
      await DB.collection('oauthloginsocials').insertOne({
        source: 'performer',
        sourceId: performer._id,
        provider: 'twitter',
        value: performer.twitterProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    if (performer.googleProfile && performer.googleProfile.length) {
      // eslint-disable-next-line no-await-in-loop
      await DB.collection('oauthloginsocials').insertOne({
        source: 'performer',
        sourceId: performer._id,
        provider: 'google',
        value: performer.googleProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  // to remove old data
  await DB.collection(COLLECTION.USER).updateMany({ }, { $unset: { googleProfile: 1, twitterProfile: 1 } });
  await DB.collection(COLLECTION.PERFORMER).updateMany({ }, { $unset: { googleProfile: 1, twitterProfile: 1 } });

  // eslint-disable-next-line no-console
  console.log('Update socials login done');
  next();
};

module.exports.down = function down(next) {
  next();
};
