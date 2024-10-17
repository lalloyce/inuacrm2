/**
 * This file defines the routes for managing sales contracts.
 * It uses Express.js to handle HTTP requests and responses.
 * The routes are defined for creating, reading, updating, and deleting sales contracts.
 * Error handling is implemented using a custom middleware.
 */

const express = require('express');
const router = express.Router();
const SalesContract = require('../models/SalesContract');
const errorHandler = require('../middleware/errorHandler');

/**
 * POST /sales
 * Creates a new sales contract.
 * 
 * @param {Object} req.body - The request body containing the sales contract data.
 * @returns {JSON} The newly created sales contract.
 */
router.post('/', async (req, res, next) => {
  try {
    const salesContract = new SalesContract(req.body);
    await salesContract.save();
    res.status(201).json(salesContract);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /sales
 * Retrieves all sales contracts.
 * 
 * @returns {JSON} An array of all sales contracts.
 */
router.get('/', async (req, res, next) => {
  try {
    const salesContracts = await SalesContract.find().populate('customer');
    res.json(salesContracts);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /sales/:id
 * Retrieves a single sales contract by its ID.
 * 
 * @param {String} req.params.id - The ID of the sales contract to retrieve.
 * @returns {JSON} The sales contract with the specified ID.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const salesContract = await SalesContract.findById(req.params.id).populate('customer');
    if (!salesContract) {
      return res.status(404).json({ message: 'Sales contract not found' });
    }
    res.json(salesContract);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /sales/:id
 * Updates a single sales contract by its ID.
 * 
 * @param {String} req.params.id - The ID of the sales contract to update.
 * @param {Object} req.body - The request body containing the updated sales contract data.
 * @returns {JSON} The updated sales contract.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const salesContract = await SalesContract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!salesContract) {
      return res.status(404).json({ message: 'Sales contract not found' });
    }
    res.json(salesContract);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /sales/:id
 * Deletes a single sales contract by its ID.
 * 
 * @param {String} req.params.id - The ID of the sales contract to delete.
 * @returns {JSON} A message indicating the sales contract was deleted successfully.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const salesContract = await SalesContract.findByIdAndDelete(req.params.id);
    if (!salesContract) {
      return res.status(404).json({ message: 'Sales contract not found' });
    }
    res.json({ message: 'Sales contract deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Middleware to handle errors globally.
 */
router.use(errorHandler);

module.exports = router;