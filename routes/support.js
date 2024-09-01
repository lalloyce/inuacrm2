const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const errorHandler = require('../middleware/errorHandler');

router.post('/', async (req, res, next) => {
  try {
    const supportTicket = new SupportTicket(req.body);
    await supportTicket.save();
    res.status(201).json(supportTicket);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const supportTickets = await SupportTicket.find().populate('customer').populate('assignedTo');
    res.json(supportTickets);
  } catch (error) {
    next(error);
  }
});

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

router.use(errorHandler);

module.exports = router;