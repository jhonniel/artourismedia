/**
 * Verify referenced /images/ and /documents/ paths exist under frontend/public.
 * Usage: node scripts/verify-static-assets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'frontend', 'public')
const scanRoots = [
  path.join(rootDir, 'frontend', 'src'),
  path.join(rootDir, 'backend', 'database'),
  path.join(rootDir, 'backend', 'app'),
]

const assetPattern = /\/(?:images|documents)\/[a-zA-Z0-9_./%-]+/g

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'vendor') continue
      walkFiles(full, acc)
    } else if (/\.(tsx?|vue|php|json|css|md|mjs|js)$/i.test(entry.name)) {
      acc.push(full)
    }
  }
  return acc
}

function normalizeRef(raw) {
  let ref = raw.split(/["'\s<>]/)[0]
  ref = ref.replace(/&amp;/g, '&')
  const withoutQuery = ref.split('?')[0]
  if (withoutQuery.includes('...') || withoutQuery.endsWith('/')) {
    return null
  }
  return withoutQuery
}

const refs = new Set()
for (const root of scanRoots) {
  for (const file of walkFiles(root)) {
    const text = fs.readFileSync(file, 'utf8')
    for (const match of text.matchAll(assetPattern)) {
      const normalized = normalizeRef(match[0])
      if (normalized) refs.add(normalized)
    }
  }
}

const missing = []
const present = []

for (const ref of [...refs].sort()) {
  const localPath = path.join(publicDir, ref.replace(/^\//, ''))
  if (fs.existsSync(localPath)) {
    present.push(ref)
  } else {
    missing.push(ref)
  }
}

console.log(`Checked ${refs.size} unique asset reference(s).`)
console.log(`Present: ${present.length}`)

if (missing.length) {
  console.error(`Missing ${missing.length} file(s):`)
  for (const ref of missing) {
    console.error(`  ${ref}`)
  }
  process.exit(1)
}

console.log('All referenced static assets exist locally.')
