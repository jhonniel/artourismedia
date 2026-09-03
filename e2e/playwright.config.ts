import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import { API_BASE } from './urls'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const apiUrl = `${API_BASE}/api`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 60_000,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'php artisan serve --port=8891 --host=localhost',
      cwd: path.join(rootDir, 'backend'),
      url: `${apiUrl}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev -- --port 5175 --host localhost',
      cwd: path.join(rootDir, 'frontend'),
      url: 'http://localhost:5175',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_API_URL: apiUrl,
      },
    },
    {
      command: 'npm run dev -- --port 5176 --host localhost',
      cwd: path.join(rootDir, 'admin'),
      url: 'http://localhost:5176',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_API_URL: apiUrl,
      },
    },
  ],
})
