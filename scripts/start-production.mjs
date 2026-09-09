import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

function getLanAddresses() {
  const addresses = new Set()

  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const details of interfaces ?? []) {
      if (details.family !== 'IPv4' || details.internal) {
        continue
      }

      addresses.add(details.address)
    }
  }

  return [...addresses]
}

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const backendDir = path.join(rootDir, 'backend')
const publicIndex = path.join(backendDir, 'public', 'index.html')
const port = process.env.PORT ?? '8000'
const host = process.env.HOST ?? '0.0.0.0'

if (!fs.existsSync(publicIndex)) {
  console.log('Built site not found. Running unified production build...\n')
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit', shell: true })
}

const lanAddresses = getLanAddresses()

console.log('Destination Studio — unified production server\n')
console.log(`  Website  http://localhost:${port}/`)
console.log(`  Admin    http://localhost:${port}/admin/`)
console.log(`  API      http://localhost:${port}/api/health`)

if (lanAddresses.length > 0) {
  console.log('\nNetwork (same Wi‑Fi):')
  for (const address of lanAddresses) {
    console.log(`  Website  http://${address}:${port}/`)
    console.log(`  Admin    http://${address}:${port}/admin/`)
  }
}

console.log('\nPress Ctrl+C to stop.\n')

const child = spawn(`php artisan serve --host=${host} --port=${port}`, {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit',
})

child.on('exit', (code) => process.exit(code ?? 0))

process.on('SIGINT', () => child.kill('SIGTERM'))
process.on('SIGTERM', () => child.kill('SIGTERM'))
