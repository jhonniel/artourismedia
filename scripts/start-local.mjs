import { spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
const devPort = process.env.PORT ?? '5173'
const adminPort = process.env.ADMIN_PORT ?? '5174'
const backendUrl = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

function buildStatefulDomains(addresses) {
  const domains = new Set([
    'localhost',
    'localhost:5173',
    'localhost:5174',
    '127.0.0.1',
    '127.0.0.1:5173',
    '127.0.0.1:5174',
    '127.0.0.1:8000',
  ])

  for (const address of addresses) {
    domains.add(address)
    domains.add(`${address}:5173`)
    domains.add(`${address}:5174`)
    domains.add(`${address}:8000`)
  }

  return [...domains].join(',')
}

const sanctumStatefulDomains = buildStatefulDomains(lanAddresses)

const children = []

function start(label, command, cwd, env = {}) {
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
      shutdown(code)
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
      console.log('Waiting for backend on port 8000...')
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  throw new Error(`Backend did not start in time. Check ${healthUrl}`)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

console.log('Destination Studio — unified local development\n')

start('backend', 'php artisan serve --port=8000 --host=0.0.0.0', backendDir, {
  SANCTUM_STATEFUL_DOMAINS: sanctumStatefulDomains,
})

try {
  await waitForBackend()
} catch (error) {
  console.error(error.message)
  shutdown(1)
}

const assetsBaseUrl =
  process.env.VITE_ASSETS_BASE_URL
  ?? 'https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static'

const sharedFrontendEnv = {
  VITE_API_URL: '/api',
  VITE_DEV_PORT: devPort,
  VITE_ASSETS_BASE_URL: assetsBaseUrl,
  ...(primaryLanAddress ? { VITE_HMR_HOST: primaryLanAddress } : {}),
}

start('frontend', `npm run dev -- --port ${devPort} --host 0.0.0.0`, frontendDir, sharedFrontendEnv)

start('admin', `npm run dev -- --port ${adminPort} --host 0.0.0.0`, adminDir, {
  VITE_API_URL: '/api',
  VITE_ADMIN_BASE: '/admin/',
  VITE_ADMIN_DEV_PORT: adminPort,
  ...(primaryLanAddress ? { VITE_HMR_HOST: primaryLanAddress } : {}),
})

console.log('\nOpen one address:')
console.log(`  Website  http://localhost:${devPort}/`)
console.log(`  Admin    http://localhost:${devPort}/admin/`)
console.log(`  API      ${backendUrl}/api/health`)

if (lanAddresses.length > 0) {
  console.log('\nNetwork (same Wi‑Fi / LAN):')
  for (const address of lanAddresses) {
    console.log(`  Website  http://${address}:${devPort}/`)
    console.log(`  Admin    http://${address}:${devPort}/admin/`)
    console.log(`  API      http://${address}:8000/api/health`)
  }

  console.log('\nIf other devices cannot connect on Windows, run once as Administrator:')
  console.log('  powershell -ExecutionPolicy Bypass -File scripts/open-network-firewall.ps1')
} else {
  console.log('\nNo LAN address detected. Wi‑Fi/Ethernet must be connected for network access.')
}

console.log('\nProduction-like local server after build: npm run start')
console.log('Press Ctrl+C to stop all services.\n')
