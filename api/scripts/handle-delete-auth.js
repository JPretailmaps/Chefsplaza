/* eslint-disable no-await-in-loop */
const {
  DB
} = require('../migrations/lib');

const mongoose = require('mongoose');

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

module.exports = async () => {
  const auths = await DB.collection('auth').find({}).toArray();
  await auths.reduce(async(lp, auth) => {
    await lp;
    const id = toObjectId(auth.sourceId)
    if (auth.source === 'user') {
      const user = await DB.collection('users').findOne({ _id: id });
      if (!user) {
        await DB.collection('auth').deleteOne({ _id: id })
      }
    }
    if (auth.source === 'performer') {
      const performer = await DB.collection('performers').findOne({ _id: id });
      if (!performer) {
        await DB.collection('auth').deleteOne({ _id: id })
      }
    }
    return Promise.resolve()
  }, Promise.resolve())
};
