<template>
  <div class="page-content">
    <div class="container">
      <h1>{{ $t('privacy.title') }}</h1>
      <div class="content">
        <h2>{{ $t('privacy.what_we_collect') }}</h2>
        <p>{{ $t('privacy.what_we_collect_text') }}</p>

        <h2>{{ $t('privacy.how_we_use') }}</h2>
        <p>{{ $t('privacy.how_we_use_text') }}</p>

        <h2>{{ $t('privacy.data_security') }}</h2>
        <p>{{ $t('privacy.data_security_text') }}</p>

        <h2>{{ $t('privacy.third_party') }}</h2>
        <p>{{ $t('privacy.third_party_text') }}</p>

        <h2>{{ $t('privacy.contact') }}</h2>
        <p>{{ $t('privacy.contact_text') }}</p>
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