<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { activityLogsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { formatDateTime } from '@/utils/slug'
import type { ActivityLog } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Table from '@/components/ui/Table.vue'

const toastStore = useToastStore()

const loading = ref(true)
const logs = ref<ActivityLog[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const actionFilter = ref('')

async function loadLogs(): Promise<void> {
  loading.value = true
  try {
    const data = await activityLogsApi.list({
      page: page.value,
      action: actionFilter.value || undefined,
    })
    logs.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

onMounted(loadLogs)
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="admin-page-title">Activity Log</h2>
      <p class="admin-page-subtitle">Audit trail of admin actions</p>
    </div>

    <LoadingState v-if="loading && logs.length === 0" />

    <Table v-else :loading="loading" :empty="!loading && logs.length === 0">
      <template #toolbar>
        <form class="flex gap-2" @submit.prevent="page = 1; loadLogs()">
          <Input v-model="actionFilter" placeholder="Filter by action..." />
          <Button type="submit" variant="outline">Filter</Button>
        </form>
      </template>

      <template #head>
        <th>Action</th>
        <th>User</th>
        <th>IP</th>
        <th>Date</th>
      </template>

      <template #body>
        <tr v-for="log in logs" :key="log.uuid">
          <td class="font-mono text-sm">{{ log.action }}</td>
          <td>{{ log.user?.name || 'System' }}</td>
          <td class="text-slate-500">{{ log.ip_address || '—' }}</td>
          <td class="text-slate-500">{{ formatDateTime(log.created_at) }}</td>
        </tr>
      </template>

      <template #footer>
        <Pagination v-model:page="page" :last-page="lastPage" :total="total" @update:page="loadLogs" />
      </template>
    </Table>
  </div>
</template>
