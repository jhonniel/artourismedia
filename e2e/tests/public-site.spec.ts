import { test, expect } from '@playwright/test'
import { FRONTEND_URL } from '../urls'

test.describe('Public website', () => {
  test('homepage loads hero content', async ({ page }) => {
    await page.goto(FRONTEND_URL)

    await expect(page).toHaveTitle(/Destination Studio/i)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Creating destinations people')
    await expect(page.getByRole('link', { name: /services/i }).first()).toBeVisible()
  })

  test('services page lists seeded services', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/services`)

    await expect(page.getByRole('heading', { name: /services/i }).first()).toBeVisible()
    await expect(page.getByText('Destination Branding')).toBeVisible()
  })

  test('contact page renders the inquiry form', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/contact`)

    await expect(page.getByRole('heading', { name: /contact/i }).first()).toBeVisible()
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
  })
})
