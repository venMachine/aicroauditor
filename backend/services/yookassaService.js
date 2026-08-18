const axios = require('axios')

class YooKassaService {
  constructor() {
    this.shopId = process.env.YOKASSA_SHOP_ID
    this.secretKey = process.env.YOKASSA_SECRET_KEY
    this.baseUrl = 'https://api.yookassa.ru/v3'
  }

  async createPayment(amount, description, userId, plan) {
    try {
      const auth = Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64')
      
      const response = await axios.post(
        `${this.baseUrl}/payments`,
        {
          amount: {
            value: amount,
            currency: 'RUB'
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`
          },
          description: description,
          metadata: {
            user_id: userId,
            plan: plan
          }
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Idempotence-Key': `${Date.now()}-${userId}`
          }
        }
      )

      return {
        success: true,
        paymentUrl: response.data.confirmation.confirmation_url,
        paymentId: response.data.id
      }

    } catch (error) {
      console.error('❌ Ошибка ЮKassa:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.description || 'Ошибка оплаты'
      }
    }
  }

  async handleWebhook(event) {
    try {
      const object = event.object
      
      if (object.status === 'succeeded') {
        const { user_id, plan } = object.metadata
        
        if (!user_id) {
          console.error('❌ Нет user_id в метаданных')
          return { success: false, error: 'No user_id' }
        }

        return {
          success: true,
          userId: user_id,
          plan: plan,
          paymentId: object.id
        }
      }

      return { success: true }

    } catch (error) {
      console.error('❌ Ошибка обработки вебхука ЮKassa:', error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = YooKassaService