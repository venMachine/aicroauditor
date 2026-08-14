const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const LemonSqueezyService = require('../services/lemonsqueezyService')

const lemonService = new LemonSqueezyService()

// ===== СОЗДАНИЕ ПЛАТЕЖА (Lemon Squeezy) =====
router.post('/create', auth, async (req, res) => {
  try {
    const { plan } = req.body
    const userId = req.userId

    const plans = {
      single: { variantId: process.env.LEMON_SQUEEZY_PRODUCT_ID_SINGLE },
      monthly: { variantId: process.env.LEMON_SQUEEZY_PRODUCT_ID_MONTHLY }
    }

    const planData = plans[plan]
    if (!planData) {
      return res.status(400).json({ error: 'Неверный план' })
    }

    const result = await lemonService.createCheckout(
      planData.variantId,
      userId,
      plan
    )

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    res.json({
      paymentUrl: result.checkoutUrl,
      paymentId: result.checkoutId
    })

  } catch (error) {
    console.error(' Ошибка создания платежа:', error)
    res.status(500).json({ error: 'Ошибка создания платежа' })
  }
})

// ===== ВЕБХУК ДЛЯ LEMON SQUEEZY =====
router.post('/webhook/lemonsqueezy', async (req, res) => {
  try {
    const signature = req.headers['x-signature']
    const result = LemonSqueezyService.handleWebhook(req.body, signature)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    // Если есть userId - начисляем кредиты
    if (result.userId) {
      const user = await User.findById(result.userId)
      
      if (user) {
        const credits = result.plan === 'single' ? 1 : 5
        user.credits += credits
        await user.save()
        console.log(` Пользователь ${result.userId} получил ${credits} кредитов (Lemon Squeezy)`)
      }
    }

    res.status(200).json({ success: true })

  } catch (error) {
    console.error('❌ Ошибка вебхука Lemon Squeezy:', error)
    res.status(500).json({ error: 'Internal error' })
  }
})

// ===== ПРОВЕРКА СТАТУСА ПЛАТЕЖА =====
router.get('/status/:id', auth, async (req, res) => {
  try {
    res.json({ status: 'pending' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
