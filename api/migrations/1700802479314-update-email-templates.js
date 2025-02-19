/* eslint-disable no-await-in-loop */
const { readdirSync } = require('fs');
const { readFileSync } = require('fs');
const { join, parse } = require('path');
const { DB, COLLECTION } = require('./lib');

const TEMPLATE_DIR = join(__dirname, '..', 'templates', 'emails');

const templateMap = {
  'admin-payout-request': {
    name: 'New payout request',
    subject: 'New payout request',
    desc: 'Email will be sent to admin to notify new payout request'
  },
  'performer-cancel-subscription': {
    name: 'Cancel susbscription email to creator',
    subject: 'Subscription Canceled',
    desc: 'Email notification to creator when user canceled a subscription'
  }
};

module.exports.up = async function up(next) {
  const files = readdirSync(TEMPLATE_DIR).filter((f) => f.includes('.html'));

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const content = readFileSync(join(TEMPLATE_DIR, file)).toString();
    const key = parse(file).name;
    templateMap[key] && await DB.collection(COLLECTION.EMAIL_TEMPLATE).updateOne({
      key
    }, {
      $set: {
        content,
        updatedAt: new Date()
      }
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
