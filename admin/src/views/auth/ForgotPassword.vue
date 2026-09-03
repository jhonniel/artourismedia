<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()

const email = ref('')
const sent = ref(false)
const error = ref('')

async function submit(): Promise<void> {
  error.value = ''
  try {
    await authStore.forgotPassword(email.value)
    sent.value = true
    toastStore.success('Password reset link sent')
  } catch (err) {
    error.value = authStore.getLoginError(err)
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-900 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-white">Reset password</h1>
        <p class="mt-2 text-sm text-slate-400">We'll email you a reset link</p>
      </div>

      <Card>
        <div v-if="sent" class="text-center">
          <p class="text-sm text-slate-600">
            If an account exists for <strong>{{ email }}</strong>, you'll receive reset instructions shortly.
          </p>
          <RouterLink to="/login" class="mt-4 inline-block text-sm text-primary-600 hover:text-primary-700">
            Back to login
          </RouterLink>
        </div>

        <form v-else class="space-y-4" @submit.prevent="submit">
          <Input
            id="email"
            v-model="email"
            label="Email"
            type="email"
            placeholder="admin@example.com"
            required
          />

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

          <Button type="submit" class="w-full" :loading="authStore.loading">
            Send reset link
          </Button>

          <div class="text-center">
            <RouterLink to="/login" class="text-sm text-primary-600 hover:text-primary-700">
              Back to login
            </RouterLink>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>
