import { test, expect } from '@playwright/test'
import { API_URL } from '../urls'

test.describe('Public API smoke', () => {
  test('health endpoint reports ok', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`)
    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.status).toBe('ok')
    expect(body.data.checks.database.status).toBe('ok')
  })

  test('site settings are available', async ({ request }) => {
    const response = await request.get(`${API_URL}/site`)
    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.settings.site_name).toBeTruthy()
  })

  test('homepage sections are available', async ({ request }) => {
    const response = await request.get(`${API_URL}/homepage`)
    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data.sections)).toBe(true)
    expect(body.data.sections.length).toBeGreaterThan(0)
  })

  test('services list is available', async ({ request }) => {
    const response = await request.get(`${API_URL}/services`)
    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThan(0)
  })
})
