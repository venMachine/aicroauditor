
const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.AITUNNEL_API_KEY,
  baseURL: process.env.AITUNNEL_BASE_URL || 'https://api.aitunnel.ru/v1/'
})

// ===== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПРОМТА НА НУЖНОМ ЯЗЫКЕ =====
function getAuditPrompt(url, pageData, metrics, language = 'ru') {
  const safeMetrics = metrics || {}
  const safePageData = pageData || { headlines: [], buttons: [], paragraphs: [], metaTags: {}, images: [], links: [] }

  const headlines = safePageData.headlines?.slice(0, 10).join(' | ') || 'no data'
  const buttons = safePageData.buttons?.slice(0, 10).join(' | ') || 'no data'
  const paragraphs = safePageData.paragraphs?.slice(0, 10).join(' ') || 'no data'
  const metaTags = safePageData.metaTags || {}
  const imagesCount = safePageData.images?.length || 0
  const linksCount = safePageData.links?.length || 0

  // Промт на русском
  const ruPrompt = `
Ты — старший веб-аудитор с 10-летним опытом в enterprise-SEO, CRO и UX-исследованиях.
Ты готовишь отчёт для руководителя (CMO/CTO), который принимает решения о бюджете.

=== ИСХОДНЫЕ ДАННЫЕ ===
Сайт: ${url}

Метрики PageSpeed Insights:
- Performance: ${safeMetrics.performance || 'нет данных'}/100
- Accessibility: ${safeMetrics.accessibility || 'нет данных'}/100  
- Best Practices: ${safeMetrics.bestPractices || 'нет данных'}/100
- SEO: ${safeMetrics.seo || 'нет данных'}/100
- LCP: ${safeMetrics.lcp || 'нет данных'} (норма < 2.5с)
- CLS: ${safeMetrics.cls || 'нет данных'} (норма < 0.1)
- TTFB: ${safeMetrics.ttfb || 'нет данных'} (норма < 200мс)
- INP: ${safeMetrics.inp || 'нет данных'} (норма < 200мс)

Структура сайта:
- Заголовки H1-H3: ${headlines}
- CTA-кнопки: ${buttons}
- Основные тексты: ${paragraphs}
- Meta Title: ${metaTags.title || 'нет данных'}
- Meta Description: ${metaTags.description || 'нет данных'}
- Количество изображений: ${imagesCount}
- Количество внутренних ссылок: ${linksCount}

=== СТРУКТУРА ОТВЕТА ===

Верни ТОЛЬКО JSON со следующей структурой. ВСЕ поля должны быть строго по типам:

{
  "score": число 0-100,

  "executive_summary": {
    "overall_assessment": "СТРОКА. Развернутая оценка, 3-4 абзаца.",
    "top_5_critical_issues": [
      {
        "issue": "СТРОКА. Название проблемы",
        "explanation": "СТРОКА. Подробное объяснение, минимум 200 слов",
        "business_impact": "СТРОКА. Влияние на бизнес, минимум 200 слов",
        "recommendation": "СТРОКА. Пошаговый план, минимум 200 слов",
        "resources_needed": "СТРОКА. Ресурсы",
        "priority": "СТРОКА. Critical/High/Medium/Low",
        "expectedResult": "СТРОКА. Конкретные цифры"
      }
    ]
  },

  "technical_audit": {
    "core_web_vitals": {
      "lcp": "СТРОКА",
      "cls": "СТРОКА",
      "ttfb": "СТРОКА"
    },
    "issues": [
      {
        "problem": "СТРОКА",
        "recommendation": "СТРОКА"
      }
    ]
  },

  "seo_audit": {
    "status": "СТРОКА. Требуется оптимизация/Хорошо/Отлично",
    "score": число 0-100,
    "issues": [
      {
        "issue": "СТРОКА. Название SEO-проблемы",
        "explanation": "СТРОКА. Подробное объяснение, минимум 200 слов",
        "business_impact": "СТРОКА. Влияние на бизнес, минимум 200 слов",
        "recommendation": "СТРОКА. Пошаговый план, минимум 200 слов",
        "resources_needed": "СТРОКА. Ресурсы",
        "priority": "СТРОКА. Critical/High/Medium/Low",
        "expectedResult": "СТРОКА. Конкретные цифры"
      }
    ]
  },

  "ux_ui_audit": {
    "status": "СТРОКА. Критично/Требует улучшения/Хорошо",
    "score": число 0-100,
    "issues": [
      {
        "issue": "СТРОКА. Название UX-проблемы",
        "explanation": "СТРОКА. Подробное объяснение, минимум 200 слов",
        "business_impact": "СТРОКА. Влияние на бизнес, минимум 200 слов",
        "recommendation": "СТРОКА. Пошаговый план, минимум 200 слов",
        "resources_needed": "СТРОКА. Ресурсы",
        "priority": "СТРОКА. Critical/High/Medium/Low",
        "expectedResult": "СТРОКА. Конкретные цифры"
      }
    ]
  },

  "prioritization": "СТРОКА. Подробное объяснение приоритизации, минимум 200 слов",

  "roadmap": "СТРОКА. Подробное объяснение дорожной карты, минимум 200 слов",

  "forecast": {
    "traffic_growth": "СТРОКА. Прогноз роста трафика, минимум 200 слов",
    "conversion_growth": "СТРОКА. Прогноз роста конверсии, минимум 200 слов",
    "timeline": "СТРОКА. Сроки"
  }
}

=== ПРАВИЛА ===
1. ТОЛЬКО JSON, без лишнего текста
2. НЕ используй эмодзи
3. Пиши простым языком, объясняй сложные термины
4. Используй конкретные цифры и аналогии
5. Пиши на РУССКОМ языке
6. seo_audit — ЭТО ОБЪЕКТ с полями status, score, issues
7. ux_ui_audit — ЭТО ОБЪЕКТ с полями status, score, issues
8. prioritization — ЭТО СТРОКА
9. roadmap — ЭТО СТРОКА
`

  // Промт на английском
  const enPrompt = `
You are a senior web auditor with 10 years of experience in enterprise-SEO, CRO and UX research.
You are preparing a report for a decision-maker (CMO/CTO) who makes budget decisions.

=== INPUT DATA ===
Website: ${url}

PageSpeed Insights Metrics:
- Performance: ${safeMetrics.performance || 'no data'}/100
- Accessibility: ${safeMetrics.accessibility || 'no data'}/100  
- Best Practices: ${safeMetrics.bestPractices || 'no data'}/100
- SEO: ${safeMetrics.seo || 'no data'}/100
- LCP: ${safeMetrics.lcp || 'no data'} (norm < 2.5s)
- CLS: ${safeMetrics.cls || 'no data'} (norm < 0.1)
- TTFB: ${safeMetrics.ttfb || 'no data'} (norm < 200ms)
- INP: ${safeMetrics.inp || 'no data'} (norm < 200ms)

Site Structure:
- Headings H1-H3: ${headlines}
- CTA Buttons: ${buttons}
- Main Content: ${paragraphs}
- Meta Title: ${metaTags.title || 'no data'}
- Meta Description: ${metaTags.description || 'no data'}
- Number of Images: ${imagesCount}
- Number of Internal Links: ${linksCount}

=== RESPONSE STRUCTURE ===

Return ONLY JSON with the following structure. ALL fields must strictly follow the types:

{
  "score": number 0-100,

  "executive_summary": {
    "overall_assessment": "STRING. Detailed assessment, 3-4 paragraphs.",
    "top_5_critical_issues": [
      {
        "issue": "STRING. Issue name",
        "explanation": "STRING. Detailed explanation, minimum 200 words",
        "business_impact": "STRING. Business impact, minimum 200 words",
        "recommendation": "STRING. Step-by-step plan, minimum 200 words",
        "resources_needed": "STRING. Resources needed",
        "priority": "STRING. Critical/High/Medium/Low",
        "expectedResult": "STRING. Specific numbers"
      }
    ]
  },

  "technical_audit": {
    "core_web_vitals": {
      "lcp": "STRING",
      "cls": "STRING",
      "ttfb": "STRING"
    },
    "issues": [
      {
        "problem": "STRING",
        "recommendation": "STRING"
      }
    ]
  },

  "seo_audit": {
    "status": "STRING. Needs optimization/Good/Excellent",
    "score": number 0-100,
    "issues": [
      {
        "issue": "STRING. SEO issue name",
        "explanation": "STRING. Detailed explanation, minimum 200 words",
        "business_impact": "STRING. Business impact, minimum 200 words",
        "recommendation": "STRING. Step-by-step plan, minimum 200 words",
        "resources_needed": "STRING. Resources needed",
        "priority": "STRING. Critical/High/Medium/Low",
        "expectedResult": "STRING. Specific numbers"
      }
    ]
  },

  "ux_ui_audit": {
    "status": "STRING. Critical/Needs improvement/Good",
    "score": number 0-100,
    "issues": [
      {
        "issue": "STRING. UX issue name",
        "explanation": "STRING. Detailed explanation, minimum 200 words",
        "business_impact": "STRING. Business impact, minimum 200 words",
        "recommendation": "STRING. Step-by-step plan, minimum 200 words",
        "resources_needed": "STRING. Resources needed",
        "priority": "STRING. Critical/High/Medium/Low",
        "expectedResult": "STRING. Specific numbers"
      }
    ]
  },

  "prioritization": "STRING. Detailed prioritization explanation, minimum 200 words",

  "roadmap": "STRING. Detailed roadmap explanation, minimum 200 words",

  "forecast": {
    "traffic_growth": "STRING. Traffic growth forecast, minimum 200 words",
    "conversion_growth": "STRING. Conversion growth forecast, minimum 200 words",
    "timeline": "STRING. Timeline"
  }
}

=== RULES ===
1. ONLY JSON, no extra text
2. DO NOT use emojis
3. Write in simple language, explain complex terms
4. Use specific numbers and analogies
5. Write in ENGLISH
6. seo_audit — MUST BE an OBJECT with fields status, score, issues
7. ux_ui_audit — MUST BE an OBJECT with fields status, score, issues
8. prioritization — MUST BE a STRING
9. roadmap — MUST BE a STRING
`

  return language === 'en' ? enPrompt : ruPrompt
}

// ===== ОСНОВНАЯ ФУНКЦИЯ АУДИТА =====
async function auditWebsite(url, pageData, metrics, language = 'ru') {
  console.log(' НАЧАЛО АУДИТА');
  console.log(' Язык:', language);
  console.log(' URL:', url);

  const prompt = getAuditPrompt(url, pageData, metrics, language)

  const systemPrompts = {
    ru: 'Ты старший веб-аудитор. Отвечай только в формате JSON. НЕ используй эмодзи. Пиши на русском языке. Давай максимально развёрнутые ответы.',
    en: 'You are a senior web auditor. Respond only in JSON format. DO NOT use emojis. Write in English. Provide the most detailed responses possible.'
  }

  const systemPrompt = systemPrompts[language] || systemPrompts.ru

  try {
    console.log(' Отправка запроса в AI Tunnel...')
    
    
    const response = await openai.chat.completions.create({
      model: 'claude-opus-5', 
      messages: [
        { 
          role: 'system', 
          content: systemPrompt
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 100000,
      temperature: 0.3
    })

    const content = response.choices[0].message.content
    console.log('✅ AI ответ получен, длина:', content.length)

    let cleanContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
    
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanContent = jsonMatch[0]
    }
    
    const result = JSON.parse(cleanContent)
    console.log('✅ Парсинг JSON успешен')
    return result
    
  } catch (error) {
    console.log('========================================')
    console.log('❌ ОШИБКА В AI TUNNEL:')
    console.log('📝 Сообщение:', error.message)
    console.log('📊 Статус:', error.status || 'нет статуса')
    
    if (error.response) {
      console.log('📦 Данные ответа:', JSON.stringify(error.response.data, null, 2))
    }
    console.log('========================================')

    // Возвращаем fallback с информацией об ошибке
    const fallbacks = {
      ru: {
        score: 70,
        executive_summary: {
          overall_assessment: `Анализ не удался. Ошибка: ${error.message}. Пожалуйста, попробуйте позже.`,
          top_5_critical_issues: [{
            issue: 'Ошибка AI',
            explanation: `Произошла ошибка: ${error.message}. Попробуйте повторить анализ.`,
            business_impact: 'Высокое влияние на принятие решений',
            recommendation: 'Повторите запрос через несколько минут',
            resources_needed: '5 минут времени',
            priority: 'High',
            expectedResult: 'Полный отчёт с рекомендациями'
          }]
        },
        technical_audit: { core_web_vitals: { lcp: '—', cls: '—', ttfb: '—' }, issues: [] },
        seo_audit: { status: 'Требуется оптимизация', score: 0, issues: [] },
        ux_ui_audit: { status: 'Требует улучшения', score: 0, issues: [] },
        prioritization: 'Данные по приоритизации отсутствуют',
        roadmap: 'Данные по дорожной карте отсутствуют',
        forecast: { traffic_growth: '—', conversion_growth: '—', timeline: '—' }
      },
      en: {
        score: 70,
        executive_summary: {
          overall_assessment: `Analysis failed. Error: ${error.message}. Please try again later.`,
          top_5_critical_issues: [{
            issue: 'AI Error',
            explanation: `An error occurred: ${error.message}. Please try again.`,
            business_impact: 'High impact on decision making',
            recommendation: 'Retry the request in a few minutes',
            resources_needed: '5 minutes of time',
            priority: 'High',
            expectedResult: 'Full report with recommendations'
          }]
        },
        technical_audit: { core_web_vitals: { lcp: '—', cls: '—', ttfb: '—' }, issues: [] },
        seo_audit: { status: 'Needs optimization', score: 0, issues: [] },
        ux_ui_audit: { status: 'Needs improvement', score: 0, issues: [] },
        prioritization: 'No prioritization data available',
        roadmap: 'No roadmap data available',
        forecast: { traffic_growth: '—', conversion_growth: '—', timeline: '—' }
      }
    }

    return fallbacks[language] || fallbacks.ru
  }
}

module.exports = { auditWebsite }

