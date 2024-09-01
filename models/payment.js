const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  salesContract: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesContract', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);