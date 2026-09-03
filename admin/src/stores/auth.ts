import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import { clearAuthToken, getAuthToken, getErrorMessage, setAuthToken } from '@/api/client'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!getAuthToken())
  const role = computed(() => user.value?.role ?? null)
  const isAdmin = computed(() => role.value === 'admin')
  const isEditor = computed(() => role.value === 'editor')
  const isAuthor = computed(() => role.value === 'author')

  async function initialize(): Promise<void> {
    if (initialized.value) return

    const token = getAuthToken()
    if (!token) {
      initialized.value = true
      return
    }

    try {
      user.value = await authApi.me()
    } catch {
      clearAuthToken()
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    try {
      const data = await authApi.login(email, password)
      setAuthToken(data.token)
      user.value = data.user
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout API errors and clear local session anyway.
    } finally {
      clearAuthToken()
      user.value = null
    }
  }

  async function forgotPassword(email: string): Promise<void> {
    loading.value = true
    try {
      await authApi.forgotPassword(email)
    } finally {
      loading.value = false
    }
  }

  function getLoginError(error: unknown): string {
    return getErrorMessage(error, 'Invalid email or password')
  }

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    role,
    isAdmin,
    isEditor,
    isAuthor,
    initialize,
    login,
    logout,
    forgotPassword,
    getLoginError,
  }
})
