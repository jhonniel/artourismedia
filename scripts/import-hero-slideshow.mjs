/**
 * Copy landing-page hero slideshow images into frontend/public/images/hero/.
 * Usage: node scripts/import-hero-slideshow.mjs [--source=path]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HERO_SLIDESHOW_SOURCES } from './hero-slideshow-manifest.mjs'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultSource = path.join(
  process.env.USERPROFILE ?? process.env.HOME ?? '',
  '.cursor',
  'projects',
  'c-Users-user-Documents-Projects-ART-WEBSITE',
  'assets',
)

const sourceArg = process.argv.find((arg) => arg.startsWith('--source='))
const sourceDir = path.resolve(sourceArg ? sourceArg.slice('--source='.length) : defaultSource)
const targetDir = path.join(rootDir, 'frontend', 'public', 'images', 'hero')

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`)
  process.exit(1)
}

fs.mkdirSync(targetDir, { recursive: true })

let copied = 0

for (const { slug, source } of HERO_SLIDESHOW_SOURCES) {
  const from = path.join(sourceDir, source)
  const to = path.join(targetDir, `${slug}.jpg`)

  if (!fs.existsSync(from)) {
    console.error(`Missing source image: ${from}`)
    process.exit(1)
  }

  fs.copyFileSync(from, to)
  copied++
  console.log(`  ${slug}.jpg`)
}

console.log(`\nImported ${copied} hero slideshow image(s) → ${targetDir}`)
