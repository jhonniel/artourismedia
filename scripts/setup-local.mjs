import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const backendDir = path.join(rootDir, 'backend')
const envExamplePath = path.join(backendDir, '.env.example')
const envPath = path.join(backendDir, '.env')
const sqlitePath = path.join(backendDir, 'database', 'database.sqlite')

function run(command, cwd = rootDir) {
  execSync(command, { cwd, stdio: 'inherit', shell: true })
}

function patchEnvForLocalDev() {
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath)
  }

  let env = fs.readFileSync(envPath, 'utf8')

  const replacements = {
    APP_NAME: '"Destination Studio"',
    APP_ENV: 'local',
    APP_DEBUG: 'true',
    APP_URL: 'http://localhost:8000',
    DB_CONNECTION: 'sqlite',
    DB_DATABASE: 'database/database.sqlite',
    CACHE_STORE: 'array',
    SESSION_DRIVER: 'file',
    QUEUE_CONNECTION: 'sync',
    FILESYSTEM_DISK: 'spaces',
    FRONTEND_URL: 'http://localhost:5173',
    ADMIN_URL: 'http://localhost:5173/admin',
    SANCTUM_STATEFUL_DOMAINS: 'localhost,localhost:5173,127.0.0.1,127.0.0.1:5173,127.0.0.1:8000',
  }

  for (const [key, value] of Object.entries(replacements)) {
    const pattern = new RegExp(`^${key}=.*$`, 'm')
    if (pattern.test(env)) {
      env = env.replace(pattern, `${key}=${value}`)
    } else {
      env += `\n${key}=${value}`
    }
  }

  env = env
    .split('\n')
    .filter((line) => !/^DB_(HOST|PORT|USERNAME|PASSWORD)=$/.test(line))
    .join('\n')

  fs.writeFileSync(envPath, env.trim() + '\n')
}

console.log('Setting up Destination Studio for local development...\n')

patchEnvForLocalDev()

fs.mkdirSync(path.dirname(sqlitePath), { recursive: true })
if (!fs.existsSync(sqlitePath)) {
  fs.writeFileSync(sqlitePath, '')
}

run('composer install', backendDir)

const envContents = fs.readFileSync(envPath, 'utf8')
if (!/^APP_KEY=base64:.+/m.test(envContents)) {
  run('php artisan key:generate --force', backendDir)
}

run('php artisan migrate --seed --force', backendDir)
run('php artisan storage:link', backendDir)

run('npm install', path.join(rootDir, 'frontend'))
run('npm install', path.join(rootDir, 'admin'))

console.log('\nLocal setup complete.')
console.log('Start all apps with: npm run dev')
console.log('\nDefault admin login: admin@destinationstudio.test / password')
