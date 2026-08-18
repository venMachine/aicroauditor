
<template>
  <div class="pricing">
    <div class="container">
      <h1 class="section-title">{{ t('pricing.title') }}</h1>
      <div class="plans-grid">
        <!-- Разовый -->
        <div class="plan-card card">
          <div class="plan-icon">🚀</div>
          <h3>{{ t('pricing.single.title') }}</h3>
          <div class="price">
            <span class="amount">{{ t('pricing.single.price') }}</span>
          </div>
          <p class="plan-description">{{ t('pricing.single.description') }}</p>
          <button @click="pay('single')" class="btn btn-primary">
            {{ t('pricing.pay') }}
          </button>
        </div>

       
        <div class="plan-card card featured">
          <div class="popular-badge">{{ t('pricing.popular') }}</div>
          <div class="plan-icon">🌟</div>
          <h3>{{ t('pricing.monthly.title') }}</h3>
          <div class="price">
            <span class="amount">{{ t('pricing.monthly.price') }}</span>
            <span class="period">{{ t('pricing.monthly.period') }}</span>
          </div>
          <p class="plan-description">{{ t('pricing.monthly.description') }}</p>
          <button @click="pay('monthly')" class="btn btn-primary">
            {{ t('pricing.pay') }}
          </button>
        </div>
      </div>
       <AuditDemo  :showButton="false" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import AuditDemo from '@/components/AuditDemo.vue'

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
.pricing { 
  padding: 60px 0; 
}

.section-title { 
  text-align: center; 
  font-size: 2.4rem; 
  font-weight: 700; 
  margin-bottom: 32px; 
}

.plans-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 32px; 
  max-width: 800px; 
  margin: 0 auto; 
}

.plan-card { 
  text-align: center; 
  padding: 40px 32px; 
  position: relative; 
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
}

.plan-card.featured { 
  border: 2px solid $primary; 
  transform: scale(1.02); 

  &:hover {
    transform: scale(1.02) translateY(-4px);
  }
}

.popular-badge { 
  position: absolute; 
  top: -12px; 
  left: 50%; 
  transform: translateX(-50%); 
  background: $primary; 
  color: $white; 
  padding: 4px 20px; 
  border-radius: 24px; 
  font-size: 0.8rem; 
  font-weight: 600; 
}

.plan-icon { 
  font-size: 2.8rem; 
  margin-bottom: 12px; 
}

h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.price { 
  margin: 16px 0 12px; 
  .amount { 
    font-size: 2.4rem; 
    font-weight: 800; 
    color: $primary; 
  }
  .period { 
    font-size: 1rem; 
    color: #636e72; 
  }
}

.plan-description {
  font-size: 0.95rem;
  color: #4a4a6a;
  line-height: 1.7;
  margin: 0 0 28px 0;
  text-align: left;
}

.btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: $primary;
  color: white;

  &:hover {
    background: darken($primary, 8%);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(108, 92, 231, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 768px) { 
  .plans-grid { 
    grid-template-columns: 1fr; 
    max-width: 400px;
  } 
  .plan-card.featured { 
    transform: none; 
    &:hover {
      transform: translateY(-4px);
    }
  }
  .section-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .pricing {
    padding: 40px 12px;
  }
  .plan-card {
    padding: 28px 20px;
  }
  .plan-icon {
    font-size: 2.2rem;
  }
  .price .amount {
    font-size: 2rem;
  }
  .plan-description {
    font-size: 0.85rem;
  }
}
</style>




<!-- <template>
  <div class="pricing">
    <div class="container">
      <h1 class="section-title">{{ t('pricing.title') }}</h1>
      <div class="plans-grid">
     
        <div class="plan-card card">
          <div class="plan-icon"></div>
          <h3>{{ t('pricing.single.title') }}</h3>
          <div class="price">
            <span class="amount">{{ t('pricing.single.price') }}</span>
          </div>
          <p class="plan-description">{{ t('pricing.single.description') }}</p>
          <button @click="pay('single')" class="btn btn-primary">
            {{ t('pricing.pay') }}
          </button>
        </div>

      
        <div class="plan-card card featured">
          <div class="popular-badge">{{ t('pricing.popular') }}</div>
          <div class="plan-icon"></div>
          <h3>{{ t('pricing.monthly.title') }}</h3>
          <div class="price">
            <span class="amount">{{ t('pricing.monthly.price') }}</span>
            <span class="period">{{ t('pricing.monthly.period') }}</span>
          </div>
          <p class="plan-description">{{ t('pricing.monthly.description') }}</p>
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
.pricing { 
  padding: 60px 0; 
}

.section-title { 
  text-align: center; 
  font-size: 2.4rem; 
  font-weight: 700; 
  margin-bottom: 48px; 
}

.plans-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 32px; 
  max-width: 800px; 
  margin: 0 auto; 
}

.plan-card { 
  text-align: center; 
  padding: 40px 32px; 
  position: relative; 
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
}

.plan-card.featured { 
  border: 2px solid $primary; 
  transform: scale(1.02); 

  &:hover {
    transform: scale(1.02) translateY(-4px);
  }
}

.popular-badge { 
  position: absolute; 
  top: -12px; 
  left: 50%; 
  transform: translateX(-50%); 
  background: $primary; 
  color: $white; 
  padding: 4px 20px; 
  border-radius: 24px; 
  font-size: 0.8rem; 
  font-weight: 600; 
}

.plan-icon { 
  font-size: 2.8rem; 
  margin-bottom: 12px; 
}

h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.price { 
  margin: 16px 0 12px; 
  .amount { 
    font-size: 2.4rem; 
    font-weight: 800; 
    color: $primary; 
  }
  .period { 
    font-size: 1rem; 
    color: #636e72; 
  }
}

.plan-description {
  font-size: 0.95rem;
  color: #4a4a6a;
  line-height: 1.7;
  margin: 0 0 28px 0;
  text-align: left;
}

.btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: $primary;
  color: white;

  &:hover {
    background: darken($primary, 8%);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(108, 92, 231, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 768px) { 
  .plans-grid { 
    grid-template-columns: 1fr; 
    max-width: 400px;
  } 
  .plan-card.featured { 
    transform: none; 
    &:hover {
      transform: translateY(-4px);
    }
  }
  .section-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .pricing {
    padding: 40px 12px;
  }
  .plan-card {
    padding: 28px 20px;
  }
  .plan-icon {
    font-size: 2.2rem;
  }
  .price .amount {
    font-size: 2rem;
  }
  .plan-description {
    font-size: 0.85rem;
  }
}
</style> -->