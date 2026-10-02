import { chromium } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:8000/about', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForSelector('.about-hero__artboard', { timeout: 30000 })
await page.locator('.about-hero__artboard').screenshot({
  path: path.join(root, 'assets', 'about-hero-artboard.png'),
})
await browser.close()
console.log('saved artboard crop')
