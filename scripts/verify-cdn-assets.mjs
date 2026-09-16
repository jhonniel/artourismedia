/**
 * HEAD-check uploaded static assets on DigitalOcean Spaces.
 * Usage: node scripts/verify-cdn-assets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const env = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

function shouldSkip(relative) {
  const name = path.basename(relative)
  const dir = path.dirname(relative).replace(/\\/g, '/')
  if (name.startsWith('_preview_')) return true
  if (/mockup|reference|user-reference/i.test(name)) return true
  if (dir === 'hero' || dir.endsWith('/hero')) {
    if (/^hero-slide-\d+\.jpg$/i.test(name)) return true
    if (/^hero-slideshow-\d+\.jpg$/i.test(name)) return true
    if (/^hero-slideshow-\d{2}-.+\.jpg$/i.test(name)) return false
    if (/^hero-(beach|composite|person|art|blob|scene|coastline|mockup|landing)/i.test(name)) {
      return true
    }
  }
  return false
}

function walkFiles(dir, base = dir) {
  const files = []
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(full, base))
    } else {
      files.push(path.relative(base, full))
    }
  }
  return files
}

const env = {
  ...loadEnv(path.join(rootDir, 'backend', '.env.example')),
  ...loadEnv(path.join(rootDir, 'backend', '.env')),
}

const baseUrl = (env.ASSETS_BASE_URL || '').replace(/\/$/, '')
if (!baseUrl) {
  console.error('ASSETS_BASE_URL is not set in backend/.env')
  process.exit(1)
}

const imagesDir = path.join(rootDir, 'frontend', 'public', 'images')
const documentsDir = path.join(rootDir, 'frontend', 'public', 'documents')

const paths = []
for (const relative of walkFiles(imagesDir)) {
  const normalized = relative.replace(/\\/g, '/')
  if (!shouldSkip(normalized)) {
    paths.push(`/images/${normalized}`)
  }
}
for (const relative of walkFiles(documentsDir)) {
  paths.push(`/documents/${relative.replace(/\\/g, '/')}`)
}
for (const favicon of ['favicon.png', 'favicon-192.png', 'apple-touch-icon.png']) {
  if (fs.existsSync(path.join(rootDir, 'frontend', 'public', favicon))) {
    paths.push(`/${favicon}`)
  }
}

let failed = 0
for (const assetPath of paths.sort()) {
  const url = `${baseUrl}${assetPath}`
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (!response.ok) {
      console.error(`FAIL ${response.status} ${url}`)
      failed++
    }
  } catch (error) {
    console.error(`FAIL ${url} (${error.message})`)
    failed++
  }
}

console.log(`Checked ${paths.length} CDN asset(s).`)
if (failed) {
  console.error(`${failed} missing or unreachable on CDN. Run npm run assets:upload.`)
  process.exit(1)
}
console.log('All CDN assets responded OK.')
