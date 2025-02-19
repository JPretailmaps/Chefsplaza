const {
  DB,
  COLLECTION
} = require('./lib');

module.exports.up = async function up(next) {
  // eslint-disable-next-line no-console
  console.log('Update payment card settings');
  const payments = await DB.collection(COLLECTION.PAYMENT).find({
    paymentGateway: 'stripe'
  }).toArray();
  // eslint-disable-next-line no-restricted-syntax
  for (const payment of payments) {
    if (payment.stripeInvoiceId) {
      // eslint-disable-next-line no-await-in-loop
      await DB.collection(COLLECTION.PAYMENT).updateOne({
        _id: payment._id
      }, {
        $set: {
          invoiceId: payment.stripeInvoiceId
        },
        $unset: { stripeConfirmUrl: 1, liveMode: 1, stripeInvoiceId: 1 }
      });
    }
  }

  // eslint-disable-next-line no-console
  console.log('Update payment token done');
  next();
};

module.exports.down = function down(next) {
  next();
};
