<template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>{{ $t('dashboard.title') }}</h1>
        <span class="credits-badge">{{ user?.credits || 0 }} {{ $t('dashboard.credits') }}</span>
      </div>

      <div class="card audit-form">
        <h3>{{ $t('dashboard.audit_form.title') }}</h3>
        <form @submit.prevent="runAudit" class="input-group">
          <input type="url" v-model="url" :placeholder="$t('dashboard.audit_form.placeholder')" required />
          <button type="submit" class="btn btn-primary" :disabled="loading || !user?.credits">
            {{ loading ? $t('dashboard.audit_form.analyzing') : $t('dashboard.audit_form.analyze') }}
          </button>
        </form>
        
        <div v-if="loading" class="analyzing-info">
          <div class="spinner"></div>
          <div class="analyzing-text">
            <p class="analyzing-title">{{ $t('dashboard.audit_form.analyzing_title') }}</p>
            <p class="analyzing-desc">{{ $t('dashboard.audit_form.analyzing_desc') }}</p>
            <p class="analyzing-progress">{{ $t('dashboard.audit_form.analyzing_progress') }}</p>
          </div>
        </div>

        <p v-if="user?.credits === 0" class="warning">
          {{ $t('dashboard.audit_form.no_credits') }}
          <router-link to="/pricing">{{ $t('dashboard.audit_form.refill') }}</router-link>
        </p>
      </div>

      <div class="history-header">
        <h2 class="history-title">{{ $t('dashboard.history.title') }}</h2>
        <span class="audits-count">{{ $t('dashboard.history.total') }}: {{ audits.length }}</span>
      </div>

      <div v-if="audits.length === 0" class="empty-state">
        <p>{{ $t('dashboard.history.empty') }}</p>
        <p class="hint">{{ $t('dashboard.history.empty_hint') }}</p>
      </div>

      <div v-for="audit in audits" :key="audit._id" class="card audit-item">
        <div class="audit-header">
          <div class="audit-info">
            <a :href="audit.url" target="_blank" class="audit-url">{{ audit.url }}</a>
            <div class="audit-meta">
              <span class="audit-score">{{ $t('dashboard.history.score') }}: {{ audit.score }}/100</span>
              <span class="audit-date">{{ formatDate(audit.createdAt) }}</span>
            </div>
          </div>
          <div class="audit-actions">
            <router-link :to="'/audit/' + audit._id" class="btn btn-outline btn-sm">{{ $t('dashboard.history.details') }}</router-link>
            <button @click="downloadPDF(audit)" class="btn btn-secondary btn-sm">{{ $t('dashboard.history.pdf') }}</button>
            <button @click="deleteAudit(audit._id)" class="btn btn-danger btn-sm">{{ $t('dashboard.history.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const router = useRouter()
const url = ref('')
const loading = ref(false)
const user = computed(() => store.user)
const audits = computed(() => store.audits)

const runAudit = async () => {
  if (!store.token) return router.push('/login')
  if (!url.value) {
    alert(t('dashboard.audit_form.url_required'))
    return
  }
  
  loading.value = true
  try {
    console.log('🚀 Запуск аудита')
    console.log('🌐 Текущий язык:', locale.value)
    
    const res = await axios.post('/api/audit/run', { 
      url: url.value,
      language: locale.value // 👈 КЛЮЧЕВОЙ МОМЕНТ!
    })
    
    console.log('✅ Аудит запущен, ID:', res.data._id)
    await store.fetchAudits()
    router.push('/audit/' + res.data._id)
  } catch (err) {
    console.error('❌ Ошибка:', err)
    alert(t('dashboard.audit_form.error') + ': ' + (err.response?.data?.error || t('dashboard.audit_form.unknown_error')))
  } finally {
    loading.value = false
  }
}

const deleteAudit = async (id) => {
  if (!confirm(t('dashboard.history.delete_confirm'))) return
  try {
    await axios.delete(`/api/audit/${id}`)
    await store.fetchAudits()
  } catch (err) {
    alert(t('dashboard.history.delete_error') + ': ' + (err.response?.data?.error || t('dashboard.audit_form.unknown_error')))
  }
}

const formatDate = (date) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleString(locale.value === 'ru' ? 'ru-RU' : 'en-US', options)
}

const downloadPDF = async (audit) => {
  try {
    const res = await axios.get(`/api/audit/${audit._id}`)
    const data = res.data
    const content = generatePDFContent(data)
    
    const win = window.open('', '_blank')
    const lang = locale.value === 'ru' ? 'ru-RU' : 'en-US'
    const title = locale.value === 'ru' ? 'Отчет по аудиту сайта' : 'Website Audit Report'
    
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${data.url}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; color: #333; }
            h1 { color: #6c5ce7; font-size: 28px; border-bottom: 3px solid #6c5ce7; padding-bottom: 10px; }
            h2 { color: #2d3436; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
            h3 { color: #2d3436; font-size: 16px; margin-top: 20px; }
            .score { font-size: 48px; font-weight: 800; color: #6c5ce7; }
            .score-label { font-size: 24px; color: #636e72; }
            .url { color: #6c5ce7; font-size: 18px; }
            .meta { color: #636e72; font-size: 14px; margin: 10px 0 20px; }
            .issue { background: #f8f9fa; padding: 12px 16px; margin: 10px 0; border-left: 4px solid #6c5ce7; border-radius: 4px; }
            .priority { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .priority.Critical { background: #ff6b6b; color: white; }
            .priority.High { background: #feca57; color: #333; }
            .priority.Medium { background: #ffd93d; color: #333; }
            .priority.Low { background: #6bcb77; color: white; }
            .label { font-weight: 600; color: #636e72; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .section { margin: 20px 0; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #636e72; text-align: center; }
            .metrics-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin: 10px 0; }
            .metric { background: #f8f9fa; padding: 10px; border-radius: 6px; text-align: center; }
            .metric .value { font-size: 20px; font-weight: 700; }
            .metric .label { font-size: 11px; }
            .good { color: #00b894; }
            .medium { color: #feca57; }
            .bad { color: #ff6b6b; }
          </style>
        </head>
        <body>
          ${content}
          <div class="footer">
            ${locale.value === 'ru' ? 'Отчет сгенерирован AI CRO Auditor' : 'Report generated by AI CRO Auditor'} • ${new Date().toLocaleString(lang)}
          </div>
          <script>
            window.onload = function() { window.print(); }
          <\/script>
        </body>
      </html>
    `)
    win.document.close()
  } catch (err) {
    alert(t('dashboard.history.pdf_error') + ': ' + (err.response?.data?.error || t('dashboard.audit_form.unknown_error')))
  }
}

const generatePDFContent = (data) => {
  const report = data.fullReport || {}
  const isRu = locale.value === 'ru'
  
  let html = `
    <h1>${isRu ? 'Отчет по аудиту сайта' : 'Website Audit Report'}</h1>
    <p class="url">${data.url}</p>
    <div>
      <span class="score">${data.score}</span>
      <span class="score-label">/ 100</span>
    </div>
    <p class="meta">${isRu ? 'Дата аудита' : 'Audit Date'}: ${formatDate(data.createdAt)}</p>
  `

  if (report.executive_summary) {
    html += `<h2>Executive Summary</h2>`
    if (report.executive_summary.overall_assessment) {
      html += `<p>${report.executive_summary.overall_assessment}</p>`
    }
    if (report.executive_summary.top_5_critical_issues) {
      report.executive_summary.top_5_critical_issues.forEach(item => {
        html += `
          <div class="issue">
            <div><span class="priority ${item.priority}">${item.priority}</span> <strong>${item.issue}</strong></div>
            <p><span class="label">${isRu ? 'Объяснение' : 'Explanation'}:</span> ${item.explanation}</p>
            <p><span class="label">${isRu ? 'Влияние' : 'Impact'}:</span> ${item.business_impact}</p>
            <p><span class="label">${isRu ? 'Рекомендация' : 'Recommendation'}:</span> ${item.recommendation}</p>
            <p><span class="label">${isRu ? 'Ресурсы' : 'Resources'}:</span> ${item.resources_needed}</p>
            <p><span class="label">${isRu ? 'Ожидаемый результат' : 'Expected Result'}:</span> ${item.expectedResult}</p>
          </div>
        `
      })
    }
  }

  // Technical Audit
  if (report.technical_audit) {
    html += `<h2>${isRu ? 'Технический аудит' : 'Technical Audit'}</h2>`
    
    // Metrics
    if (data.metrics) {
      html += `<div class="metrics-grid">`
      const metrics = data.metrics
      const metricLabels = {
        performance: isRu ? 'Производительность' : 'Performance',
        accessibility: isRu ? 'Доступность' : 'Accessibility',
        bestPractices: isRu ? 'Лучшие практики' : 'Best Practices',
        seo: 'SEO'
      }
      Object.keys(metricLabels).forEach(key => {
        const value = metrics[key]
        const scoreClass = value >= 90 ? 'good' : value >= 50 ? 'medium' : 'bad'
        html += `
          <div class="metric">
            <div class="label">${metricLabels[key]}</div>
            <div class="value ${scoreClass}">${value || '—'}</div>
          </div>
        `
      })
      html += `</div>`
    }
    
    // Core Web Vitals
    if (report.technical_audit.core_web_vitals) {
      html += `<h3>Core Web Vitals</h3>`
      const cwv = report.technical_audit.core_web_vitals
      html += `<ul>`
      Object.keys(cwv).forEach(key => {
        html += `<li><strong>${key.toUpperCase()}:</strong> ${cwv[key]}</li>`
      })
      html += `</ul>`
    }
  }

  // SEO Audit
  if (report.seo_audit) {
    html += `<h2>${isRu ? 'SEO аудит' : 'SEO Audit'}</h2>`
    if (report.seo_audit.status) {
      html += `<p><strong>${isRu ? 'Статус' : 'Status'}:</strong> ${report.seo_audit.status}</p>`
    }
    if (report.seo_audit.score !== undefined) {
      html += `<p><strong>SEO Score:</strong> ${report.seo_audit.score}/100</p>`
    }
    if (report.seo_audit.issues) {
      report.seo_audit.issues.forEach(item => {
        html += `
          <div class="issue">
            <div><span class="priority ${item.priority}">${item.priority}</span> <strong>${item.issue}</strong></div>
            <p><span class="label">${isRu ? 'Объяснение' : 'Explanation'}:</span> ${item.explanation}</p>
            <p><span class="label">${isRu ? 'Влияние' : 'Impact'}:</span> ${item.business_impact}</p>
            <p><span class="label">${isRu ? 'Рекомендация' : 'Recommendation'}:</span> ${item.recommendation}</p>
          </div>
        `
      })
    }
  }

  // UX/UI Audit
  if (report.ux_ui_audit) {
    html += `<h2>${isRu ? 'UX/UI аудит' : 'UX/UI Audit'}</h2>`
    if (report.ux_ui_audit.status) {
      html += `<p><strong>${isRu ? 'Статус' : 'Status'}:</strong> ${report.ux_ui_audit.status}</p>`
    }
    if (report.ux_ui_audit.score !== undefined) {
      html += `<p><strong>UX/UI Score:</strong> ${report.ux_ui_audit.score}/100</p>`
    }
    if (report.ux_ui_audit.issues) {
      report.ux_ui_audit.issues.forEach(item => {
        html += `
          <div class="issue">
            <div><span class="priority ${item.priority}">${item.priority}</span> <strong>${item.issue}</strong></div>
            <p><span class="label">${isRu ? 'Объяснение' : 'Explanation'}:</span> ${item.explanation}</p>
            <p><span class="label">${isRu ? 'Влияние' : 'Impact'}:</span> ${item.business_impact}</p>
            <p><span class="label">${isRu ? 'Рекомендация' : 'Recommendation'}:</span> ${item.recommendation}</p>
          </div>
        `
      })
    }
  }

  // Prioritization
  if (report.prioritization) {
    html += `<h2>${isRu ? 'Приоритизация' : 'Prioritization'}</h2>`
    if (typeof report.prioritization === 'object') {
      Object.keys(report.prioritization).forEach(category => {
        const items = report.prioritization[category]
        html += `<h3>${category}</h3>`
        if (Array.isArray(items)) {
          html += `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`
        } else {
          html += `<p>${items}</p>`
        }
      })
    } else {
      html += `<p>${report.prioritization}</p>`
    }
  }

  // Roadmap
  if (report.roadmap) {
    html += `<h2>Roadmap</h2>`
    if (typeof report.roadmap === 'object') {
      Object.keys(report.roadmap).forEach(key => {
        html += `<h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>`
        html += `<p>${report.roadmap[key]}</p>`
      })
    } else {
      html += `<p>${report.roadmap}</p>`
    }
  }

  // Forecast
  if (report.forecast) {
    html += `<h2>${isRu ? 'Прогноз' : 'Forecast'}</h2>`
    if (typeof report.forecast === 'object') {
      const labels = {
        traffic_growth: isRu ? 'Рост трафика' : 'Traffic Growth',
        conversion_growth: isRu ? 'Рост конверсии' : 'Conversion Growth',
        timeline: isRu ? 'Сроки' : 'Timeline'
      }
      Object.keys(labels).forEach(key => {
        const value = report.forecast[key]
        if (value) {
          html += `<p><strong>${labels[key]}:</strong> ${typeof value === 'object' ? JSON.stringify(value) : value}</p>`
        }
      })
    } else {
      html += `<p>${report.forecast}</p>`
    }
  }

  return html
}

onMounted(async () => {
  await store.fetchProfile()
  await store.fetchAudits()
  const params = new URLSearchParams(window.location.search)
  const mockPayment = params.get('mock_payment')
  if (mockPayment) {
    try {
      await axios.post('/api/payment/mock-success', { paymentId: mockPayment })
      await store.fetchProfile()
      alert(t('dashboard.payment_success'))
      window.history.replaceState({}, document.title, '/dashboard')
    } catch (err) { console.error(err) }
  }
})
</script>

<style lang="scss" scoped>
.dashboard { padding: 40px 0; }

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.credits-badge {
  background: $light;
  padding: 8px 20px;
  border-radius: 24px;
  font-weight: 600;
}

.audit-form {
  margin-bottom: 32px;
  .warning {
    margin-top: 12px;
    color: $danger;
    font-size: 0.9rem;
  }
}

.analyzing-info {
  margin-top: 16px;
  padding: 16px 20px;
  background: $light;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border: 1px solid rgba($primary, 0.15);
}

.spinner {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 4px solid #e9ecef;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-top: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.analyzing-text {
  flex: 1;
}

.analyzing-title {
  font-weight: 600;
  font-size: 1rem;
  color: $dark;
  margin: 0 0 4px 0;
}

.analyzing-desc {
  font-size: 0.9rem;
  color: $gray;
  margin: 0 0 2px 0;
}

.analyzing-progress {
  font-size: 0.8rem;
  color: $gray;
  margin: 0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.history-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
}

.audits-count {
  font-size: 0.85rem;
  color: $gray;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: $gray;
  .hint {
    font-size: 0.9rem;
    margin-top: 4px;
  }
}

.audit-item {
  margin-bottom: 16px;
  padding: 16px 20px;
  transition: $transition;

  &:hover {
    box-shadow: $shadow;
  }
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.audit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 150px;
}

.audit-url {
  font-weight: 500;
  color: $primary;
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
}

.audit-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.audit-score {
  font-weight: 600;
  font-size: 0.9rem;
}

.audit-date {
  font-size: 0.8rem;
  color: $gray;
}

.audit-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.8rem;
  border-radius: 8px;
}

.btn-secondary {
  background: $secondary;
  color: white;
  border: none;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: darken($secondary, 10%);
    transform: translateY(-2px);
  }
}

.btn-danger {
  background: $danger;
  color: white;
  border: none;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: darken($danger, 10%);
    transform: translateY(-2px);
  }
}

@media (max-width: 768px) {
  .dashboard { padding: 20px 12px; }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    text-align: center;
  }

  .audit-header {
    flex-direction: column;
    align-items: stretch;
  }

  .audit-actions {
    justify-content: flex-start;
  }

  .audit-info {
    align-items: center;
    text-align: center;
  }

  .audit-meta {
    justify-content: center;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.75rem;
  }

  .analyzing-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .audit-actions {
    flex-direction: column;
  }

  .audit-actions .btn-sm {
    width: 100%;
    text-align: center;
  }
}
</style>


<!-- <template>
  <div class="dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>{{ $t('dashboard.title') }}</h1>
        <span class="credits-badge">{{ user?.credits || 0 }} {{ $t('dashboard.credits') }}</span>
      </div>

      <div class="card audit-form">
        <h3>{{ $t('dashboard.audit_form.title') }}</h3>
        <form @submit.prevent="runAudit" class="input-group">
          <input type="url" v-model="url" :placeholder="$t('dashboard.audit_form.placeholder')" required />
          <button type="submit" class="btn btn-primary" :disabled="loading || !user?.credits">
            {{ loading ? $t('dashboard.audit_form.analyzing') : $t('dashboard.audit_form.analyze') }}
          </button>
        </form>
        
        <div v-if="loading" class="analyzing-info">
          <div class="spinner"></div>
          <div class="analyzing-text">
            <p class="analyzing-title">{{ $t('dashboard.audit_form.analyzing_title') }}</p>
            <p class="analyzing-desc">{{ $t('dashboard.audit_form.analyzing_desc') }}</p>
            <p class="analyzing-progress">{{ $t('dashboard.audit_form.analyzing_progress') }}</p>
          </div>
        </div>

        <p v-if="user?.credits === 0" class="warning">
          {{ $t('dashboard.audit_form.no_credits') }}
          <router-link to="/pricing">{{ $t('dashboard.audit_form.refill') }}</router-link>
        </p>
      </div>

      <div class="history-header">
        <h2 class="history-title">{{ $t('dashboard.history.title') }}</h2>
        <span class="audits-count">{{ $t('dashboard.history.total') }}: {{ audits.length }}</span>
      </div>

      <div v-if="audits.length === 0" class="empty-state">
        <p>{{ $t('dashboard.history.empty') }}</p>
        <p class="hint">{{ $t('dashboard.history.empty_hint') }}</p>
      </div>

      <div v-for="audit in audits" :key="audit._id" class="card audit-item">
        <div class="audit-header">
          <div class="audit-info">
            <a :href="audit.url" target="_blank" class="audit-url">{{ audit.url }}</a>
            <div class="audit-meta">
              <span class="audit-score">{{ $t('dashboard.history.score') }}: {{ audit.score }}/100</span>
              <span class="audit-date">{{ formatDate(audit.createdAt) }}</span>
            </div>
          </div>
          <div class="audit-actions">
            <router-link :to="'/audit/' + audit._id" class="btn btn-outline btn-sm">{{ $t('dashboard.history.details') }}</router-link>
            <button @click="downloadPDF(audit)" class="btn btn-secondary btn-sm">{{ $t('dashboard.history.pdf') }}</button>
            <button @click="deleteAudit(audit._id)" class="btn btn-danger btn-sm">{{ $t('dashboard.history.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const router = useRouter()
const url = ref('')
const loading = ref(false)
const user = computed(() => store.user)
const audits = computed(() => store.audits)

const runAudit = async () => {
  if (!store.token) return router.push('/login')
  if (!url.value) {
    alert(t('dashboard.audit_form.url_required'))
    return
  }
  
  loading.value = true
  try {
    const res = await axios.post('/api/audit/run', { url: url.value })
    await store.fetchAudits()
    router.push('/audit/' + res.data._id)
  } catch (err) {
    alert(t('dashboard.audit_form.error') + ': ' + (err.response?.data?.error || t('dashboard.audit_form.unknown_error')))
  } finally {
    loading.value = false
  }
}

const deleteAudit = async (id) => {
  if (!confirm(t('dashboard.history.delete_confirm'))) return
  try {
    await axios.delete(`/api/audit/${id}`)
    await store.fetchAudits()
  } catch (err) {
    alert(t('dashboard.history.delete_error') + ': ' + (err.response?.data?.error || t('dashboard.audit_form.unknown_error')))
  }
}

const formatDate = (date) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleString(locale.value === 'ru' ? 'ru-RU' : 'en-US', options)
}

const downloadPDF = async (audit) => {
  try {
    const res = await axios.get(`/api/audit/${audit._id}`)
    const data = res.data
    const content = generatePDFContent(data)
    
    const win = window.open('', '_blank')
    const lang = locale.value === 'ru' ? 'ru-RU' : 'en-US'
    const title = locale.value === 'ru' ? 'Отчет по аудиту сайта' : 'Website Audit Report'
    
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${data.url}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; color: #333; }
            h1 { color: #6c5ce7; font-size: 28px; border-bottom: 3px solid #6c5ce7; padding-bottom: 10px; }
            h2 { color: #2d3436; font-size: 20px; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
            h3 { color: #2d3436; font-size: 16px; margin-top: 20px; }
            .score { font-size: 48px; font-weight: 800; color: #6c5ce7; }
            .score-label { font-size: 24px; color: #636e72; }
            .url { color: #6c5ce7; font-size: 18px; }
            .meta { color: #636e72; font-size: 14px; margin: 10px 0 20px; }
            .issue { background: #f8f9fa; padding: 12px 16px; margin: 10px 0; border-left: 4px solid #6c5ce7; border-radius: 4px; }
            .priority { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .priority.Critical { background: #ff6b6b; color: white; }
            .priority.High { background: #feca57; color: #333; }
            .priority.Medium { background: #ffd93d; color: #333; }
            .priority.Low { background: #6bcb77; color: white; }
            .label { font-weight: 600; color: #636e72; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .section { margin: 20px 0; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #636e72; text-align: center; }
            .metrics-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin: 10px 0; }
            .metric { background: #f8f9fa; padding: 10px; border-radius: 6px; text-align: center; }
            .metric .value { font-size: 20px; font-weight: 700; }
            .metric .label { font-size: 11px; }
            .good { color: #00b894; }
            .medium { color: #feca57; }
            .bad { color: #ff6b6b; }
          </style>
        </head>
        <body>
          ${content}
          <div class="footer">
            ${locale.value === 'ru' ? 'Отчет сгенерирован AI CRO Auditor' : 'Report generated by AI CRO Auditor'} • ${new Date().toLocaleString(lang)}
          </div>
          <script>
            window.onload = function() { window.print(); }
          <\/script>
        </body>
      </html>
    `)
    win.document.close()
  } catch (err) {
    alert(t('dashboard.history.pdf_error') + ': ' + (err.response?.data?.error || t('dashboard.audit_form.unknown_error')))
  }
}

const generatePDFContent = (data) => {
  const report = data.fullReport || {}
  const isRu = locale.value === 'ru'
  
  let html = `
    <h1>${isRu ? 'Отчет по аудиту сайта' : 'Website Audit Report'}</h1>
    <p class="url">${data.url}</p>
    <div>
      <span class="score">${data.score}</span>
      <span class="score-label">/ 100</span>
    </div>
    <p class="meta">${isRu ? 'Дата аудита' : 'Audit Date'}: ${formatDate(data.createdAt)}</p>
  `

  if (report.executive_summary) {
    html += `<h2>Executive Summary</h2>`
    if (report.executive_summary.overall_assessment) {
      html += `<p>${report.executive_summary.overall_assessment}</p>`
    }
    if (report.executive_summary.top_5_critical_issues) {
      report.executive_summary.top_5_critical_issues.forEach(item => {
        html += `
          <div class="issue">
            <div><span class="priority ${item.priority}">${item.priority}</span> <strong>${item.issue}</strong></div>
            <p><span class="label">${isRu ? 'Объяснение' : 'Explanation'}:</span> ${item.explanation}</p>
            <p><span class="label">${isRu ? 'Влияние' : 'Impact'}:</span> ${item.business_impact}</p>
            <p><span class="label">${isRu ? 'Рекомендация' : 'Recommendation'}:</span> ${item.recommendation}</p>
            <p><span class="label">${isRu ? 'Ресурсы' : 'Resources'}:</span> ${item.resources_needed}</p>
            <p><span class="label">${isRu ? 'Ожидаемый результат' : 'Expected Result'}:</span> ${item.expectedResult}</p>
          </div>
        `
      })
    }
  }

  // ... остальные секции (Technical, SEO, UX/UI, Prioritization, Roadmap, Forecast) остаются без изменений
  // (они уже были в предыдущей версии)

  return html
}

onMounted(async () => {
  await store.fetchProfile()
  await store.fetchAudits()
  const params = new URLSearchParams(window.location.search)
  const mockPayment = params.get('mock_payment')
  if (mockPayment) {
    try {
      await axios.post('/api/payment/mock-success', { paymentId: mockPayment })
      await store.fetchProfile()
      alert(t('dashboard.payment_success'))
      window.history.replaceState({}, document.title, '/dashboard')
    } catch (err) { console.error(err) }
  }
})
</script>

<style lang="scss" scoped>
.dashboard { padding: 40px 0; }

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.credits-badge {
  background: $light;
  padding: 8px 20px;
  border-radius: 24px;
  font-weight: 600;
}

.audit-form {
  margin-bottom: 32px;
  .warning {
    margin-top: 12px;
    color: $danger;
    font-size: 0.9rem;
  }
}

.analyzing-info {
  margin-top: 16px;
  padding: 16px 20px;
  background: $light;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border: 1px solid rgba($primary, 0.15);
}

.spinner {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 4px solid #e9ecef;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-top: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.analyzing-text {
  flex: 1;
}

.analyzing-title {
  font-weight: 600;
  font-size: 1rem;
  color: $dark;
  margin: 0 0 4px 0;
}

.analyzing-desc {
  font-size: 0.9rem;
  color: $gray;
  margin: 0 0 2px 0;
}

.analyzing-progress {
  font-size: 0.8rem;
  color: $gray;
  margin: 0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.history-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
}

.audits-count {
  font-size: 0.85rem;
  color: $gray;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: $gray;
  .hint {
    font-size: 0.9rem;
    margin-top: 4px;
  }
}

.audit-item {
  margin-bottom: 16px;
  padding: 16px 20px;
  transition: $transition;

  &:hover {
    box-shadow: $shadow;
  }
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.audit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 150px;
}

.audit-url {
  font-weight: 500;
  color: $primary;
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
}

.audit-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.audit-score {
  font-weight: 600;
  font-size: 0.9rem;
}

.audit-date {
  font-size: 0.8rem;
  color: $gray;
}

.audit-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.8rem;
  border-radius: 8px;
}

.btn-secondary {
  background: $secondary;
  color: white;
  border: none;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: darken($secondary, 10%);
    transform: translateY(-2px);
  }
}

.btn-danger {
  background: $danger;
  color: white;
  border: none;
  cursor: pointer;
  transition: $transition;

  &:hover {
    background: darken($danger, 10%);
    transform: translateY(-2px);
  }
}

@media (max-width: 768px) {
  .dashboard { padding: 20px 12px; }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    text-align: center;
  }

  .audit-header {
    flex-direction: column;
    align-items: stretch;
  }

  .audit-actions {
    justify-content: flex-start;
  }

  .audit-info {
    align-items: center;
    text-align: center;
  }

  .audit-meta {
    justify-content: center;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.75rem;
  }

  .analyzing-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .audit-actions {
    flex-direction: column;
  }

  .audit-actions .btn-sm {
    width: 100%;
    text-align: center;
  }
}
</style> -->