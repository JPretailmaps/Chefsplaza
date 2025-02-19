/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { readdirSync } = require('fs');
const { readFileSync } = require('fs');
const { join, parse } = require('path');
const { DB, COLLECTION } = require('./lib');

const TEMPLATE_DIR = join(__dirname, '..', 'templates', 'emails');

const templateMap = {
  'admin-report': {
    name: 'Admin content get reported',
    subject: 'User report a post',
    desc: 'Notification email will be sent to administrator once a user reports a post'
  },
  'admin-refund-order': {
    name: 'Admin refunded order',
    subject: 'Order refunded',
    desc: 'Notification email will be sent to administrator once a creator refunded an physical order'
  },
  'admin-cancel-subscription': {
    name: 'Cancel susbscription email to admin',
    subject: 'Subscription canceled',
    desc: 'Notification email will be sent to administrator once a user canceled a subscription'
  },
  'admin-coupon-used': {
    name: 'Admin coupon used',
    subject: 'Coupon Used',
    desc: 'Notification email will be sent to administrator once a user used a coupon'
  },
  'performer-live-notify-admin': {
    name: 'Admin notification creator live',
    subject: 'Creator start streaming',
    desc: 'Notification email will be sent to administrator once the creator start streaming'
  },
  'performer-report': {
    name: 'Creator content get reported',
    subject: 'User reported a post',
    desc: 'Notification email will be sent to creator once a user reports a post'
  },
  'performer-follow': {
    name: 'Notification to creator follow/unfollow',
    subject: 'User follow/unfollow',
    desc: 'Notification email will be sent to creator once a user follow/unfollow'
  },
  'performer-physical-product': {
    name: 'Creator new order product',
    subject: 'New Order',
    desc: 'Notification email will be sent to creator once a user ordered physical product'
  },
  'performer-comment-content': {
    name: 'Creator new comment',
    subject: 'New comment',
    desc: 'Notification email will be sent to creator once a user comments on his content'
  },
  'performer-like-content': {
    name: 'Creator new like',
    subject: 'Liked content',
    desc: 'Notification email will be sent to creator once a user liked a video/post'
  },
  'performer-voted-poll': {
    name: 'Creator voted poll',
    subject: 'Voted a poll',
    desc: 'Notification email will be sent to creator once a user voted a poll'
  },
  'update-order-delivery-address': {
    name: 'Creator delivery address changed',
    subject: 'Delivery address changed',
    desc: 'Notification email will be sent to creator once a user changed the delivery address'
  },
  'performer-content-deleted': {
    name: 'Creator content was deleted',
    subject: 'Content was deleted',
    desc: 'Notification email will be sent to creator once a administrator deleted his content'
  },
  'performer-tip-success': {
    name: 'Creator new tip',
    subject: 'You have a tip',
    desc: 'Notification email will be sent to creator once a user sent a tip'
  },
  'performer-scheduled-streaming-notification': {
    name: 'Creator scheduled streaming remindation',
    subject: 'You have a scheduled live streaming',
    desc: 'Notification email will be sent to creator to remind a scheduled live streaming'
  },
  'user-new-content': {
    name: 'User new content',
    subject: 'New content',
    desc: 'Notification email will be sent to subscriber/follower once a creator publish new content'
  },
  'user-refunded-order': {
    name: 'User refunded order',
    subject: 'Refunded order',
    desc: 'Notification email will be sent to user once a his order was refunded'
  }
};

module.exports.up = async function up(next) {
  const files = readdirSync(TEMPLATE_DIR).filter((f) => f.includes('.html'));
  for (const file of files) {
    const content = readFileSync(join(TEMPLATE_DIR, file)).toString();
    const key = parse(file).name;
    const exist = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({ key });
    if (!exist) {
      templateMap[key] && await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
        key,
        content,
        subject: templateMap[key] ? templateMap[key].subject : null,
        name: templateMap[key] ? templateMap[key].name : key,
        description: templateMap[key] ? templateMap[key].desc : 'N/A',
        layout: 'layouts/default',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
