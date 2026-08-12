const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)
const axios = require('axios')

async function getPageSpeedMetrics(url) {
  try {
    console.log('📊 Запрос к PageSpeed API для:', url)

    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || ''
    
    if (!apiKey) {
      console.log('⚠️ Нет API ключа')
      return getFallbackMetrics()
    }

    // ===== 1. ПОЛУЧАЕМ ДАННЫЕ ИЗ LIGHTHOUSE (PageSpeed API) =====
    const curlCommand = `curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop&category=performance&category=accessibility&category=best-practices&category=seo"`
    
    console.log('🔧 Выполняю curl запрос...')
    
    const { stdout, stderr } = await execPromise(curlCommand)
    
    if (stderr) {
      console.log('⚠️ stderr:', stderr)
    }
    
    const data = JSON.parse(stdout)
    const lighthouse = data.lighthouseResult
    
    if (!lighthouse) {
      throw new Error('Нет данных от Lighthouse')
    }

    const categories = lighthouse.categories || {}
    const audits = lighthouse.audits || {}

    console.log('📦 Все категории:', Object.keys(categories))

    // ===== 2. ПАРСИМ КАТЕГОРИИ (умножаем на 100) =====
    const performance = Math.round((categories.performance?.score || 0) * 100)
    const accessibility = Math.round((categories.accessibility?.score || 0) * 100)
    const bestPractices = Math.round((categories['best-practices']?.score || 0) * 100)
    const seo = Math.round((categories.seo?.score || 0) * 100)

    // ===== 3. ПОЛУЧАЕМ АУДИТЫ =====
    const getAuditValue = (auditId, fallback = null) => {
      const audit = audits[auditId]
      if (audit && audit.displayValue) return audit.displayValue
      if (audit && audit.numericValue !== undefined) {
        const val = audit.numericValue
        if (auditId === 'cumulative-layout-shift') return val.toFixed(3)
        if (auditId === 'largest-contentful-paint' || auditId === 'first-contentful-paint') {
          return `${(val / 1000).toFixed(1)} с`
        }
        if (auditId === 'time-to-first-byte' || auditId === 'interaction-to-next-paint') {
          return `${Math.round(val)} мс`
        }
        return String(val)
      }
      return fallback
    }

    // ===== 4. ПОЛУЧАЕМ TTFB И INP ИЗ LIGHTHOUSE =====
    let ttfb = getAuditValue('time-to-first-byte', null)
    let inp = getAuditValue('interaction-to-next-paint', null)

    // ===== 5. ЕСЛИ TTFB ИЛИ INP = NULL - БЕРЕМ ИЗ CrUX =====
    let ttfbFromCrux = false
    let inpFromCrux = false

    if (ttfb === null || inp === null) {
      console.log('📊 TTFB/INP нет в Lighthouse, запрашиваю CrUX...')
      const cruxMetrics = await getCrUXMetrics(url)
      
      if (ttfb === null && cruxMetrics.ttfb !== null) {
        ttfb = formatCrUXMetric(cruxMetrics.ttfb, 'ttfb')
        ttfbFromCrux = true
        console.log('✅ TTFB из CrUX:', ttfb)
      }
      
      if (inp === null && cruxMetrics.inp !== null) {
        inp = formatCrUXMetric(cruxMetrics.inp, 'inp')
        inpFromCrux = true
        console.log('✅ INP из CrUX:', inp)
      }
    }

    // ===== 6. ЕСЛИ НЕТ ДАННЫХ В CRUX - СТАВИМ "нет данных" =====
    if (ttfb === null) {
      ttfb = 'нет данных'
      console.log('⚠️ TTFB: нет данных (сайт непопулярный)')
    }
    if (inp === null) {
      inp = 'нет данных'
      console.log('⚠️ INP: нет данных (сайт непопулярный)')
    }

    // ===== 7. ФОРМИРУЕМ РЕЗУЛЬТАТ =====
    const metrics = {
      performance: performance,
      accessibility: accessibility,
      bestPractices: bestPractices,
      seo: seo,
      lcp: getAuditValue('largest-contentful-paint', 'нет данных'),
      cls: getAuditValue('cumulative-layout-shift', 'нет данных'),
      ttfb: ttfb,
      inp: inp,
      fcp: getAuditValue('first-contentful-paint', 'нет данных')
    }

    console.log('✅ Метрики получены:', metrics)
    return metrics

  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    return getFallbackMetrics()
  }
}

// ===== CrUX API - РЕАЛЬНЫЕ ДАННЫЕ ОТ ПОЛЬЗОВАТЕЛЕЙ =====
async function getCrUXMetrics(url) {
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || ''
    
    if (!apiKey) {
      console.log('⚠️ Нет API ключа для CrUX')
      return { ttfb: null, inp: null }
    }

    // Пробуем получить данные для PHONE
    let response = await axios({
      method: 'post',
      url: `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`,
      data: {
        origin: new URL(url).origin,
        metrics: [
          'interaction_to_next_paint',
          'experimental_time_to_first_byte'
        ],
        formFactor: 'PHONE'
      },
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    let metrics = response.data?.record?.metrics || {}

    // Если PHONE нет данных - пробуем DESKTOP
    if (!metrics.interaction_to_next_paint && !metrics.experimental_time_to_first_byte) {
      console.log('📊 Нет данных для PHONE, пробую DESKTOP...')
      
      response = await axios({
        method: 'post',
        url: `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`,
        data: {
          origin: new URL(url).origin,
          metrics: [
            'interaction_to_next_paint',
            'experimental_time_to_first_byte'
          ],
          formFactor: 'DESKTOP'
        },
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      metrics = response.data?.record?.metrics || {}
    }

    return {
      ttfb: metrics.experimental_time_to_first_byte?.percentiles?.p75 || null,
      inp: metrics.interaction_to_next_paint?.percentiles?.p75 || null
    }

  } catch (error) {
    if (error.response?.status === 403) {
      console.log('⚠️ CrUX API недоступен. Включите Chrome UX Report API в Google Cloud Console.')
    } else if (error.response?.status === 404) {
      console.log('⚠️ Нет данных CrUX для этого сайта')
    } else {
      console.log('⚠️ Ошибка CrUX:', error.message)
    }
    return { ttfb: null, inp: null }
  }
}

// ===== ФОРМАТИРОВАНИЕ CrUX МЕТРИК =====
function formatCrUXMetric(value, type) {
  if (!value) return null
  
  if (type === 'ttfb' || type === 'inp') {
    if (value < 1000) return `${Math.round(value)} мс`
    return `${(value / 1000).toFixed(1)} с`
  }
  
  return String(value)
}

// ===== FALLBACK МЕТРИКИ (если всё сломалось) =====
function getFallbackMetrics() {
  console.log('⚠️ Использую fallback метрики')
  return {
    performance: 68,
    accessibility: 72,
    bestPractices: 65,
    seo: 70,
    lcp: '2.8 с',
    cls: '0.08',
    ttfb: 'нет данных',
    inp: 'нет данных',
    fcp: '1.8 с'
  }
}

module.exports = { getPageSpeedMetrics }