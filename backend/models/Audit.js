const mongoose = require('mongoose')

const AuditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  score: { type: Number, min: 0, max: 100 },
  
  // Старый формат
  recommendations: [{
    category: String,
    priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'] },
    description: String,
    suggestion: String
  }],
  
  // ===== МЕТРИКИ =====
  metrics: {
    performance: { type: Number, default: 0 },
    accessibility: { type: Number, default: 0 },
    bestPractices: { type: Number, default: 0 },
    seo: { type: Number, default: 0 },
    lcp: { type: String, default: 'нет данных' },
    cls: { type: String, default: 'нет данных' },
    ttfb: { type: String, default: 'нет данных' },
    inp: { type: String, default: 'нет данных' },
    fcp: { type: String, default: 'нет данных' }
  },
  
  // ===== ПОЛНЫЙ ОТВЕТ AI =====
  fullReport: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Audit', AuditSchema)