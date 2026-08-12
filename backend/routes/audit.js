const express = require('express')
const auth = require('../middleware/auth')
const Audit = require('../models/Audit')
const User = require('../models/User')
const { auditWebsite } = require('../services/aiService')
const { captureAndExtract } = require('../services/crawlerService')
const { getPageSpeedMetrics } = require('../services/metricsService')

const router = express.Router()

router.post('/run', auth, async (req, res) => {
  try {
    // 👇 ДОБАВЛЯЕМ language
    const { url, language = 'ru' } = req.body
    
    console.log('========================================')
    console.log('📥 ПОЛУЧЕН ЗАПРОС НА АУДИТ')
    console.log('🔗 URL:', url)
    console.log('🌐 Язык:', language)
    console.log('========================================')
    
    if (!url) {
      return res.status(400).json({ error: 'URL не указан' })
    }

    const user = await User.findById(req.userId)
    
    if (user.credits < 1) {
      return res.status(403).json({ error: 'Недостаточно кредитов' })
    }

    console.log('🚀 Начинаю аудит сайта:', url)

    // 1. Парсим сайт
    console.log('🔍 Парсинг сайта...')
    const { textData } = await captureAndExtract(url)

    // 2. Получаем метрики
    console.log('📊 Получение метрик PageSpeed...')
    const metrics = await getPageSpeedMetrics(url)
    console.log('📊 Метрики:', metrics)

    // 3. Отправляем в AI с передачей языка
    console.log(`🤖 Отправка в AI (язык: ${language})...`)
    const result = await auditWebsite(url, textData, metrics, language) // 👈 ПЕРЕДАЕМ ЯЗЫК
    console.log('✅ Результат от AI получен')

    // ===== СОХРАНЯЕМ =====
    const audit = new Audit({
      userId: req.userId,
      url,
      score: result.score || 0,
      recommendations: result.recommendations || [],
      metrics: {
        performance: metrics?.performance || 0,
        accessibility: metrics?.accessibility || 0,
        bestPractices: metrics?.bestPractices || 0,
        seo: metrics?.seo || 0,
        lcp: metrics?.lcp || 'нет данных',
        cls: metrics?.cls || 'нет данных',
        ttfb: metrics?.ttfb || 'нет данных',
        inp: metrics?.inp || 'нет данных',
        fcp: metrics?.fcp || 'нет данных'
      },
      fullReport: result,
      language: language, // 👈 СОХРАНЯЕМ ЯЗЫК
      originalLanguage: language
    })
    await audit.save()

    user.credits -= 1
    await user.save()

    console.log('✅ Аудит завершен, ID:', audit._id)
    console.log('🌐 Язык сохранен:', audit.language)
    console.log('========================================')
    
    res.json(audit)
    
  } catch (error) {
    console.error('❌ Ошибка аудита:', error.message)
    console.error('📋 Стек:', error.stack)
    res.status(500).json({ 
      error: 'Ошибка анализа: ' + error.message
    })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const audits = await Audit.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(audits)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const lang = req.query.lang || 'ru'
    
    const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId })
    if (!audit) return res.status(404).json({ error: 'Not found' })
    
    // Если запрошенный язык отличается от сохраненного и есть перевод - отдаем перевод
    if (lang !== audit.language && audit.translations && audit.translations[lang]) {
      audit.fullReport = audit.translations[lang]
    }
    
    res.json(audit)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId })
    if (!audit) return res.status(404).json({ error: 'Not found' })
    await audit.deleteOne()
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/add-credits', auth, async (req, res) => {
  try {
    const { amount } = req.body
    const user = await User.findById(req.userId)
    user.credits += amount || 10
    await user.save()
    res.json({ credits: user.credits })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router