const {
  DB
} = require('./lib');

module.exports.up = async function (next) {
  console.log('Start update earnings timestamp');
  const data = await DB.collection('earnings').find({}).toArray();
  const paymentIds = data.map((d) => d._id);
  const [payments, transactions] = await Promise.all([
    DB.collection('paymenttransactions').find({ _id: { $in: paymentIds } }).toArray(),
    DB.collection('purchaseditems').find({ _id: { $in: paymentIds } }).toArray()
  ]);
  await data.reduce(async (lp, earning) => {
    await lp;
    let payment = null;
    if (earning.isToken) {
      payment = transactions.find((t) => `${t._id}` === `${earning.transactionId}`);
    } else {
      payment = payments.find((t) => `${t._id}` === `${earning.transactionId}`);
    }
    if (payment) {
      await DB.collection('earnings').updateOne({
        _id: earning._id
      }, {
        $set: {
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt
        }
      });
    }
    return Promise.resolve();
  }, Promise.resolve());

  console.log('Updated earnings timestamp - DONE');
  next();
};

module.exports.down = function (next) {
  next();
};
