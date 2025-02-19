const { DB } = require('./lib');

module.exports.up = async function (next) {
  const feeds = await DB.collection('feeds').find({ }).toArray();
  await feeds.reduce(async (cb, feed) => {
    await cb;
    let total = 0;
    const comments = await DB.collection('comments').find({ objectId: feed._id }).toArray();
    total += comments.length;
    await comments.reduce(async (lp, comment) => {
      await lp;
      const replies = await DB.collection('comments').countDocuments({ objectId: comment._id });
      total = +replies;
      return Promise.resolve();
    }, Promise.resolve());
    await DB.collection('feeds').updateOne({ _id: feed._id }, {
      $set: {
        totalComment: total
      }
    });
    return Promise.resolve();
  }, Promise.resolve());

  const videos = await DB.collection('performervideos').find({ }).toArray();
  await videos.reduce(async (cb, video) => {
    await cb;
    let total = 0;
    const comments = await DB.collection('comments').find({ objectId: video._id }).toArray();
    total += comments.length;
    await comments.reduce(async (lp, comment) => {
      await lp;
      const replies = await DB.collection('comments').countDocuments({ objectId: comment._id });
      total = +replies;
      return Promise.resolve();
    }, Promise.resolve());
    await DB.collection('performervideos').updateOne({ _id: video._id }, {
      $set: {
        'stats.comments': total
      }
    });
    return Promise.resolve();
  }, Promise.resolve());

  next();
};

module.exports.down = function (next) {
  next();
};
