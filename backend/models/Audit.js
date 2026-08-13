const mongoose = require('mongoose')

const AuditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  score: { type: Number, min: 0, max: 100 },
  
  // 👇 ЯЗЫК
  language: { 
    type: String, 
    enum: ['ru', 'en'], 
    default: 'ru',
    required: true 
  },
  
  originalLanguage: { 
    type: String, 
    enum: ['ru', 'en'], 
    default: 'ru' 
  },
  
  recommendations: [{
    category: String,
    priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'] },
    description: String,
    suggestion: String
  }],
  
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
  
  fullReport: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // 👇 ПЕРЕВОДЫ
  translations: {
    en: { type: mongoose.Schema.Types.Mixed, default: null },
    ru: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  
  createdAt: { type: Date, default: Date.now },
  lastTranslatedAt: { type: Date, default: null }
})

AuditSchema.index({ userId: 1, createdAt: -1 })
AuditSchema.index({ userId: 1, language: 1 })
AuditSchema.index({ url: 1 })

module.exports = mongoose.model('Audit', AuditSchema)