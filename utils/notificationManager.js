const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const notifyAdmins = async (message, type) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const notifications = [];

    for (const admin of admins) {
      const notification = await createNotification(admin._id, message, type);
      notifications.e, type);
      notifications.push(notification);
    }
    return notifications;
  } catch (error) {
    console.error('Error notifying admins:', error);
    throw error;
  }
};

module.exports = { createNotification, sendEmail, notifyAdmins };