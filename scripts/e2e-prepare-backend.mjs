import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const backendDir = path.join(rootDir, 'backend')
const envExamplePath = path.join(backendDir, '.env.example')
const envPath = path.join(backendDir, '.env')
const dbFile = path.join(backendDir, 'database', 'e2e.sqlite')

function run(command) {
  execSync(command, {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true,
  })
}

if (!fs.existsSync(envPath)) {
  fs.copyFileSync(envExamplePath, envPath)
}

let env = fs.readFileSync(envPath, 'utf8')

const replacements = {
  DB_CONNECTION: 'sqlite',
  DB_DATABASE: 'database/e2e.sqlite',
  DB_HOST: '',
  DB_PORT: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  CACHE_STORE: 'array',
  SESSION_DRIVER: 'file',
  QUEUE_CONNECTION: 'sync',
  APP_ENV: 'local',
  APP_DEBUG: 'true',
  FRONTEND_URL: 'http://localhost:5175',
  ADMIN_URL: 'http://localhost:5176',
}

for (const [key, value] of Object.entries(replacements)) {
  const pattern = new RegExp(`^${key}=.*$`, 'm')
  if (pattern.test(env)) {
    env = env.replace(pattern, `${key}=${value}`)
  } else {
    env += `\n${key}=${value}`
  }
}

fs.writeFileSync(envPath, env.trim() + '\n')
fs.mkdirSync(path.dirname(dbFile), { recursive: true })

if (fs.existsSync(dbFile)) {
  fs.unlinkSync(dbFile)
}

fs.writeFileSync(dbFile, '')

run('php artisan key:generate --force')
run('php artisan migrate:fresh --seed --force')

console.log('E2E backend prepared with SQLite database at database/e2e.sqlite')
