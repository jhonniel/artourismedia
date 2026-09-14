import { execSync } from 'node:child_process'
import { spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyBuildsToPublic } from './copy-to-public.mjs'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const backendDir = path.join(rootDir, 'backend')
const frontendDir = path.join(rootDir, 'frontend')
const adminDir = path.join(rootDir, 'admin')

function getLanAddresses() {
  const addresses = new Set()

  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const details of interfaces ?? []) {
      if (details.family !== 'IPv4' || details.internal) {
        continue
      }

      addresses.add(details.address)
    }
  }

  return [...addresses]
}

const lanAddresses = getLanAddresses()
const primaryLanAddress = lanAddresses[0] ?? null
const useHmr = process.env.DEV_HMR === '1'
const hmrPort = process.env.HMR_PORT ?? '5173'
const adminPort = process.env.ADMIN_PORT ?? '5174'
const serverPort = process.env.PORT ?? '8000'
const backendUrl = `http://127.0.0.1:${serverPort}`

function buildStatefulDomains(addresses) {
  const domains = new Set([
    'localhost',
    `localhost:${serverPort}`,
    '127.0.0.1',
    `127.0.0.1:${serverPort}`,
  ])

  if (useHmr) {
    domains.add('localhost:5173')
    domains.add('localhost:5174')
    domains.add('127.0.0.1:5173')
    domains.add('127.0.0.1:5174')
  }

  for (const address of addresses) {
    domains.add(address)
    domains.add(`${address}:${serverPort}`)
    if (useHmr) {
      domains.add(`${address}:5173`)
      domains.add(`${address}:5174`)
    }
  }

  return [...domains].join(',')
}

const sanctumStatefulDomains = buildStatefulDomains(lanAddresses)
const assetsBaseUrl =
  process.env.VITE_ASSETS_BASE_URL
  ?? 'https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static'

const children = []

function run(label, command, cwd, env = process.env) {
  console.log(`\n> ${label}`)
  execSync(command, { cwd, shell: true, stdio: 'inherit', env: { ...process.env, ...env } })
}

function start(label, command, cwd, env = {}, { critical = true } = {}) {
  console.log(`Starting ${label}...`)

  const child = spawn(command, {
    cwd,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      return
    }

    if (code && code !== 0) {
      console.error(`${label} exited with code ${code}`)
      if (critical) {
        shutdown(code)
      } else {
        console.warn(`${label} is optional for local website development — continuing without it.`)
      }
    }
  })

  children.push({ label, child })
  return child
}

function shutdown(code = 0) {
  for (const { child } of children) {
    if (!child.killed) {
      child.kill('SIGTERM')
    }
  }

  setTimeout(() => process.exit(code), 250)
}

async function waitForBackend(maxAttempts = 60, delayMs = 500) {
  const healthUrl = `${backendUrl}/up`

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(healthUrl)
      if (response.ok) {
        console.log('Backend ready.\n')
        return
      }
    } catch {
      // Backend still starting.
    }

    if (attempt === 1) {
      console.log(`Waiting for backend on port ${serverPort}...`)
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  throw new Error(`Backend did not start in time. Check ${healthUrl}`)
}

function printAddresses() {
  console.log('\nOpen one address:')
  console.log(`  Website  http://localhost:${serverPort}/`)
  console.log(`  Admin    http://localhost:${serverPort}/admin/`)
  console.log(`  API      http://localhost:${serverPort}/api/health`)

  if (lanAddresses.length > 0) {
    console.log('\nNetwork (same Wi‑Fi / LAN):')
    for (const address of lanAddresses) {
      console.log(`  Website  http://${address}:${serverPort}/`)
      console.log(`  Admin    http://${address}:${serverPort}/admin/`)
      console.log(`  API      http://${address}:${serverPort}/api/health`)
    }

    console.log('\nIf other devices cannot connect on Windows, run once as Administrator:')
    console.log('  powershell -ExecutionPolicy Bypass -File scripts/open-network-firewall.ps1')
  } else {
    console.log('\nNo LAN address detected. Wi‑Fi/Ethernet must be connected for network access.')
  }
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

console.log('Destination Studio — unified local development\n')

if (useHmr) {
  console.log('DEV_HMR=1: using split dev servers (5173 website + 8000 API).\n')

  start('backend', `php artisan serve --port=${serverPort} --host=0.0.0.0`, backendDir, {
    SANCTUM_STATEFUL_DOMAINS: sanctumStatefulDomains,
  })

  try {
    await waitForBackend()
  } catch (error) {
    console.error(error.message)
    shutdown(1)
  }

  const sharedFrontendEnv = {
    VITE_API_URL: '/api',
    VITE_DEV_PORT: hmrPort,
    VITE_ASSETS_BASE_URL: assetsBaseUrl,
    ...(primaryLanAddress ? { VITE_HMR_HOST: primaryLanAddress } : {}),
  }

  start('frontend', `npm run dev -- --port ${hmrPort} --host 0.0.0.0`, frontendDir, sharedFrontendEnv)

  start(
    'admin',
    `npm run dev -- --port ${adminPort} --host 0.0.0.0`,
    adminDir,
    {
      VITE_API_URL: '/api',
      VITE_ADMIN_BASE: '/admin/',
      VITE_ADMIN_DEV_PORT: adminPort,
      ...(primaryLanAddress ? { VITE_HMR_HOST: primaryLanAddress } : {}),
    },
    { critical: false },
  )

  console.log('\nOpen one address:')
  console.log(`  Website  http://localhost:${hmrPort}/`)
  console.log(`  Admin    http://localhost:${hmrPort}/admin/`)
  console.log(`  API      ${backendUrl}/api/health`)
} else {
  console.log('Building website + admin into backend/public...\n')

  run('frontend build', 'npm run build', frontendDir, {
    VITE_API_URL: '/api',
    VITE_ASSETS_BASE_URL: assetsBaseUrl,
  })

  run('admin build', 'npm run build', adminDir, {
    VITE_API_URL: '/api',
    VITE_ADMIN_BASE: '/admin/',
  })

  copyBuildsToPublic()

  start('backend', `php artisan serve --port=${serverPort} --host=0.0.0.0`, backendDir, {
    SANCTUM_STATEFUL_DOMAINS: sanctumStatefulDomains,
  })

  try {
    await waitForBackend()
  } catch (error) {
    console.error(error.message)
    shutdown(1)
  }

  start(
    'frontend watch',
    'npm run dev:watch',
    frontendDir,
    {
      COPY_TO_PUBLIC: '1',
      VITE_API_URL: '/api',
      VITE_ASSETS_BASE_URL: assetsBaseUrl,
    },
    { critical: false },
  )

  printAddresses()
  console.log('\nWebsite rebuilds on save — refresh the browser to see UI changes.')
}

console.log('\nPress Ctrl+C to stop all services.\n')
