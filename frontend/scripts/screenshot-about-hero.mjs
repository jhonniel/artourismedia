import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForSelector('.about-hero__artboard', { timeout: 30000 })
const artboard = page.locator('.about-hero__artboard')
await artboard.screenshot({ path: '../assets/about-hero-current.png' })
await browser.close()
console.log('saved')
