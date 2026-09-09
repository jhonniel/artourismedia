import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'backend', 'public')
const frontendDist = path.join(rootDir, 'frontend', 'dist')
const adminDist = path.join(rootDir, 'admin', 'dist')

const preserved = new Set([
  '.htaccess',
  'index.php',
  'robots.txt',
  'storage',
  'build',
  'fonts-manifest.dev.json',
  'hot',
])

const removableRoots = ['index.html', 'assets', 'admin', 'images', 'favicon.svg', 'favicon.png']

const bundledAssets = [
  {
    sourceDir: path.join(rootDir, 'frontend', 'public', 'images', 'brand'),
    targetDir: path.join(publicDir, 'images', 'brand'),
    names: ['artourismedia-logo.png', 'artourismedia-logo-dark.png'],
  },
  {
    sourceDir: path.join(rootDir, 'frontend', 'public', 'images', 'services'),
    targetDir: path.join(publicDir, 'images', 'services'),
    names: [
      'tourism-planning-development.png',
      'destination-branding-marketing.png',
      'mice-management.png',
      'thought-leadership-learning-development.png',
      'mindanao-connect.png',
    ],
  },
]

export function copyBrandAssetsToPublic() {
  for (const { sourceDir, targetDir, names } of bundledAssets) {
    fs.mkdirSync(targetDir, { recursive: true })

    for (const name of names) {
      const source = path.join(sourceDir, name)

      if (!fs.existsSync(source)) {
        throw new Error(`Missing bundled asset: ${source}`)
      }

      fs.copyFileSync(source, path.join(targetDir, name))
    }
  }
}

export function copyBuildsToPublic() {
  if (!fs.existsSync(frontendDist)) {
    throw new Error('Missing frontend/dist. Run the production build first.')
  }

  if (!fs.existsSync(adminDist)) {
    throw new Error('Missing admin/dist. Run the production build first.')
  }

  fs.mkdirSync(publicDir, { recursive: true })

  for (const name of removableRoots) {
    const target = path.join(publicDir, name)
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true })
    }
  }

  for (const entry of fs.readdirSync(frontendDist)) {
    if (preserved.has(entry) || entry === 'images') {
      continue
    }

    fs.cpSync(path.join(frontendDist, entry), path.join(publicDir, entry), { recursive: true })
  }

  fs.cpSync(adminDist, path.join(publicDir, 'admin'), { recursive: true })

  copyBrandAssetsToPublic()

  console.log('\nUnified web root ready:')
  console.log(`- ${publicDir}`)
  console.log('  /           public website')
  console.log('  /admin/     admin panel')
  console.log('  /api/       Laravel API')
}
