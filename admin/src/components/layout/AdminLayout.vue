<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import TopNav from './TopNav.vue'

const sidebarOpen = ref(false)
const route = useRoute()

const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')

function closeSidebar(): void {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Sidebar :open="sidebarOpen" @close="closeSidebar" />

    <div class="lg:pl-64">
      <TopNav
        :title="pageTitle"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <main class="px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
      @click="closeSidebar"
    />
  </div>
</template>
