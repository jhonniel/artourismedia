import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'backend', 'public')
const frontendDist = path.join(rootDir, 'frontend', 'dist')
const adminDist = path.join(rootDir, 'admin', 'dist')
const frontendImagesDir = path.join(rootDir, 'frontend', 'public', 'images')
const frontendDocumentsDir = path.join(rootDir, 'frontend', 'public', 'documents')

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

/** Copy the full static image tree for same-origin production fallback. */
export function copySiteImagesToPublic() {
  if (!fs.existsSync(frontendImagesDir)) {
    throw new Error(`Missing frontend images directory: ${frontendImagesDir}`)
  }

  const targetDir = path.join(publicDir, 'images')

  fs.mkdirSync(path.dirname(targetDir), { recursive: true })
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  fs.cpSync(frontendImagesDir, targetDir, { recursive: true })
}

/** Copy PDFs and other downloadable files for same-origin production fallback. */
export function copySiteDocumentsToPublic() {
  if (!fs.existsSync(frontendDocumentsDir)) {
    return
  }

  const targetDir = path.join(publicDir, 'documents')
  fs.mkdirSync(path.dirname(targetDir), { recursive: true })
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }
  fs.cpSync(frontendDocumentsDir, targetDir, { recursive: true })
}

/** @deprecated Use copySiteImagesToPublic */
export function copyBrandAssetsToPublic() {
  copySiteImagesToPublic()
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

  copySiteImagesToPublic()
  copySiteDocumentsToPublic()

  console.log('\nUnified web root ready:')
  console.log(`- ${publicDir}`)
  console.log('  /           public website')
  console.log('  /admin/     admin panel')
  console.log('  /api/       Laravel API')
  console.log('  /images/    full static image bundle')
  console.log('  /documents/ downloadable files (PDFs)')
}
