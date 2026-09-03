import { spawn } from 'node:child_process'

import os from 'node:os'

import path from 'node:path'

import { fileURLToPath } from 'node:url'



const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const backendDir = path.join(rootDir, 'backend')

const frontendDir = path.join(rootDir, 'frontend')

const adminDir = path.join(rootDir, 'admin')



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



const lanAddresses = getLanAddresses()

const devPort = process.env.PORT ?? '5173'



const children = []



function start(label, command, cwd, env = {}) {

  console.log(`Starting ${label}...`)



  const child = spawn(command, {

    cwd,

    shell: true,

    stdio: 'inherit',

    env: { ...process.env, ...env },

  })



  child.on('exit', (code, signal) => {

    if (signal) {

      return

    }



    if (code && code !== 0) {

      console.error(`${label} exited with code ${code}`)

      shutdown(code)

    }

  })



  children.push({ label, child })

  return child

}



function shutdown(code = 0) {

  for (const { child } of children) {

    if (!child.killed) {

      child.kill('SIGTERM')

    }

  }



  setTimeout(() => process.exit(code), 250)

}



process.on('SIGINT', () => shutdown(0))

process.on('SIGTERM', () => shutdown(0))



console.log('Destination Studio — unified local development\n')



start('backend', 'php artisan serve --port=8000 --host=0.0.0.0', backendDir)

start('frontend', `npm run dev -- --port ${devPort} --host 0.0.0.0`, frontendDir, {

  VITE_API_URL: '/api',

})

start('admin', 'npm run dev -- --port 5174 --host 0.0.0.0', adminDir, {

  VITE_API_URL: '/api',

  VITE_ADMIN_BASE: '/admin/',

})



console.log('\nOpen one address:')

console.log(`  Website  http://localhost:${devPort}/`)

console.log(`  Admin    http://localhost:${devPort}/admin/`)

console.log(`  API      http://localhost:8000/api/health`)



if (lanAddresses.length > 0) {

  console.log('\nNetwork (same Wi‑Fi):')

  for (const address of lanAddresses) {

    console.log(`  Website  http://${address}:${devPort}/`)

    console.log(`  Admin    http://${address}:${devPort}/admin/`)

  }

}



console.log('\nProduction-like local server after build: npm run start')

console.log('Press Ctrl+C to stop all services.\n')

