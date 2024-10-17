/**
 * This file contains all the routes related to customers.
 * It uses the Customer model and the errorHandler middleware.
 */

const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const errorHandler = require('../middleware/errorHandler');

/**
 * POST route to create a new customer.
 * It expects a JSON body with the customer details.
 * If successful, it returns the created customer with a status code of 201.
 * If an error occurs, it passes the error to the errorHandler middleware.
 */
router.post('/', async (req, res, next) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});

/**
 * GET route to retrieve all customers.
 * If successful, it returns an array of customers.
 * If an error occurs, it passes the error to the errorHandler middleware.
 */
router.get('/', async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

/**
 * GET route to retrieve a specific customer.
 * It expects the customer ID as a parameter.
 * If the customer is not found, it returns a 404 status code with a message.
 * If an error occurs, it passes the error to the errorHandler middleware.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT route to update a specific customer.
 * It expects the customer ID as a parameter and a JSON body with the updated details.
 * If the customer is not found, it returns a 404 status code with a message.
 * If an error occurs, it passes the error to the errorHandler middleware.
 */
router.put('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE route to delete a specific customer.
 * It expects the customer ID as a parameter.
 * If the customer is not found, it returns a 404 status code with a message.
 * If an error occurs, it passes the error to the errorHandler middleware.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * Use the errorHandler middleware for any errors that occur in the routes.
 */
router.use(errorHandler);

module.exports = router;