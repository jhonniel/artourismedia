<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function submit(): Promise<void> {
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    toastStore.success('Welcome back!')
    router.push('/')
  } catch (err) {
    error.value = authStore.getLoginError(err)
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-900 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-2xl font-bold text-white">
          A
        </div>
        <h1 class="text-2xl font-semibold text-white">ART CMS Admin</h1>
        <p class="mt-2 text-sm text-slate-400">Sign in to manage your website content</p>
      </div>

      <Card>
        <form class="space-y-4" @submit.prevent="submit">
          <Input
            id="email"
            v-model="email"
            label="Email"
            type="email"
            placeholder="admin@example.com"
            required
          />
          <Input
            id="password"
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

          <Button type="submit" class="w-full" :loading="authStore.loading">
            Sign in
          </Button>

          <div class="text-center">
            <RouterLink to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </RouterLink>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>
