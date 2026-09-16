/**
 * Verify image/document paths returned by the public API exist under frontend/public.
 * Usage: node scripts/verify-api-assets.mjs [API_BASE]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'frontend', 'public')
const apiBase = (process.argv[2] ?? 'http://localhost:8000/api').replace(/\/$/, '')

const endpoints = [
  '/site',
  '/homepage',
  '/services',
  '/projects?per_page=100',
  '/posts?per_page=100',
  '/pages/about',
]

const assetPaths = new Set()

function collect(value) {
  if (!value || typeof value !== 'object') {
    return
  }

  if (Array.isArray(value)) {
    value.forEach(collect)
    return
  }

  for (const [key, entry] of Object.entries(value)) {
    if (
      typeof entry === 'string'
      && (key.includes('url') || key.includes('image') || key.includes('logo') || key.includes('favicon') || key.includes('portrait'))
    ) {
      const match = entry.match(/(\/(?:images|documents)\/[^?\s"'<>]+)/)
      if (match) {
        assetPaths.add(match[1])
      }
    }

    if (typeof entry === 'string' && entry.includes('/images/')) {
      for (const htmlMatch of entry.matchAll(/(\/(?:images|documents)\/[^?\s"'<>]+)/g)) {
        assetPaths.add(htmlMatch[1])
      }
    }

    collect(entry)
  }
}

for (const endpoint of endpoints) {
  const response = await fetch(`${apiBase}${endpoint}`)
  if (!response.ok) {
    console.error(`API ${endpoint} returned ${response.status}`)
    process.exit(1)
  }

  const json = await response.json()
  collect(json.data)
}

const missing = []
for (const assetPath of [...assetPaths].sort()) {
  const localPath = path.join(publicDir, assetPath.replace(/^\//, ''))
  if (!fs.existsSync(localPath)) {
    missing.push(assetPath)
  }
}

console.log(`Checked ${assetPaths.size} asset path(s) from public API.`)
if (missing.length) {
  console.error('Missing under frontend/public:')
  for (const assetPath of missing) {
    console.error(`  ${assetPath}`)
  }
  process.exit(1)
}

console.log('All API asset paths exist locally.')
