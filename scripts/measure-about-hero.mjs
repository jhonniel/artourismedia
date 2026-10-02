import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:8000/about', { waitUntil: 'networkidle' })
const artboard = page.locator('.about-hero__artboard')
const box = await artboard.boundingBox()
const selectors = [
  '.about-hero__copy',
  '.about-hero__peach-circle',
  '.about-hero__portrait-wrap',
  '.about-hero__rays',
  '.about-hero__signature',
  '.about-hero__dots',
  '.about-hero__quote-card',
  '.about-hero__waves',
]

for (const sel of selectors) {
  const el = page.locator(sel)
  const b = await el.boundingBox()
  if (!b || !box) continue
  const pct = (v, total) => `${((v / total) * 100).toFixed(1)}%`
  console.log(sel, {
    left: pct(b.x - box.x, box.width),
    top: pct(b.y - box.y, box.height),
    width: pct(b.width, box.width),
    height: pct(b.height, box.height),
  })
}

await browser.close()
