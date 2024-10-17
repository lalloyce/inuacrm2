/**
 * This file defines the routes for handling support tickets.
 * It uses Express.js to create a router that handles HTTP requests for creating, reading, updating, and deleting support tickets.
 * The routes are protected by an error handler middleware to catch and handle any errors that might occur during these operations.
 */

const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const errorHandler = require('../middleware/errorHandler');

/**
 * POST /support
 * Creates a new support ticket.
 * 
 * @param {Object} req.body - The request body containing the support ticket details.
 * @returns {JSON} The newly created support ticket.
 */
router.post('/', async (req, res, next) => {
  try {
    const supportTicket = new SupportTicket(req.body);
    await supportTicket.save();
    res.status(201).json(supportTicket);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /support
 * Retrieves all support tickets.
 * 
 * @returns {JSON} An array of all support tickets.
 */
router.get('/', async (req, res, next) => {
  try {
    const supportTickets = await SupportTicket.find().populate('customer').populate('assignedTo');
    res.json(supportTickets);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /support/:id
 * Retrieves a single support ticket by its ID.
 * 
 * @param {String} req.params.id - The ID of the support ticket to retrieve.
 * @returns {JSON} The support ticket with the specified ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const supportTicket = await SupportTicket.findById(req.params.id).populate('customer').populate('assignedTo');
    if (!supportTicket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }
    res.json(supportTicket);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /support/:id
 * Updates a single support ticket by its ID.
 * 
 * @param {String} req.params.id - The ID of the support ticket to update.
 * @param {Object} req.body - The request body containing the updated support ticket details.
 * @returns {JSON} The updated support ticket.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const supportTicket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supportTicket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }
    res.json(supportTicket);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /support/:id
 * Deletes a single support ticket by its ID.
 * 
 * @param {String} req.params.id - The ID of the support ticket to delete.
 * @returns {JSON} A success message if the support ticket is deleted.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const supportTicket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!supportTicket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }
    res.json({ message: 'Support ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Error handling middleware
 */
router.use(errorHandler);

/**
 * Exporting the router
 */
module.exports = router;