const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  currency: { type: String, default: 'RUB' },
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  plan: { type: String, enum: ['single', 'monthly'] },
  externalId: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Payment', PaymentSchema)
