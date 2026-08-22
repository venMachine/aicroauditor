const express = require('express')
const auth = require('../middleware/auth')
const Audit = require('../models/Audit')
const User = require('../models/User')
const { auditWebsite } = require('../services/aiService')
const { captureAndExtract } = require('../services/crawlerService')
const { getPageSpeedMetrics } = require('../services/metricsService')
const PDFDocument = require('pdfkit') // 👈 ДОБАВЬ ЭТУ СТРОКУ

const router = express.Router()

// ===== ЗАПУСК АУДИТА =====
router.post('/run', auth, async (req, res) => {
  try {
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

    console.log('🔍 Парсинг сайта...')
    const { textData } = await captureAndExtract(url)

    console.log('📊 Получение метрик PageSpeed...')
    const metrics = await getPageSpeedMetrics(url)
    console.log('📊 Метрики:', metrics)

    console.log(`🤖 Отправка в AI (язык: ${language})...`)
    const result = await auditWebsite(url, textData, metrics, language)
    console.log('✅ Результат от AI получен')

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
      language: language,
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

// ===== ПОЛУЧЕНИЕ ВСЕХ АУДИТОВ =====
router.get('/', auth, async (req, res) => {
  try {
    const audits = await Audit.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(audits)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== ПОЛУЧЕНИЕ ОДНОГО АУДИТА =====
router.get('/:id', auth, async (req, res) => {
  try {
    const lang = req.query.lang || 'ru'
    
    const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId })
    if (!audit) return res.status(404).json({ error: 'Not found' })
    
    if (lang !== audit.language && audit.translations && audit.translations[lang]) {
      audit.fullReport = audit.translations[lang]
    }
    
    res.json(audit)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== УДАЛЕНИЕ АУДИТА =====
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

// ===== ДОБАВЛЕНИЕ КРЕДИТОВ =====
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

// ===== ГЕНЕРАЦИЯ PDF =====
router.post('/:id/pdf', auth, async (req, res) => {
  try {
    const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId })
    if (!audit) return res.status(404).json({ error: 'Audit not found' })

    const report = audit.fullReport || {}
    const isRu = req.body.lang === 'ru'
    
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 50, right: 50 }
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=audit-report-${audit._id}.pdf`)

    doc.pipe(res)

    doc.fontSize(24)
      .fillColor('#6c5ce7')
      .text(isRu ? 'Отчет по аудиту сайта' : 'Website Audit Report', { align: 'center' })
      .moveDown(0.5)

    doc.fontSize(14)
      .fillColor('#2d3436')
      .text(audit.url, { align: 'center' })
      .moveDown(0.5)

    doc.fontSize(36)
      .fillColor('#6c5ce7')
      .text(`${audit.score} / 100`, { align: 'center' })
      .moveDown(0.5)

    doc.fontSize(10)
      .fillColor('#636e72')
      .text(`${isRu ? 'Дата аудита' : 'Audit Date'}: ${new Date(audit.createdAt).toLocaleString()}`, { align: 'center' })
      .moveDown(1)

    if (report.executive_summary) {
      doc.addPage()
      doc.fontSize(18).fillColor('#6c5ce7').text('Executive Summary', { underline: true }).moveDown(0.5)
      
      if (report.executive_summary.overall_assessment) {
        doc.fontSize(11).fillColor('#2d3436').text(report.executive_summary.overall_assessment, {
          width: 500,
          align: 'justify'
        }).moveDown(1)
      }
    }

    if (audit.metrics) {
      doc.addPage()
      doc.fontSize(18).fillColor('#6c5ce7').text(isRu ? 'Технический аудит' : 'Technical Audit', { underline: true }).moveDown(0.5)

      const metrics = audit.metrics
      const metricLabels = {
        performance: isRu ? 'Производительность' : 'Performance',
        accessibility: isRu ? 'Доступность' : 'Accessibility',
        bestPractices: isRu ? 'Лучшие практики' : 'Best Practices',
        seo: 'SEO',
        lcp: 'LCP',
        cls: 'CLS',
        ttfb: 'TTFB',
        inp: 'INP',
        fcp: 'FCP'
      }

      Object.keys(metricLabels).forEach(key => {
        const value = metrics[key]
        if (value !== undefined && value !== 'нет данных') {
          doc.fontSize(12).fillColor('#2d3436').text(`${metricLabels[key]}: ${value}`)
          doc.moveDown(0.3)
        }
      })
    }

    const allIssues = []
    if (report.executive_summary?.top_5_critical_issues) {
      report.executive_summary.top_5_critical_issues.forEach(issue => {
        allIssues.push(issue)
      })
    }

    if (allIssues.length > 0) {
      doc.addPage()
      doc.fontSize(18).fillColor('#6c5ce7').text(isRu ? 'Ключевые проблемы' : 'Key Issues', { underline: true }).moveDown(0.5)

      allIssues.slice(0, 5).forEach((issue, idx) => {
        const priorityColor = issue.priority === 'Critical' ? '#ff6b6b' : 
                           issue.priority === 'High' ? '#feca57' : '#6bcb77'
        
        doc.fontSize(14).fillColor(priorityColor).text(`${issue.priority || 'Medium'}`)
        doc.fontSize(12).fillColor('#2d3436').text(issue.issue || 'Проблема')
        doc.fontSize(10).fillColor('#636e72').text((issue.explanation || '').substring(0, 500) + '...')
        doc.moveDown(0.5)
      })
    }

    doc.end()

  } catch (error) {
    console.error('❌ Ошибка генерации PDF:', error)
    res.status(500).json({ error: 'Ошибка генерации PDF' })
  }
})

module.exports = router


// const express = require('express')
// const auth = require('../middleware/auth')
// const Audit = require('../models/Audit')
// const User = require('../models/User')
// const { auditWebsite } = require('../services/aiService')
// const { captureAndExtract } = require('../services/crawlerService')
// const { getPageSpeedMetrics } = require('../services/metricsService')

// const router = express.Router()

// router.post('/run', auth, async (req, res) => {
//   try {
//     // 👇 ДОБАВЛЯЕМ language
//     const { url, language = 'ru' } = req.body
    
//     console.log('========================================')
//     console.log('📥 ПОЛУЧЕН ЗАПРОС НА АУДИТ')
//     console.log('🔗 URL:', url)
//     console.log('🌐 Язык:', language)
//     console.log('========================================')
    
//     if (!url) {
//       return res.status(400).json({ error: 'URL не указан' })
//     }

//     const user = await User.findById(req.userId)
    
//     if (user.credits < 1) {
//       return res.status(403).json({ error: 'Недостаточно кредитов' })
//     }

//     console.log('🚀 Начинаю аудит сайта:', url)

//     // 1. Парсим сайт
//     console.log('🔍 Парсинг сайта...')
//     const { textData } = await captureAndExtract(url)

//     // 2. Получаем метрики
//     console.log('📊 Получение метрик PageSpeed...')
//     const metrics = await getPageSpeedMetrics(url)
//     console.log('📊 Метрики:', metrics)

//     // 3. Отправляем в AI с передачей языка
//     console.log(`🤖 Отправка в AI (язык: ${language})...`)
//     const result = await auditWebsite(url, textData, metrics, language) // 👈 ПЕРЕДАЕМ ЯЗЫК
//     console.log('✅ Результат от AI получен')

//     // ===== СОХРАНЯЕМ =====
//     const audit = new Audit({
//       userId: req.userId,
//       url,
//       score: result.score || 0,
//       recommendations: result.recommendations || [],
//       metrics: {
//         performance: metrics?.performance || 0,
//         accessibility: metrics?.accessibility || 0,
//         bestPractices: metrics?.bestPractices || 0,
//         seo: metrics?.seo || 0,
//         lcp: metrics?.lcp || 'нет данных',
//         cls: metrics?.cls || 'нет данных',
//         ttfb: metrics?.ttfb || 'нет данных',
//         inp: metrics?.inp || 'нет данных',
//         fcp: metrics?.fcp || 'нет данных'
//       },
//       fullReport: result,
//       language: language, // 👈 СОХРАНЯЕМ ЯЗЫК
//       originalLanguage: language
//     })
//     await audit.save()

//     user.credits -= 1
//     await user.save()

//     console.log('✅ Аудит завершен, ID:', audit._id)
//     console.log('🌐 Язык сохранен:', audit.language)
//     console.log('========================================')
    
//     res.json(audit)
    
//   } catch (error) {
//     console.error('❌ Ошибка аудита:', error.message)
//     console.error('📋 Стек:', error.stack)
//     res.status(500).json({ 
//       error: 'Ошибка анализа: ' + error.message
//     })
//   }
// })

// router.get('/', auth, async (req, res) => {
//   try {
//     const audits = await Audit.find({ userId: req.userId }).sort({ createdAt: -1 })
//     res.json(audits)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// router.get('/:id', auth, async (req, res) => {
//   try {
//     const lang = req.query.lang || 'ru'
    
//     const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId })
//     if (!audit) return res.status(404).json({ error: 'Not found' })
    
//     // Если запрошенный язык отличается от сохраненного и есть перевод - отдаем перевод
//     if (lang !== audit.language && audit.translations && audit.translations[lang]) {
//       audit.fullReport = audit.translations[lang]
//     }
    
//     res.json(audit)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId })
//     if (!audit) return res.status(404).json({ error: 'Not found' })
//     await audit.deleteOne()
//     res.json({ success: true })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// router.post('/add-credits', auth, async (req, res) => {
//   try {
//     const { amount } = req.body
//     const user = await User.findById(req.userId)
//     user.credits += amount || 10
//     await user.save()
//     res.json({ credits: user.credits })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// module.exports = router