const puppeteer = require('puppeteer')

async function captureAndExtract(url) {

  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    const pageData = await page.evaluate(() => {
      const headlines = Array.from(document.querySelectorAll('h1, h2, h3')).map(el => el.innerText.trim())
      const buttons = Array.from(document.querySelectorAll('button, a.button, .btn')).map(el => el.innerText.trim())
      const paragraphs = Array.from(document.querySelectorAll('p')).map(el => el.innerText.trim()).slice(0, 15)
      
      const metaTags = {
        title: document.querySelector('title')?.innerText || 'нет данных',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || 'нет данных',
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || 'нет данных'
      }
      
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.getAttribute('src') || 'нет данных',
        alt: img.getAttribute('alt') || 'нет данных',
        loading: img.getAttribute('loading') || 'нет данных'
      })).slice(0, 20)
      
      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.getAttribute('href') || 'нет данных',
        text: a.innerText.trim().slice(0, 50)
      })).slice(0, 30)

      return { 
        headlines, 
        buttons, 
        paragraphs, 
        metaTags, 
        images, 
        links 
      }
    })

    await browser.close()
    return { textData: pageData }
  } catch (error) {
    await browser.close()
    throw new Error('Не удалось загрузить сайт: ' + error.message)
  }
}

module.exports = { captureAndExtract }