import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyBuildsToPublic } from './copy-to-public.mjs'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const singleDomain = process.env.SINGLE_DOMAIN !== '0' && process.env.SINGLE_DOMAIN !== 'false'
const apiUrl = singleDomain
  ? '/api'
  : (process.env.VITE_API_URL ?? process.env.API_URL ?? 'https://api.example.com/api')
const adminBase = singleDomain ? '/admin/' : (process.env.VITE_ADMIN_BASE ?? '/')

function run(label, command, cwd, env = process.env) {
  console.log(`\n> ${label}`)
  execSync(command, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env,
  })
}

console.log(`Building production assets with VITE_API_URL=${apiUrl}`)
if (singleDomain) {
  console.log('Unified mode: website + admin + API on one domain')
}

for (const app of ['frontend', 'admin']) {
  const appDir = path.join(rootDir, app)
  const lockFile = path.join(appDir, 'package-lock.json')

  if (!fs.existsSync(lockFile)) {
    throw new Error(`Missing ${app}/package-lock.json`)
  }

  const installEnv = {
    ...process.env,
    npm_config_production: 'false',
  }

  const buildEnv = {
    ...process.env,
    VITE_API_URL: apiUrl,
    VITE_ASSETS_BASE_URL: process.env.VITE_ASSETS_BASE_URL
      ?? 'https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static',
    NODE_ENV: 'production',
  }

  if (app === 'admin') {
    buildEnv.VITE_ADMIN_BASE = adminBase
  }

  run(`${app}: install dependencies`, 'npm ci', appDir, installEnv)
  run(`${app}: build`, 'npm run build', appDir, buildEnv)
}

if (singleDomain) {
  copyBuildsToPublic()
}

console.log('\nProduction builds completed:')
if (singleDomain) {
  console.log(`- ${path.join(rootDir, 'backend', 'public')} (unified web root)`)
} else {
  console.log(`- ${path.join(rootDir, 'frontend', 'dist')}`)
  console.log(`- ${path.join(rootDir, 'admin', 'dist')}`)
}
