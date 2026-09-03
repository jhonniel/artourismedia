/**
 * Full production deploy package — Laravel API + built UI (dynamic site).
 * Output: dist/web-deploy.zip
 *
 * Usage: node scripts/build-deploy.mjs
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyBuildsToPublic } from './copy-to-public.mjs'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const backendDir = path.join(rootDir, 'backend')
const distDir = path.join(rootDir, 'dist')
const stageDir = path.join(distDir, '.stage-backend')

const backendExcludeDirs = new Set([
  'vendor',
  'node_modules',
  '.phpunit.cache',
])

const backendExcludeFiles = new Set([
  '.env',
  '.env.local',
])

function shouldSkip(relPath) {
  const parts = relPath.split(/[/\\]/)

  if (parts.some((part) => backendExcludeDirs.has(part))) {
    return true
  }

  const base = parts[parts.length - 1]
  if (backendExcludeFiles.has(base)) {
    return true
  }

  // Symlinks recreated on server via php artisan storage:link
  if (relPath === `public${path.sep}storage` || relPath.endsWith(`${path.sep}public${path.sep}storage`)) {
    return true
  }

  if (base === 'hot') {
    return true
  }

  // Static images are served from DigitalOcean Spaces — not bundled in deploy.
  if (parts.includes('public') && parts.includes('images')) {
    return true
  }

  if (relPath.includes('storage' + path.sep + 'logs')) {
    return true
  }

  if (relPath.includes(path.join('storage', 'framework', 'cache'))) {
    return true
  }

  if (relPath.includes(path.join('storage', 'framework', 'sessions'))) {
    return true
  }

  if (relPath.includes(path.join('storage', 'framework', 'views'))) {
    return true
  }

  if (relPath.endsWith('.sqlite')) {
    return true
  }

  return false
}

function copyBackend(src, dest, relative = '') {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const rel = relative ? `${relative}${path.sep}${entry.name}` : entry.name
    if (shouldSkip(rel)) {
      continue
    }

    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      fs.mkdirSync(to, { recursive: true })
      copyBackend(from, to, rel)
    } else if (entry.isSymbolicLink()) {
      continue
    } else {
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to)
    }
  }
}

function run(label, command, cwd, env = process.env) {
  console.log(`\n> ${label}`)
  execSync(command, { cwd, stdio: 'inherit', shell: true, env })
}

console.log('Building full deploy package (dynamic API + UI)...')

for (const app of ['frontend', 'admin']) {
  const appDir = path.join(rootDir, app)
  const buildEnv = {
    ...process.env,
    VITE_API_URL: '/api',
    VITE_ASSETS_BASE_URL: process.env.VITE_ASSETS_BASE_URL
      ?? 'https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static',
    NODE_ENV: 'production',
  }
  if (app === 'admin') {
    buildEnv.VITE_ADMIN_BASE = '/admin/'
  }
  run(`${app}: build`, 'npm run build', appDir, buildEnv)
}

copyBuildsToPublic()

if (fs.existsSync(stageDir)) {
  fs.rmSync(stageDir, { recursive: true, force: true })
}
fs.mkdirSync(stageDir, { recursive: true })

console.log('\n> staging backend/')
copyBackend(backendDir, stageDir)

fs.mkdirSync(distDir, { recursive: true })
const zipPath = path.join(distDir, 'web-deploy.zip')
const staticZipPath = path.join(distDir, 'static-web.zip')

if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath, { force: true })
}

const isWin = process.platform === 'win32'
if (isWin) {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${stageDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
    { stdio: 'inherit' },
  )
} else {
  execSync(`cd "${stageDir}" && zip -r "${zipPath}" .`, { stdio: 'inherit' })
}

// Keep UI-only zip for quick frontend updates
if (fs.existsSync(staticZipPath)) {
  fs.rmSync(staticZipPath, { force: true })
}
const publicDir = path.join(backendDir, 'public')
if (isWin) {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${publicDir.replace(/'/g, "''")}\\*' -DestinationPath '${staticZipPath.replace(/'/g, "''")}' -Force"`,
    { stdio: 'inherit' },
  )
} else {
  execSync(`cd "${publicDir}" && zip -r "${staticZipPath}" .`, { stdio: 'inherit' })
}

fs.rmSync(stageDir, { recursive: true, force: true })

const sizeMb = (p) => `${(fs.statSync(p).size / 1024 / 1024).toFixed(2)} MB`
console.log('\nDeploy packages ready:')
console.log(`  ${zipPath} (${sizeMb(zipPath)}) — full dynamic app (Laravel + UI)`)
console.log(`  ${staticZipPath} (${sizeMb(staticZipPath)}) — UI-only update`)
