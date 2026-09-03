import '@/polyfills/crypto-random-uuid'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { ensureCsrfCookie } from '@/api/client'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

void ensureCsrfCookie().catch(() => {
  // Login and other mutating requests will fetch the cookie when needed.
})
