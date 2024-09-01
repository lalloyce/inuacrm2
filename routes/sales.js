const express = require('express');
const router = express.Router();
const SalesContract = require('../models/SalesContract');
const errorHandler = require('../middleware/errorHandler');

router.post('/', async (req, res, next) => {
  try {
    const salesContract = new SalesContract(req.body);
    await salesContract.save();
    res.status(201).json(salesContract);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const salesContracts = await SalesContract.find().populate('customer');
    res.json(salesContracts);
  } catch (error) {
    next(error);
  }
});

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

router.use(errorHandler);

module.exports = router;