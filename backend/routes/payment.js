const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
// const LemonSqueezyService = require('../services/lemonsqueezyService') // 👈 ВРЕМЕННО ОТКЛЮЧИЛИ
const YooKassaService = require('../services/yookassaService')

// const lemonService = new LemonSqueezyService() // 👈 ВРЕМЕННО ОТКЛЮЧИЛИ
const yookassaService = new YooKassaService()

// ===== СОЗДАНИЕ ПЛАТЕЖА =====
router.post('/create', auth, async (req, res) => {
  try {
    const { plan } = req.body // currency больше не нужен
    const userId = req.userId

    const plans = {
      single: { 
        amount: 999, 
        label: 'Разовый аудит'
      },
      monthly: { 
        amount: 2990,
        label: 'Подписка на месяц'
      }
    }

    const planData = plans[plan]
    if (!planData) {
      return res.status(400).json({ error: 'Неверный план' })
    }

    // 👇 ТОЛЬКО ЮKassa
    const result = await yookassaService.createPayment(
      planData.amount,
      planData.label,
      userId,
      plan
    )

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.json({
      paymentUrl: result.paymentUrl,
      paymentId: result.paymentId,
      provider: 'yookassa'
    })

  } catch (error) {
    console.error('❌ Ошибка создания платежа:', error)
    res.status(500).json({ error: 'Ошибка создания платежа' })
  }
})

// ===== ВЕБХУК ЮKASSA =====
router.post('/webhook/yookassa', async (req, res) => {
  try {
    const event = req.body
    
    if (event.object && event.object.status) {
      const result = await yookassaService.handleWebhook(event)
      
      if (!result.success) {
        return res.status(400).json({ error: result.error })
      }

      if (result.userId) {
        const user = await User.findById(result.userId)
        
        if (user) {
          const credits = result.plan === 'single' ? 1 : 5
          user.credits += credits
          await user.save()
          console.log(`✅ Пользователь ${result.userId} получил ${credits} кредитов (ЮKassa)`)
        }
      }
    }

    res.status(200).json({ success: true })

  } catch (error) {
    console.error('❌ Ошибка вебхука ЮKassa:', error)
    res.status(500).json({ error: 'Internal error' })
  }
})

//  ВЕБХУК LEMON SQUEEZY — ВРЕМЕННО ОТКЛЮЧИЛИ
// router.post('/webhook/lemonsqueezy', async (req, res) => {
//   ...
// })

// ===== ПРОВЕРКА СТАТУСА ПЛАТЕЖА =====
router.get('/status/:id', auth, async (req, res) => {
  try {
    res.json({ status: 'pending' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

