/**
 * This file defines the routes for handling notifications.
 * It uses Express.js to create a router that handles HTTP requests for creating, reading, updating, and deleting notifications.
 * It also uses a custom errorHandler middleware to handle any errors that might occur during these operations.
 */

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const errorHandler = require('../middleware/errorHandler');

/**
 * POST /notifications
 * Creates a new notification.
 * 
 * @param {Object} req.body - The request body containing the notification details.
 * @returns {JSON} The newly created notification.
 */
router.post('/', async (req, res, next) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /notifications
 * Retrieves all notifications.
 * 
 * @returns {JSON} An array of all notifications.
 */
router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find().populate('user');
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /notifications/:id
 * Retrieves a single notification by its ID.
 * 
 * @param {String} req.params.id - The ID of the notification to retrieve.
 * @returns {JSON} The notification if found, otherwise a 404 error.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('user');
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /notifications/:id
 * Updates a single notification by its ID.
 * 
 * @param {String} req.params.id - The ID of the notification to update.
 * @param {Object} req.body - The request body containing the updated notification details.
 * @returns {JSON} The updated notification if found, otherwise a 404 error.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /notifications/:id
 * Deletes a single notification by its ID.
 * 
 * @param {String} req.params.id - The ID of the notification to delete.
 * @returns {JSON} A success message if the notification is found and deleted, otherwise a 404 error.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Middleware to handle any errors that might occur during the above operations
router.use(errorHandler);

module.exports = router;