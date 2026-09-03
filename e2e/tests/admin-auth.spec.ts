import { test, expect } from '@playwright/test'
import { ADMIN_URL } from '../urls'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@destinationstudio.test'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'password'

test.describe('Admin authentication', () => {
  test.describe.configure({ mode: 'serial' })

  test('login page renders', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`)

    await expect(page.getByRole('heading', { name: 'ART CMS Admin' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('invalid credentials show an error', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`)

    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText(/credentials are incorrect|Invalid email or password/i)).toBeVisible()
  })

  test('admin can sign in and reach dashboard', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`)

    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    await page.getByLabel('Password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL(`${ADMIN_URL}/`)
    await expect(page.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeVisible()
    await expect(page.getByText('Overview of your website content and activity')).toBeVisible()
  })
})
