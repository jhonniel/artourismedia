/**
 * Quick layout sanity check — run with dev server on :5173
 * node scripts/check-hero-layout.mjs
 */
import { chromium } from 'playwright'

const widths = [390, 768, 1024, 1440, 1920, 2560]

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  let failed = false

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const shell = document.querySelector('.hero-shell')
      const copy = document.querySelector('.hero-shell .hero-copy')
      const media = document.querySelector('.hero-media')
      const logo = document.querySelector('header a[href="/"]')

      if (!copy || !media) {
        return { error: 'Hero elements missing' }
      }

      const copyBox = copy.getBoundingClientRect()
      const mediaBox = media.getBoundingClientRect()
      const shellBox = shell?.getBoundingClientRect()
      const logoBox = logo?.getBoundingClientRect()

      const copyStyle = window.getComputedStyle(copy)
      const copyPaddingLeft = parseFloat(copyStyle.paddingLeft) || 0
      const copyPaddingRight = parseFloat(copyStyle.paddingRight) || 0
      const textStart = Math.round(copyBox.left + copyPaddingLeft)
      const readableWidth = Math.round(copyBox.width - copyPaddingLeft - copyPaddingRight)

      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        hasHorizontalScroll: doc.scrollWidth > doc.clientWidth + 1,
        copyLeft: Math.round(copyBox.left),
        copyWidth: Math.round(copyBox.width),
        readableWidth,
        textStart,
        logoLeft: logoBox ? Math.round(logoBox.left) : null,
        mediaLeft: Math.round(mediaBox.left),
        mediaWidth: Math.round(mediaBox.width),
        mediaRight: Math.round(mediaBox.right),
        viewportWidth: window.innerWidth,
        shellLeft: shellBox ? Math.round(shellBox.left) : null,
        mediaFillsViewport: Math.abs(mediaBox.width - window.innerWidth) <= 2,
        copyHasSolidBg: copyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)',
      }
    })

    console.log(`\n${width}px:`, metrics)

    if (metrics.error) {
      failed = true
      continue
    }

    if (metrics.hasHorizontalScroll) {
      console.error(`  FAIL: horizontal scroll (scrollWidth ${metrics.scrollWidth} > ${metrics.clientWidth})`)
      failed = true
    }

    if (width >= 1024 && !metrics.mediaFillsViewport) {
      console.error(
        `  FAIL: image should fill viewport width (${metrics.mediaWidth}px vs ${metrics.viewportWidth}px)`,
      )
      failed = true
    }

    if (width >= 1024 && metrics.mediaLeft !== 0) {
      console.error(`  FAIL: image should start at viewport left (got ${metrics.mediaLeft}px)`)
      failed = true
    }

    if (width >= 1024 && metrics.copyHasSolidBg) {
      console.error('  FAIL: text column should not have solid background (overlay layout)')
      failed = true
    }

    if (width >= 1024 && metrics.readableWidth < 320) {
      console.error(`  FAIL: text readable width too narrow (${metrics.readableWidth}px)`)
      failed = true
    }

    if (width >= 1024 && width < 1920 && metrics.logoLeft !== null) {
      if (Math.abs(metrics.textStart - metrics.logoLeft) > 4) {
        console.error(
          `  FAIL: hero text not aligned with logo (text ${metrics.textStart}px vs logo ${metrics.logoLeft}px)`,
        )
        failed = true
      }
    }
  }

  await browser.close()
  process.exit(failed ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
