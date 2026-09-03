import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

const data = await page.evaluate(() => {
  const frames = [...document.querySelectorAll('section .lg\\:hidden div')]
    .map((el) => ({
      className: el.className,
      minHeight: getComputedStyle(el).minHeight,
      height: getComputedStyle(el).height,
      rect: el.getBoundingClientRect(),
    }))
    .filter((x) => x.className.includes('clamp') || x.className.includes('rounded'))

  const slideshowRoot = document.querySelector('section .lg\\:hidden .isolate')
  return { frames, slideshowRootClass: slideshowRoot?.className, slideshowRect: slideshowRoot?.getBoundingClientRect() }
})

console.log(JSON.stringify(data, null, 2))
await browser.close()
