const { createHash } = require('node:crypto');

const {
  DB, COLLECTION, generateSalt, encryptPassword
} = require('../migrations/lib');

const purePassword = 'adminadmin';
const defaultPassword = createHash('md5').update(purePassword).digest('hex');

async function createAuth(newUser, userId, type = 'password') {
  const authCheck = await DB.collection(COLLECTION.AUTH).findOne({
    type,
    source: 'user',
    sourceId: userId
  });
  const salt = authCheck.salt || generateSalt();
  if (!authCheck) {
    await DB.collection(COLLECTION.AUTH).insertOne({
      type,
      source: 'user',
      sourceId: userId,
      salt,
      value: encryptPassword(defaultPassword, salt),
      key: type === 'email' ? newUser.email : newUser.username
    });
  } else {
    await DB.collection(COLLECTION.AUTH).updateOne({
      source: 'user',
      sourceId: userId
    }, {
      $set: {
        type,
        salt,
        value: encryptPassword(defaultPassword, salt),
        key: type === 'email' ? newUser.email : newUser.username
      }
    });
  }
}

module.exports = async () => {
  const adminUsers = await DB.collection(COLLECTION.USER).find({ roles: 'admin' }).toArray();
  // eslint-disable-next-line no-restricted-syntax
  for (const admin of adminUsers) {
    // eslint-disable-next-line no-await-in-loop
    await createAuth(admin, admin._id, 'password');
  }
};
