<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  toggleSidebar: []
}>()

const authStore = useAuthStore()
const router = useRouter()

async function logout(): Promise<void> {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          @click="emit('toggleSidebar')"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-semibold text-slate-900">{{ title }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden text-right sm:block">
          <p class="text-sm font-medium text-slate-900">{{ authStore.user?.name }}</p>
          <p class="text-xs text-slate-500">{{ authStore.user?.email }}</p>
        </div>
        <Button variant="outline" size="sm" @click="logout">Logout</Button>
      </div>
    </div>
  </header>
</template>
