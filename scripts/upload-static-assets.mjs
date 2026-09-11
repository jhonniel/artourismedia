/**
 * Upload static site images to DigitalOcean Spaces.
 * Usage: node scripts/upload-static-assets.mjs [--dry-run]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(rootDir, 'frontend', 'public', 'images')
const dryRun = process.argv.includes('--dry-run')

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

function guessMime(ext) {
  switch (ext.toLowerCase()) {
    case '.svg': return 'image/svg+xml'
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    default: return 'application/octet-stream'
  }
}

function walkFiles(dir, base = dir) {
  const files = []
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

const prefix = (env.ASSETS_SPACES_PREFIX || 'static').replace(/^\/|\/$/g, '')
const root = (env.DIGITALOCEAN_SPACES_ROOT_PATH || '').replace(/^\/|\/$/g, '')

const client = new S3Client({
  region: env.DIGITALOCEAN_SPACES_REGION || 'sgp1',
  endpoint: env.DIGITALOCEAN_SPACES_ENDPOINT || 'https://sgp1.digitaloceanspaces.com',
  credentials: {
    accessKeyId: env.DIGITALOCEAN_SPACES_KEY,
    secretAccessKey: env.DIGITALOCEAN_SPACES_SECRET,
  },
  forcePathStyle: false,
})

const files = walkFiles(imagesDir)
let uploaded = 0
let skipped = 0

for (const relative of files.sort()) {
  const normalized = relative.replace(/\\/g, '/')
  if (shouldSkip(normalized)) {
    skipped++
    continue
  }

  const key = root ? `${root}/${prefix}/images/${normalized}` : `${prefix}/images/${normalized}`
  const localPath = path.join(imagesDir, relative)

  if (dryRun) {
    console.log(`  would upload: ${normalized} → ${key}`)
    uploaded++
    continue
  }

  await client.send(new PutObjectCommand({
    Bucket: env.DIGITALOCEAN_SPACES_BUCKET,
    Key: key,
    Body: fs.readFileSync(localPath),
    ACL: 'public-read',
    ContentType: guessMime(path.extname(relative)),
  }))

  console.log(`  uploaded: ${normalized}`)
  uploaded++
}

for (const faviconName of ['favicon.png', 'favicon-192.png', 'apple-touch-icon.png']) {
  const favicon = path.join(rootDir, 'frontend', 'public', faviconName)
  if (!fs.existsSync(favicon)) continue

  const key = root ? `${root}/${prefix}/${faviconName}` : `${prefix}/${faviconName}`
  if (dryRun) {
    console.log(`  would upload: ${faviconName} → ${key}`)
  } else {
    await client.send(new PutObjectCommand({
      Bucket: env.DIGITALOCEAN_SPACES_BUCKET,
      Key: key,
      Body: fs.readFileSync(favicon),
      ACL: 'public-read',
      ContentType: 'image/png',
    }))
    console.log(`  uploaded: ${faviconName}`)
  }
  uploaded++
}

const baseUrl = env.ASSETS_BASE_URL || ''
console.log('')
console.log(dryRun ? `Dry run: ${uploaded} file(s), ${skipped} skipped.` : `Uploaded ${uploaded} file(s), skipped ${skipped} mockup/unused file(s).`)
if (baseUrl) {
  console.log(`Assets base URL: ${baseUrl}`)
}
