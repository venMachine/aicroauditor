const express = require('express')
const auth = require('../middleware/auth')
const Payment = require('../models/Payment')
const User = require('../models/User')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()

router.post('/create', auth, async (req, res) => {
  try {
    const { plan } = req.body
    const amount = plan === 'single' ? 999 : 2990

    const payment = new Payment({
      userId: req.userId,
      amount,
      plan,
      status: 'pending',
      externalId: uuidv4()
    })
    await payment.save()

    res.json({
      paymentId: payment._id,
      paymentUrl: `${process.env.FRONTEND_URL}/dashboard?mock_payment=${payment._id}`
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/mock-success', auth, async (req, res) => {
  try {
    const { paymentId } = req.body
    const payment = await Payment.findOne({ _id: paymentId, userId: req.userId })
    if (!payment) return res.status(404).json({ error: 'Payment not found' })

    payment.status = 'succeeded'
    await payment.save()

    const user = await User.findById(req.userId)
    user.credits += payment.plan === 'single' ? 1 : 5
    await user.save()

    res.json({ success: true, credits: user.credits })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/status/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.userId })
    res.json({ status: payment?.status || 'not_found' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
