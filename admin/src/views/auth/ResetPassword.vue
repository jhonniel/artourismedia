<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const email = ref('')
const token = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)

onMounted(() => {
  email.value = (route.query.email as string) || ''
  token.value = (route.query.token as string) || ''
})

async function submit(): Promise<void> {
  error.value = ''
  loading.value = true
  try {
    await authApi.resetPassword({
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    success.value = true
    toastStore.success('Password reset successfully')
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    error.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-900 px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-white">Set new password</h1>
        <p class="mt-2 text-sm text-slate-400">Choose a strong password for your account</p>
      </div>

      <Card>
        <div v-if="success" class="text-center">
          <p class="text-sm text-slate-600">Your password has been updated. Redirecting to login...</p>
        </div>

        <form v-else class="space-y-4" @submit.prevent="submit">
          <Input v-model="email" label="Email" type="email" required />
          <Input v-model="password" label="New Password" type="password" required />
          <Input v-model="passwordConfirmation" label="Confirm Password" type="password" required />

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

          <Button type="submit" class="w-full" :loading="loading">Reset Password</Button>

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
