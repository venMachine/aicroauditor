const Audit = require('../models/Audit')
const User = require('../models/User')
const { auditWebsite } = require('../services/aiService')
const { captureAndExtract } = require('../services/crawlerService')
const { getPageSpeedMetrics } = require('../services/metricsService')

exports.runAudit = async (req, res) => {
  try {
    const { url } = req.body
    
    if (!url) {
      return res.status(400).json({ error: 'URL не указан' })
    }

    const user = await User.findById(req.userId)
    
    if (user.credits < 1) {
      return res.status(403).json({ error: 'Недостаточно кредитов' })
    }

    console.log('🔄 Начинаю аудит сайта:', url)

    // 1. Парсим сайт
    console.log('📄 Парсинг сайта...')
    const { textData } = await captureAndExtract(url)

    // 2. Получаем метрики
    console.log('📊 Получение метрик PageSpeed...')
    const metrics = await getPageSpeedMetrics(url)

    // 3. Отправляем в AI
    console.log('🤖 Отправка в AI...')
    const result = await auditWebsite(url, textData, metrics)

    console.log('📊 Результат от AI:', JSON.stringify(result, null, 2))

    // ===== СОХРАНЯЕМ ВСЁ =====
    const audit = new Audit({
      userId: req.userId,
      url,
      
      // Основная оценка
      score: result.score || 0,
      
      // Старый формат (для обратной совместимости)
      recommendations: result.recommendations || [],
      
      // ===== НОВЫЕ ПОЛЯ =====
      metrics: {
        performance: metrics?.performance || 0,
        accessibility: metrics?.accessibility || 0,
        seo: metrics?.seo || 0,
        lcp: metrics?.lcp || 'нет данных',
        cls: metrics?.cls || 'нет данных',
        ttfb: metrics?.ttfb || 'нет данных',
        fcp: metrics?.fcp || 'нет данных',
        si: metrics?.si || 'нет данных'
      },
      
      // ===== ПОЛНЫЙ ОТВЕТ AI =====
      fullReport: result
    })
    await audit.save()

    // Списываем кредит
    user.credits -= 1
    await user.save()

    console.log(' Аудит завершен, ID:', audit._id)
    res.json(audit)
    
  } catch (error) {
    console.error(' Ошибка аудита:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({ 
      error: 'Ошибка анализа: ' + error.message
    })
  }
}

exports.getAudits = async (req, res) => {
  try {
    const audits = await Audit.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(audits)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAuditById = async (req, res) => {
  try {
    const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId })
    if (!audit) return res.status(404).json({ error: 'Not found' })
    res.json(audit)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}