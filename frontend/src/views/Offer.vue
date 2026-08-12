<template>
  <div class="page-content">
    <div class="container">
      <h1>{{ $t('offer.title') }}</h1>
      <div class="content">
        <h2>1. {{ $t('offer.general') }}</h2>
        <p>{{ $t('offer.general_text') }}</p>

        <h2>2. {{ $t('offer.services') }}</h2>
        <p>{{ $t('offer.services_text') }}</p>

        <h2>3. {{ $t('offer.payment') }}</h2>
        <p>{{ $t('offer.payment_text') }}</p>

        <h2>4. {{ $t('offer.responsibility') }}</h2>
        <p>{{ $t('offer.responsibility_text') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.page-content {
  padding: 60px 0;
  min-height: 60vh;
}
.page-content h1 {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1a1a2e;
}
.page-content h2 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
  color: #1a1a2e;
}
.page-content p {
  font-size: 1rem;
  line-height: 1.7;
  color: #4a4a6a;
}
.content {
  max-width: 800px;
  margin: 0 auto;
}
</style>