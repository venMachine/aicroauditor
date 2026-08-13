const axios = require('axios')

class LemonSqueezyService {
  constructor() {
    this.apiKey = process.env.LEMON_SQUEEZY_API_KEY
    this.storeId = process.env.LEMON_SQUEEZY_STORE_ID
    this.baseUrl = 'https://api.lemonsqueezy.com/v1'
  }

  async createCheckout(variantId, userId, plan) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/checkouts`,
        {
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                custom: {
                  user_id: userId,
                  plan: plan
                }
              },
              product_options: {
                redirect_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
                receipt_button_text: 'Go to Dashboard',
                receipt_thank_you_note: 'Thank you for your purchase!'
              }
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: String(this.storeId)
                }
              },
              variant: {
                data: {
                  type: 'variants',
                  id: String(variantId)
                }
              }
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )

      return {
        success: true,
        checkoutUrl: response.data.data.attributes.url,
        checkoutId: response.data.data.id
      }

    } catch (error) {
      console.error('❌ Ошибка создания чекаута:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.detail || 'Ошибка создания платежа'
      }
    }
  }

  static handleWebhook(payload, signature) {
    try {
      const eventName = payload.meta?.event_name
      const data = payload.data

      if (eventName === 'order_created' || eventName === 'order_paid') {
        const userId = data?.attributes?.checkout_data?.custom?.user_id
        const plan = data?.attributes?.checkout_data?.custom?.plan
        
        if (!userId) {
          console.error('❌ Нет user_id в метаданных')
          return { success: false, error: 'No user_id' }
        }

        return {
          success: true,
          userId: userId,
          plan: plan,
          orderId: data.id,
          status: eventName
        }
      }

      return { success: true }

    } catch (error) {
      console.error('❌ Ошибка обработки вебхука:', error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = LemonSqueezyService