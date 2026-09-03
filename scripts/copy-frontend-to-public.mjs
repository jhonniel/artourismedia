import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(rootDir, 'backend', 'public')
const frontendDist = path.join(rootDir, 'frontend', 'dist')

const preserved = new Set([
  '.htaccess',
  'index.php',
  'robots.txt',
  'storage',
  'build',
  'fonts-manifest.dev.json',
  'hot',
  'admin',
])

const removableRoots = ['index.html', 'assets', 'images', 'favicon.svg', 'favicon.png']

if (!fs.existsSync(frontendDist)) {
  console.error('Missing frontend/dist. Run npm run build in frontend/ first.')
  process.exit(1)
}

fs.mkdirSync(publicDir, { recursive: true })

for (const name of removableRoots) {
  const target = path.join(publicDir, name)
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true })
  }
}

for (const entry of fs.readdirSync(frontendDist)) {
  if (preserved.has(entry)) {
    continue
  }

  fs.cpSync(path.join(frontendDist, entry), path.join(publicDir, entry), { recursive: true })
}

console.log('Copied frontend/dist -> backend/public (website only)')
