const { readFileSync } = require('fs');
const { join } = require('path');
const { DB, COLLECTION } = require('./lib');

const TEMPLATE_DIR = join(__dirname, '..', 'templates', 'emails');

module.exports.up = async function up(next) {
  const content = readFileSync(join(TEMPLATE_DIR, 'performer-live-notify-followers.html')).toString();
  const exist = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({ key: 'performer-live-notify-followers' });

  if (!exist) {
    await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
      key: 'performer-live-notify-followers',
      content,
      subject: 'New live',
      name: 'Notify live streaming',
      description: 'Notification email will be sent to followers once the creator go live',
      layout: 'layouts/default',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
