<template>
  <div class="page-content">
    <div class="container">
      <h1>{{ $t('requisites.title') }}</h1>
      <div class="content">
        <div class="requisites-block">
          <h2>{{ $t('requisites.individual') }}</h2>
          <div class="requisite-item">
            <span class="label">{{ $t('requisites.inn') }}</span>
            <span class="value">482615582704</span>
          </div>
          <div class="requisite-item">
            <span class="label">{{ $t('requisites.full_name') }}</span>
            <span class="value">Говорухин Илья Владимирович</span>
          </div>
        </div>
     

        
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
  margin-top: 24px;
  margin-bottom: 16px;
  color: #1a1a2e;
}
.content {
  max-width: 600px;
  margin: 0 auto;
}
.requisites-block {
  margin-bottom: 32px;
}
.requisite-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f8;
}
.requisite-item .label {
  font-weight: 600;
  color: #1a1a2e;
}
.requisite-item .value {
  color: #4a4a6a;
}
@media (max-width: 480px) {
  .requisite-item {
    flex-direction: column;
    gap: 4px;
  }
}
</style>