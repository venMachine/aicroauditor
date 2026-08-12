<template>
  <div class="page-content">
    <div class="container">
      <h1>{{ $t('contacts.title') }}</h1>
      <div class="content">
        <div class="contact-item">
          <span class="label">{{ $t('contacts.email') }}</span>
          <span class="value">support@aicrorauditor.com</span>
        </div>
        <div class="contact-item">
          <span class="label">{{ $t('contacts.telegram') }}</span>
          <span class="value">@ai_cro_auditor</span>
        </div>
        <div class="contact-item">
          <span class="label">{{ $t('contacts.response_time') }}</span>
          <span class="value">{{ $t('contacts.response_time_value') }}</span>
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
.content {
  max-width: 600px;
  margin: 0 auto;
}
.contact-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f0f2f8;
}
.contact-item .label {
  font-weight: 600;
  color: #1a1a2e;
}
.contact-item .value {
  color: #4a4a6a;
}
@media (max-width: 480px) {
  .contact-item {
    flex-direction: column;
    gap: 4px;
  }
}
</style>