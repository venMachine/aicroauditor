<template>
  <div class="result">
    <div class="container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>{{ t('result.loading') }}</p>
      </div>

      <div v-else-if="audit" class="result-content">
        <!-- Хедер -->
        <div class="card result-header">
          <h2>{{ t('result.header.title') }}</h2>
          
          <a :href="audit.url" target="_blank" class="audit-url">{{ audit.url }}</a>
          
          <div class="score-container">
            <span class="score-big">{{ audit.score || audit.fullReport?.score || '—' }}</span>
            <span class="score-total">/ 100</span>
          </div>

          <div class="language-indicator">
            <span class="label">{{ t('result.report_language') }}:</span>
            <span class="lang-badge">
              {{ currentReportLang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English' }}
            </span>
            <span v-if="audit.language && audit.language !== currentReportLang" class="translated-note">
              ({{ t('result.translated_from') }} {{ audit.language === 'ru' ? '🇷🇺' : '🇬🇧' }})
            </span>
          </div>
        </div>

        <!-- ОСНОВНОЙ КОНТЕНТ -->
        <template v-if="reportData && Object.keys(reportData).length > 0">
          
          <!-- 1. EXECUTIVE SUMMARY -->
          <div v-if="reportData.executive_summary" class="card section-card">
            <h3>{{ t('result.sections.executive_summary') }}</h3>
            <div v-if="reportData.executive_summary.overall_assessment" class="overall-assessment">
              <p>{{ reportData.executive_summary.overall_assessment }}</p>
            </div>
            
            <div 
              v-for="(item, idx) in getExecutiveSummaryIssues()" 
              :key="idx" 
              class="issue-card"
            >
              <div class="issue-header">
                <span class="priority-badge" :class="getPriorityClass(item.priority)">
                  {{ item.priority || t('result.priority.medium') }}
                </span>
                <h4 class="issue-title">{{ item.issue }}</h4>
              </div>
              <div class="issue-body">
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.explanation') }}:</span>
                  <p>{{ item.explanation }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.business_impact') }}:</span>
                  <p>{{ item.business_impact }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.recommendation') }}:</span>
                  <p>{{ item.recommendation }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.resources') }}:</span>
                  <p>{{ item.resources_needed }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.expected_result') }}:</span>
                  <p class="expected-result">{{ item.expectedResult || item.expected_result || t('result.no_data.expected_result') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. ТЕХНИЧЕСКИЙ АУДИТ -->
          <div v-if="reportData.technical_audit" class="card section-card">
            <h3>{{ t('result.sections.technical_audit') }}</h3>
            
            <div class="metrics-grid">
              <div v-for="metric in metricsList" :key="metric.key" class="metric-item">
                <span class="metric-label">{{ t(`result.metrics.${metric.key}`) }}</span>
                <span class="metric-value" :class="getScoreClass(audit.metrics?.[metric.key])">
                  {{ audit.metrics?.[metric.key] ?? '—' }}
                </span>
                <span class="metric-norm">{{ t(`result.metrics_norm.${metric.key}`) }}</span>
                <span class="metric-explanation">{{ t(`result.metrics_explanation.${metric.key}`) }}</span>
              </div>
            </div>

            <div v-if="reportData.technical_audit.core_web_vitals" class="cweb-vitals">
              <h4>{{ t('result.cweb_vitals') }}</h4>
              <div class="cweb-grid">
                <div 
                  v-for="(value, key) in reportData.technical_audit.core_web_vitals" 
                  :key="key" 
                  class="cweb-item"
                >
                  <span class="label">{{ formatKey(key) }}</span>
                  <span class="value">{{ value }}</span>
                </div>
              </div>
            </div>

            <div v-if="reportData.technical_audit.issues?.length" class="issues-list">
              <h4>{{ t('result.issues_and_solutions') }}</h4>
              <div v-for="(issue, idx) in reportData.technical_audit.issues" :key="idx" class="issue-row">
                <span class="problem">● {{ issue.problem }}</span>
                <span class="solution">→ {{ issue.recommendation }}</span>
              </div>
            </div>
          </div>

          <!-- 3. SEO АУДИТ -->
          <div v-if="reportData.seo_audit" class="card section-card">
            <h3>{{ t('result.sections.seo_audit') }}</h3>
            
            <div v-if="reportData.seo_audit.status" class="status-badge" :class="getStatusClass(reportData.seo_audit.status)">
              {{ reportData.seo_audit.status }}
            </div>
            
            <div v-if="reportData.seo_audit.score !== undefined" class="seo-score-display">
              SEO Score: <strong>{{ reportData.seo_audit.score }}/100</strong>
            </div>

            <div v-for="(item, idx) in reportData.seo_audit.issues" :key="idx" class="issue-card">
              <div class="issue-header">
                <span class="priority-badge" :class="getPriorityClass(item.priority)">
                  {{ item.priority || t('result.priority.medium') }}
                </span>
                <h4 class="issue-title">{{ item.issue }}</h4>
              </div>
              <div class="issue-body">
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.explanation') }}:</span>
                  <p>{{ item.explanation }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.business_impact') }}:</span>
                  <p>{{ item.business_impact }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.recommendation') }}:</span>
                  <p>{{ item.recommendation }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.resources') }}:</span>
                  <p>{{ item.resources_needed }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.expected_result') }}:</span>
                  <p class="expected-result">{{ item.expectedResult || item.expected_result || t('result.no_data.expected_result') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. UX/UI АУДИТ -->
          <div v-if="reportData.ux_ui_audit" class="card section-card">
            <h3>{{ t('result.sections.ux_ui_audit') }}</h3>
            
            <div v-if="reportData.ux_ui_audit.status" class="status-badge" :class="getStatusClass(reportData.ux_ui_audit.status)">
              {{ reportData.ux_ui_audit.status }}
            </div>
            
            <div v-if="reportData.ux_ui_audit.score !== undefined" class="ux-score-display">
              UX/UI Score: <strong>{{ reportData.ux_ui_audit.score }}/100</strong>
            </div>

            <div v-for="(item, idx) in reportData.ux_ui_audit.issues" :key="idx" class="issue-card">
              <div class="issue-header">
                <span class="priority-badge" :class="getPriorityClass(item.priority)">
                  {{ item.priority || t('result.priority.medium') }}
                </span>
                <h4 class="issue-title">{{ item.issue }}</h4>
              </div>
              <div class="issue-body">
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.explanation') }}:</span>
                  <p>{{ item.explanation }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.business_impact') }}:</span>
                  <p>{{ item.business_impact }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.recommendation') }}:</span>
                  <p>{{ item.recommendation }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.resources') }}:</span>
                  <p>{{ item.resources_needed }}</p>
                </div>
                <div class="issue-block">
                  <span class="issue-label">{{ t('result.issue_labels.expected_result') }}:</span>
                  <p class="expected-result">{{ item.expectedResult || item.expected_result || t('result.no_data.expected_result') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. ПРИОРИТИЗАЦИЯ -->
          <div v-if="reportData.prioritization" class="card section-card">
            <h3>{{ t('result.sections.prioritization') }}</h3>
            
            <template v-if="typeof reportData.prioritization === 'object' && !Array.isArray(reportData.prioritization)">
              <div v-for="(items, category) in reportData.prioritization" :key="category" class="priority-category">
                <h4 :class="getPriorityCategoryClass(category)">{{ translatePriorityCategory(category) }}</h4>
                <ul v-if="Array.isArray(items)">
                  <li v-for="(item, idx) in items" :key="idx">{{ item }}</li>
                </ul>
                <p v-else class="text-content">{{ items }}</p>
              </div>
            </template>
            
            <div v-else class="text-content">
              <p>{{ reportData.prioritization }}</p>
            </div>
          </div>

          <!-- 6. ROADMAP -->
          <div v-if="reportData.roadmap" class="card section-card">
            <h3>{{ t('result.sections.roadmap') }}</h3>
            
            <template v-if="typeof reportData.roadmap === 'object' && !Array.isArray(reportData.roadmap)">
              <div v-for="(value, key) in reportData.roadmap" :key="key" class="roadmap-item">
                <h4>{{ formatRoadmapKey(key) }}</h4>
                <p>{{ value }}</p>
              </div>
            </template>
            
            <div v-else class="text-content">
              <p>{{ reportData.roadmap }}</p>
            </div>
          </div>

          <!-- 7. ПРОГНОЗ -->
          <div v-if="reportData.forecast" class="card section-card">
            <h3>{{ t('result.sections.forecast') }}</h3>
            
            <template v-if="typeof reportData.forecast === 'object'">
              <div class="forecast-grid">
                <div v-for="(value, key) in reportData.forecast" :key="key" class="forecast-item">
                  <span class="label">{{ translateForecastKey(key) }}</span>
                  <span class="value">
                    <template v-if="typeof value === 'object'">
                      {{ value.percentage || value.timeline || value.assumptions || JSON.stringify(value) }}
                    </template>
                    <template v-else>
                      {{ value }}
                    </template>
                  </span>
                </div>
              </div>
            </template>
            
            <div v-else class="text-content">
              <p>{{ reportData.forecast }}</p>
            </div>
          </div>

        </template>

        <!-- FALLBACK -->
        <template v-else>
          <div class="card section-card">
            <h3>{{ t('result.sections.recommendations') }}</h3>
            <div v-for="(rec, idx) in audit.recommendations" :key="idx" class="recommendation-item">
              <span class="priority" :class="getPriorityClass(rec.priority)">{{ rec.priority }}</span>
              <h4>{{ rec.category }}</h4>
              <p>{{ rec.description }}</p>
              <div class="suggestion">→ {{ rec.suggestion }}</div>
            </div>
          </div>
        </template>

        <div class="actions">
          <router-link to="/dashboard" class="btn btn-primary">
            {{ t('result.actions.to_dashboard') }}
          </router-link>
          <router-link to="/pricing" class="btn btn-outline">
            {{ t('result.actions.refill_credits') }}
          </router-link>
          <button @click="downloadPDF" class="btn btn-secondary" v-if="reportData">
            📄 {{ t('result.actions.download_pdf') }}
          </button>
        </div>
      </div>

      <div v-else class="not-found">
        <p>{{ t('result.not_found') }}</p>
        <router-link to="/dashboard" class="btn btn-primary">
          {{ t('result.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t, locale } = useI18n()
const route = useRoute()
const audit = ref(null)
const loading = ref(true)

const currentReportLang = computed(() => locale.value || 'ru')

const reportData = computed(() => {
  if (!audit.value) return null
  if (audit.value.fullReport && Object.keys(audit.value.fullReport).length > 0) {
    return audit.value.fullReport
  }
  return null
})

const getExecutiveSummaryIssues = () => {
  if (!reportData.value?.executive_summary) return []
  const summary = reportData.value.executive_summary
  return summary.top_5_critical_issues || summary.top_7_critical_issues || []
}

const formatKey = (key) => key.toUpperCase()

const formatRoadmapKey = (key) => {
  const translations = {
    week_1: t('result.roadmap.week_1'),
    week_2: t('result.roadmap.week_2'),
    week_3: t('result.roadmap.week_3'),
    month_1: t('result.roadmap.month_1'),
    month_2: t('result.roadmap.month_2'),
    month_3: t('result.roadmap.month_3'),
    quarter_1: t('result.roadmap.quarter_1'),
    quarter_2: t('result.roadmap.quarter_2')
  }
  return translations[key] || key.replace(/_/g, ' ').toUpperCase()
}

const translatePriorityCategory = (category) => {
  const translations = {
    critical: t('result.priority.critical'),
    high: t('result.priority.high'),
    medium: t('result.priority.medium'),
    low: t('result.priority.low')
  }
  return translations[category.toLowerCase()] || category
}

const translateForecastKey = (key) => {
  const translations = {
    traffic_growth: t('result.forecast_labels.traffic_growth'),
    conversion_growth: t('result.forecast_labels.conversion_growth'),
    timeline: t('result.forecast_labels.timeline')
  }
  return translations[key] || key.replace(/_/g, ' ').toUpperCase()
}

const getPriorityClass = (priority) => {
  if (!priority) return 'medium'
  const lower = String(priority).toLowerCase()
  if (lower.includes('critical') || lower.includes('критич')) return 'critical'
  if (lower.includes('high') || lower.includes('высок')) return 'high'
  if (lower.includes('medium') || lower.includes('сред')) return 'medium'
  if (lower.includes('low') || lower.includes('низк')) return 'low'
  return 'medium'
}

const getStatusClass = (status) => {
  if (!status) return ''
  const lower = String(status).toLowerCase()
  if (lower.includes('критич') || lower.includes('critical')) return 'status-critical'
  if (lower.includes('требует') || lower.includes('наруш') || lower.includes('низк') || lower.includes('requires')) return 'status-warning'
  if (lower.includes('отлично') || lower.includes('good') || lower.includes('хорош') || lower.includes('excellent')) return 'status-good'
  if (lower.includes('оптимиз') || lower.includes('optimization')) return 'status-warning'
  return 'status-neutral'
}

const getPriorityCategoryClass = (category) => {
  const lower = String(category).toLowerCase()
  if (lower.includes('critical')) return 'priority-critical'
  if (lower.includes('high')) return 'priority-high'
  if (lower.includes('medium')) return 'priority-medium'
  if (lower.includes('low')) return 'priority-low'
  return ''
}

const getScoreClass = (score) => {
  if (score === undefined || score === null || score === 'нет данных') return ''
  const numScore = typeof score === 'string' ? parseFloat(score) : score
  if (isNaN(numScore)) return ''
  if (numScore >= 90) return 'good'
  if (numScore >= 50) return 'medium'
  return 'bad'
}

const metricsList = [
  { key: 'performance' },
  { key: 'accessibility' },
  { key: 'bestPractices' },
  { key: 'seo' },
  { key: 'lcp' },
  { key: 'cls' },
  { key: 'ttfb' },
  { key: 'inp' }
]

const fetchAudit = async (lang = locale.value) => {
  try {
    loading.value = true
    const res = await axios.get(`/api/audit/${route.params.id}`, {
      params: { lang: lang }
    })
    audit.value = res.data
    console.log('📊 Данные аудита:', audit.value)
    console.log('🌐 Текущий язык отчета:', lang)
  } catch (err) {
    console.error('❌ Ошибка загрузки:', err)
    audit.value = null
  } finally {
    loading.value = false
  }
}

// ===== СКАЧИВАНИЕ PDF (ИСПРАВЛЕНО) =====
const downloadPDF = async () => {
  try {
    const response = await axios.post(`/api/audit/${audit.value._id}/pdf`, {
      lang: currentReportLang.value
    }, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `audit-report-${audit.value._id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('❌ Ошибка скачивания PDF:', error)
    alert(t('result.pdf_error'))
  }
}

onMounted(() => {
  const lang = locale.value || 'ru'
  fetchAudit(lang)
})

watch(locale, (newLang) => {
  if (audit.value) {
    fetchAudit(newLang)
  }
})

watch(() => route.params.id, () => {
  fetchAudit(locale.value)
})
</script>
<style lang="scss" scoped>
// ===== ОСНОВНЫЕ СТИЛИ =====
.result { padding: 40px 0; }

// ===== ХЕДЕР =====
.result-header { 
  text-align: center; 
  margin-bottom: 32px;
}

// ===== ИНДИКАТОР ЯЗЫКА =====
.language-indicator {
  margin-top: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  
  .label {
    color: #636e72;
    font-weight: 500;
  }
  
  .lang-badge {
    font-weight: 600;
  }
  
  .translated-note {
    color: #636e72;
    font-size: 0.75rem;
  }
}

// ===== СПИННЕР =====
.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #f8f9fa;
  border-top: 4px solid #6c5ce7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// ===== ОСТАЛЬНЫЕ СТИЛИ =====
.score-big { 
  font-size: 4rem; 
  font-weight: 800; 
  color: #6c5ce7; 
}

.score-total { 
  font-size: 1.8rem; 
  color: #636e72; 
}

.section-card { margin-bottom: 24px; }

.overall-assessment {
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}
.overall-assessment p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #1a1a2e;
  margin: 0;
}

.text-content {
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}
.text-content p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #1a1a2e;
  margin: 0;
  white-space: pre-wrap;
}

.status-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 12px;
}
.status-badge.status-critical { background: #ff6b6b; color: white; }
.status-badge.status-warning { background: #feca57; color: #333; }
.status-badge.status-good { background: #00b894; color: white; }
.status-badge.status-neutral { background: #dfe6e9; color: #333; }

.seo-score-display, .ux-score-display {
  font-size: 1rem;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}
.seo-score-display strong, .ux-score-display strong {
  color: #6c5ce7;
  font-size: 1.2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.metric-item {
  text-align: center;
  padding: 12px 8px;
  background: #f8f9fa;
  border-radius: 8px;
}
.metric-item .metric-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #636e72;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.metric-item .metric-value {
  display: block;
  font-weight: 700;
  font-size: 1.4rem;
  margin: 4px 0;
}
.metric-item .metric-value.good { color: #00b894; }
.metric-item .metric-value.medium { color: #feca57; }
.metric-item .metric-value.bad { color: #ff6b6b; }
.metric-item .metric-norm {
  display: block;
  font-size: 0.65rem;
  color: #636e72;
  font-weight: 500;
}
.metric-item .metric-explanation {
  display: block;
  font-size: 0.75rem;
  color: #636e72;
  margin-top: 4px;
  line-height: 1.4;
}

.cweb-vitals { margin-bottom: 16px; }
.cweb-vitals h4 { font-size: 0.9rem; margin-bottom: 8px; color: #636e72; }
.cweb-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
.cweb-item {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
}
.cweb-item .label { font-weight: 600; display: block; font-size: 0.9rem; color: #636e72; text-transform: uppercase; }
.cweb-item .value { font-size: 1rem; }

.issue-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border-left: 4px solid #6c5ce7;
}
.issue-card .issue-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.issue-card .issue-header .priority-badge {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  flex-shrink: 0;
}
.issue-card .issue-header .priority-badge.critical { background: #ff6b6b; color: white; }
.issue-card .issue-header .priority-badge.high { background: #feca57; color: #333; }
.issue-card .issue-header .priority-badge.medium { background: #ffd93d; color: #333; }
.issue-card .issue-header .priority-badge.low { background: #6bcb77; color: white; }
.issue-card .issue-header .issue-title { font-size: 1rem; font-weight: 600; margin: 0; color: #1a1a2e; }
.issue-card .issue-body .issue-block { margin-top: 8px; }
.issue-card .issue-body .issue-block .issue-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #636e72;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.issue-card .issue-body .issue-block p {
  font-size: 0.95rem;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.6;
}
.issue-card .issue-body .issue-block .expected-result { color: #00b894; font-weight: 500; }

.issues-list { margin-top: 12px; }
.issues-list h4 { font-size: 0.9rem; margin-bottom: 12px; color: #636e72; }
.issue-row {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.issue-row .problem { color: #ff6b6b; font-weight: 500; display: block; }
.issue-row .solution { color: #6c5ce7; font-size: 0.9rem; display: block; padding-left: 16px; }

.priority-category {
  margin-bottom: 16px;
  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
  }
  h4.priority-critical { color: #ff6b6b; }
  h4.priority-high { color: #feca57; }
  h4.priority-medium { color: #ffd93d; }
  h4.priority-low { color: #6bcb77; }
  ul {
    margin: 0;
    padding-left: 20px;
    li {
      margin-bottom: 4px;
      font-size: 0.95rem;
    }
  }
}

.roadmap-item {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #6c5ce7;
  }
  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
  }
}

.forecast-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.forecast-item {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}
.forecast-item .label { display: block;  font-weight: 700; color: #636e72; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.forecast-item .value { display: block;  }

.actions { display: flex; gap: 16px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }
.loading { text-align: center; padding: 60px 0; font-size: 1.2rem; color: #636e72; }
.not-found { text-align: center; padding: 60px 0; }

.recommendation-item {
  border-left: 4px solid #6c5ce7;
  padding: 12px 16px;
  background: #f8f9fa;
  margin-bottom: 12px;
  border-radius: 0 12px 12px 0;
}
.recommendation-item .priority {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}
.recommendation-item .priority.high { background: #ff6b6b; color: white; }
.recommendation-item .priority.medium { background: #feca57; color: #333; }
.recommendation-item .priority.low { background: #6bcb77; color: white; }
.recommendation-item .suggestion {
  margin-top: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

// ===== АДАПТИВ =====
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .forecast-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .card {
    padding: 14px;
  }
  .result {
    padding: 20px 12px;
  }
  .result-header {
    margin-bottom: 20px;
  }
  .score-big {
    font-size: 2.8rem;
  }
  .score-total {
    font-size: 1.4rem;
  }
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .metric-item {
    padding: 8px 6px;
  }
  .metric-item .metric-value {
    font-size: 1.1rem;
  }
  .metric-item .metric-explanation {
    font-size: 0.65rem;
  }
  .cweb-grid {
    grid-template-columns: 1fr;
  }
  .forecast-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .issue-card {
    padding: 12px 14px;
  }
  .issue-card .issue-header .issue-title {
    font-size: 0.9rem;
  }
  .issue-card .issue-body .issue-block p {
    font-size: 0.85rem;
  }
  .seo-score-display,
  .ux-score-display {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
  .actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .actions .btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .result {
    padding: 12px 8px;
  }
  .score-big {
    font-size: 2.2rem;
  }
  .score-total {
    font-size: 1.1rem;
  }
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .metric-item {
    padding: 6px 4px;
  }
  .metric-item .metric-label {
    font-size: 0.6rem;
  }
  .metric-item .metric-value {
    font-size: 0.95rem;
  }
  .metric-item .metric-norm {
    font-size: 0.55rem;
  }
  .metric-item .metric-explanation {
    font-size: 0.6rem;
    margin-top: 2px;
  }
  .issue-card {
    padding: 10px 12px;
  }
  .issue-card .issue-header {
    gap: 8px;
  }
  .issue-card .issue-header .issue-title {
    font-size: 0.8rem;
  }
  .issue-card .issue-body .issue-block p {
    font-size: 0.8rem;
  }
  .issue-card .issue-body .issue-block .issue-label {
    font-size: 0.6rem;
  }
  .text-content p,
  .overall-assessment p {
    font-size: 0.85rem;
  }
  .status-badge {
    font-size: 0.7rem;
    padding: 2px 12px;
  }
  .forecast-item {
    padding: 10px 8px;
  }
  .forecast-item .label {
    font-size: 0.65rem;
  }
  .forecast-item .value {
    font-size: 0.85rem;
  }
  .section-card {
    margin-bottom: 16px;
  }
  .loading,
  .not-found {
    font-size: 1rem;
    padding: 40px 0;
  }
}

@media (max-width: 360px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
  .score-big {
    font-size: 1.8rem;
  }
  .score-total {
    font-size: 0.9rem;
  }
  .issue-card .issue-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>

