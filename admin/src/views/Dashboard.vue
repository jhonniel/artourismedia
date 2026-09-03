<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dashboardApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { formatDateTime } from '@/utils/slug'
import type { DashboardData } from '@/types'
import Card from '@/components/ui/Card.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { RouterLink } from 'vue-router'

const toastStore = useToastStore()
const loading = ref(true)
const data = ref<DashboardData | null>(null)

const statCards = [
  { key: 'posts', label: 'Posts', color: 'bg-blue-500' },
  { key: 'projects', label: 'Projects', color: 'bg-indigo-500' },
  { key: 'services', label: 'Services', color: 'bg-violet-500' },
  { key: 'messages', label: 'Messages', color: 'bg-amber-500' },
  { key: 'subscribers', label: 'Subscribers', color: 'bg-emerald-500' },
] as const

onMounted(async () => {
  try {
    data.value = await dashboardApi.get()
  } catch (error) {
    toastStore.error(getErrorMessage(error, 'Failed to load dashboard'))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="admin-page-title">Dashboard</h2>
      <p class="admin-page-subtitle">Overview of your website content and activity</p>
    </div>

    <LoadingState v-if="loading" />

    <template v-else-if="data">
      <div class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card v-for="stat in statCards" :key="stat.key" class="!p-5">
          <div class="flex items-center gap-4">
            <div class="flex h-11 w-11 items-center justify-center rounded-lg text-white" :class="stat.color">
              <span class="text-lg font-bold">{{ data.stats[stat.key] }}</span>
            </div>
            <div>
              <p class="text-sm text-slate-500">{{ stat.label }}</p>
              <p class="text-2xl font-semibold text-slate-900">{{ data.stats[stat.key] }}</p>
            </div>
          </div>
        </Card>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Posts" subtitle="Latest blog entries">
          <ul v-if="data.recent_posts.length" class="divide-y divide-slate-100">
            <li v-for="post in data.recent_posts" :key="post.uuid" class="flex items-center justify-between py-3">
              <div>
                <p class="font-medium text-slate-900">{{ post.title }}</p>
                <p class="text-xs text-slate-500">{{ post.status }} · {{ formatDateTime(post.published_at) }}</p>
              </div>
              <RouterLink :to="`/content/posts/${post.uuid}/edit`" class="text-sm text-primary-600 hover:text-primary-700">
                Edit
              </RouterLink>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500">No posts yet</p>
        </Card>

        <Card title="Recent Projects" subtitle="Latest portfolio items">
          <ul v-if="data.recent_projects.length" class="divide-y divide-slate-100">
            <li v-for="project in data.recent_projects" :key="project.uuid" class="flex items-center justify-between py-3">
              <div>
                <p class="font-medium text-slate-900">{{ project.title }}</p>
                <p class="text-xs text-slate-500">{{ project.is_published ? 'Published' : 'Draft' }}</p>
              </div>
              <RouterLink :to="`/content/projects/${project.uuid}/edit`" class="text-sm text-primary-600 hover:text-primary-700">
                Edit
              </RouterLink>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500">No projects yet</p>
        </Card>

        <Card title="Recent Messages" subtitle="Latest contact submissions" class="lg:col-span-2">
          <ul v-if="data.recent_messages.length" class="divide-y divide-slate-100">
            <li v-for="message in data.recent_messages" :key="message.uuid" class="flex items-center justify-between py-3">
              <div>
                <p class="font-medium text-slate-900">{{ message.name }}</p>
                <p class="text-sm text-slate-600">{{ message.subject || message.email }}</p>
                <p class="text-xs text-slate-500">{{ formatDateTime(message.created_at) }}</p>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="message.read_at ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'"
              >
                {{ message.read_at ? 'Read' : 'New' }}
              </span>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500">No messages yet</p>
        </Card>
      </div>
    </template>
  </div>
</template>
