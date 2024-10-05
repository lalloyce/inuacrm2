/**
 * This file contains utility functions for managing notifications within the application.
 * It includes functions for creating notifications and notifying administrators.
 */

const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Creates a new notification for a given user.
 * 
 * @param {String} userId - The ID of the user to whom the notification is addressed.
 * @param {String} message - The message content of the notification.
 * @param {String} type - The type of the notification.
 * @returns {Promise} A promise that resolves to the newly created notification.
 */
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

/**
 * Notifies all administrators with a given message and type.
 * 
 * @param {String} message - The message content of the notification.
 * @param {String} type - The type of the notification.
 * @returns {Promise} A promise that resolves to an array of notifications sent to administrators.
 */
const notifyAdmins = async (message, type) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const notifications = [];

    for (const admin of admins) {
      const notification = await createNotification(admin._id, message, type);
      notifications.push(notification);
    }
    return notifications;
  } catch (error) {
    console.error('Error notifying admins:', error);
    throw error;
  }
};

module.exports = { createNotification, notifyAdmins };