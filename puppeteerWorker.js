const puppeteer = require('puppeteer-core')

async function run () {
  const inpDataB64 = process.argv.find((a) => a.startsWith('--input-data')).replace('--input-data', '')
  const inputData = JSON.parse(Buffer.from(inpDataB64, 'base64').toString())

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium', headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: inputData.width,
    height: inputData.height,
    deviceScale: 1
  })
  await page.goto(`https://${inputData.url}`, { waitUntil: 'networkidle0' })
  await page.screenshot({ path: inputData.filename })
  await browser.close()
}

run()
