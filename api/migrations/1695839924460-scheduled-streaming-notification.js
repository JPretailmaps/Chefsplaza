const { readFileSync } = require('fs');
const { join } = require('path');
const { DB, COLLECTION } = require('./lib');

const TEMPLATE_DIR = join(__dirname, '..', 'templates', 'emails');

module.exports.up = async function up(next) {
  const content = readFileSync(join(TEMPLATE_DIR, 'scheduled-streaming-notification.html')).toString();
  const exist = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({ key: 'scheduled-streaming-notification' });

  if (!exist) {
    await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
      key: 'scheduled-streaming-notification',
      content,
      subject: 'Scheduled streaming notification',
      name: 'Scheduled streaming notification',
      description: 'Notification email will be sent to followers & subscribers once the creator scheduled a live streaming',
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
