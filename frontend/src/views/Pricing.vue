<template>
  <div class="pricing">
    <div class="container">
      <h1 class="section-title">{{ t('pricing.title') }}</h1>
      <div class="plans-grid">
        <!-- Разовый -->
        <div class="plan-card card">
          <div class="plan-icon"></div>
          <h3>{{ t('pricing.single.title') }}</h3>
          <div class="price">
            <span class="amount">{{ t('pricing.single.price') }}</span>
          </div>
          <ul class="plan-features">
            <li> {{ t('pricing.single.features.0') }}</li>
            <li> {{ t('pricing.single.features.1') }}</li>
          </ul>
          <button @click="pay('single')" class="btn btn-primary">
            {{ t('pricing.pay') }}
          </button>
        </div>

        <!-- Подписка -->
        <div class="plan-card card featured">
          <div class="popular-badge">{{ t('pricing.popular') }}</div>
          <div class="plan-icon"></div>
          <h3>{{ t('pricing.monthly.title') }}</h3>
          <div class="price">
            <span class="amount">{{ t('pricing.monthly.price') }}</span>
            <span class="period">{{ t('pricing.monthly.period') }}</span>
          </div>
          <ul class="plan-features">
            <li> {{ t('pricing.monthly.features.0') }}</li>
            <li> {{ t('pricing.monthly.features.1') }}</li>
          </ul>
          <button @click="pay('monthly')" class="btn btn-primary">
            {{ t('pricing.pay') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t } = useI18n()

const pay = async (plan) => {
  try {
    const res = await axios.post('/api/payment/create', { plan })
    window.location.href = res.data.paymentUrl
  } catch (err) {
    alert(t('pricing.error') + ': ' + (err.response?.data?.error || t('pricing.unknown_error')))
  }
}
</script>

<style lang="scss" scoped>
.pricing { padding: 60px 0; }
.section-title { text-align: center; font-size: 2.4rem; font-weight: 700; margin-bottom: 48px; }
.plans-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; max-width: 800px; margin: 0 auto; }
.plan-card { text-align: center; padding: 40px 32px; position: relative; }
.plan-card.featured { border: 2px solid $primary; transform: scale(1.02); }
.popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: $primary; color: $white; padding: 4px 20px; border-radius: 24px; font-size: 0.8rem; font-weight: 600; }
.plan-icon { font-size: 2.8rem; margin-bottom: 12px; }
.price { margin: 16px 0 24px; .amount { font-size: 2.4rem; font-weight: 800; color: $primary; } }
.plan-features { list-style: none; padding: 0; margin: 0 0 28px 0; text-align: left; li { padding: 8px 0; border-bottom: 1px solid #f0f2f8; } }
@media (max-width: 768px) { .plans-grid { grid-template-columns: 1fr; } .plan-card.featured { transform: none; } }
</style>