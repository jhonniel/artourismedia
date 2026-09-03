import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export type UserRole = 'admin' | 'editor' | 'author'

export function usePermissions() {
  const authStore = useAuthStore()

  const role = computed(() => authStore.user?.role as UserRole | undefined)

  const isAdmin = computed(() => role.value === 'admin')
  const isEditor = computed(() => role.value === 'editor')
  const isAuthor = computed(() => role.value === 'author')

  const canManageSettings = computed(() => isAdmin.value)
  const canManageUsers = computed(() => isAdmin.value)
  const canManageContent = computed(() => isAdmin.value || isEditor.value)
  const canManagePosts = computed(() => !!role.value)
  const canManageMedia = computed(() => !!role.value)

  function hasRole(...roles: UserRole[]): boolean {
    return !!role.value && roles.includes(role.value)
  }

  return {
    role,
    isAdmin,
    isEditor,
    isAuthor,
    canManageSettings,
    canManageUsers,
    canManageContent,
    canManagePosts,
    canManageMedia,
    hasRole,
  }
}
