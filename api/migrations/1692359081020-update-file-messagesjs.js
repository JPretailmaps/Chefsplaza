const { DB, COLLECTION } = require('./lib');

module.exports.up = async function (next) {
  const messages = await DB.collection(COLLECTION.MESSAGES).find({}).toArray();

  if (!messages.length) return;
  await messages.reduce(async (lastPromise, message) => {
    await lastPromise;

    if (message?.type === 'media' || !message?.fileId || message?.fileIds?.length > 0) return Promise.resolve();
    await DB.collection(COLLECTION.MESSAGES).updateOne(
      { _id: message._id },
      {
        $set: {
          type: 'media'
        },
        $push: {
          fileIds: message.fileId
        },
        $unset: { fileId: null }
      }
    );
    return Promise.resolve();
  }, Promise.resolve());
  next();
};

module.exports.down = function (next) {
  next();
};
