/**
 * This file defines the routes for handling payments.
 * It uses Express.js to create a router that handles HTTP requests for creating, reading, updating, and deleting payments.
 * The routes are protected by an error handler middleware to catch and handle any errors that might occur.
 */

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const errorHandler = require('../middleware/errorHandler');

/**
 * POST /payments
 * Creates a new payment.
 * 
 * @param {Object} req.body - The request body containing the payment details.
 * @returns {JSON} The newly created payment.
 */
router.post('/', async (req, res, next) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /payments
 * Retrieves all payments.
 * 
 * @returns {JSON} An array of all payments.
 */
router.get('/', async (req, res, next) => {
  try {
    const payments = await Payment.find().populate('salesContract');
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /payments/:id
 * Retrieves a payment by its ID.
 * 
 * @param {String} req.params.id - The ID of the payment to retrieve.
 * @returns {JSON} The payment with the specified ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('salesContract');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /payments/:id
 * Updates a payment by its ID.
 * 
 * @param {String} req.params.id - The ID of the payment to update.
 * @param {Object} req.body - The request body containing the updated payment details.
 * @returns {JSON} The updated payment.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /payments/:id
 * Deletes a payment by its ID.
 * 
 * @param {String} req.params.id - The ID of the payment to delete.
 * @returns {JSON} A message indicating the payment was deleted successfully.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Middleware to handle errors
router.use(errorHandler);

module.exports = router;