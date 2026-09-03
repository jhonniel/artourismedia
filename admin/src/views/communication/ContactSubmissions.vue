<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { contactApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { formatDateTime } from '@/utils/slug'
import type { ContactSubmission } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Table from '@/components/ui/Table.vue'

const toastStore = useToastStore()

const loading = ref(true)
const bulkLoading = ref(false)
const submissions = ref<ContactSubmission[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const statusFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selected = ref<Set<string>>(new Set())
const selectedItem = ref<ContactSubmission | null>(null)
const detailOpen = ref(false)
const bulkModalOpen = ref(false)
const bulkAction = ref<'mark_read' | 'delete'>('mark_read')

const allSelected = computed(() => submissions.value.length > 0 && submissions.value.every((s) => selected.value.has(s.uuid)))
const selectedCount = computed(() => selected.value.size)

async function loadSubmissions(): Promise<void> {
  loading.value = true
  try {
    const data = await contactApi.list({
      page: page.value,
      search: search.value || undefined,
      status: statusFilter.value || undefined,
      date_from: dateFrom.value || undefined,
      date_to: dateTo.value || undefined,
    })
    submissions.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
    selected.value = new Set()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

function toggleAll(): void {
  if (allSelected.value) {
    selected.value = new Set()
  } else {
    selected.value = new Set(submissions.value.map((s) => s.uuid))
  }
}

function toggleOne(uuid: string): void {
  const next = new Set(selected.value)
  if (next.has(uuid)) next.delete(uuid)
  else next.add(uuid)
  selected.value = next
}

async function openDetail(submission: ContactSubmission): Promise<void> {
  selectedItem.value = submission
  detailOpen.value = true

  if (!submission.read_at) {
    try {
      const updated = await contactApi.markRead(submission.uuid)
      submission.read_at = updated.read_at
      submission.status = updated.status
    } catch (error) {
      toastStore.error(getErrorMessage(error))
    }
  }
}

function openBulk(action: typeof bulkAction.value): void {
  bulkAction.value = action
  bulkModalOpen.value = true
}

async function confirmBulk(): Promise<void> {
  bulkLoading.value = true
  try {
    const { count } = await contactApi.bulk({
      uuids: [...selected.value],
      action: bulkAction.value,
    })
    toastStore.success(`${count} message(s) updated`)
    bulkModalOpen.value = false
    await loadSubmissions()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    bulkLoading.value = false
  }
}

onMounted(loadSubmissions)

function onSearch(): void {
  page.value = 1
  loadSubmissions()
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="admin-page-title">Contact Submissions</h2>
      <p class="admin-page-subtitle">View and manage incoming messages</p>
    </div>

    <div
      v-if="selectedCount > 0"
      class="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3"
    >
      <span class="text-sm font-medium text-primary-900">{{ selectedCount }} selected</span>
      <Button size="sm" variant="outline" @click="openBulk('mark_read')">Mark Read</Button>
      <Button size="sm" variant="outline" class="text-red-600" @click="openBulk('delete')">Delete</Button>
    </div>

    <Table :loading="loading" :empty="!loading && submissions.length === 0">
      <template #toolbar>
        <form class="flex flex-wrap gap-2" @submit.prevent="onSearch">
          <Input v-model="search" placeholder="Search messages..." class="w-full sm:min-w-[200px] sm:max-w-xs" />
          <select v-model="statusFilter" class="admin-input w-auto">
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
          <Input v-model="dateFrom" type="date" label="" class="w-auto" />
          <Input v-model="dateTo" type="date" label="" class="w-auto" />
          <Button type="submit" variant="outline">Filter</Button>
        </form>
      </template>

      <template #head>
        <th class="w-10">
          <input type="checkbox" :checked="allSelected" class="rounded border-slate-300" @change="toggleAll" />
        </th>
        <th>Name</th>
        <th>Subject</th>
        <th>Date</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="submission in submissions" :key="submission.uuid">
        <td>
          <input
            type="checkbox"
            :checked="selected.has(submission.uuid)"
            class="rounded border-slate-300"
            @change="toggleOne(submission.uuid)"
          />
        </td>
        <td>
          <p class="font-medium">{{ submission.name }}</p>
          <p class="text-xs text-slate-500">{{ submission.email }}</p>
        </td>
        <td>{{ submission.subject || '—' }}</td>
        <td>{{ formatDateTime(submission.created_at) }}</td>
        <td>
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium"
            :class="submission.read_at ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'"
          >
            {{ submission.read_at ? 'Read' : 'New' }}
          </span>
        </td>
        <td class="text-right">
          <Button variant="ghost" size="sm" @click="openDetail(submission)">View</Button>
        </td>
      </tr>
    </Table>

    <Pagination v-model:page="page" :last-page="lastPage" :total="total" @update:page="loadSubmissions" />

    <Modal
      v-model="bulkModalOpen"
      title="Confirm bulk action"
      :loading="bulkLoading"
      confirm-variant="danger"
      @confirm="confirmBulk"
    >
      <p class="text-sm text-slate-600">
        Apply <strong>{{ bulkAction === 'mark_read' ? 'mark read' : 'delete' }}</strong> to {{ selectedCount }} message(s)?
      </p>
    </Modal>

    <Modal v-model="detailOpen" title="Message Details" :show-footer="false" size="lg">
      <div v-if="selectedItem" class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">From</p>
            <p class="font-medium">{{ selectedItem.name }}</p>
            <p class="text-sm text-slate-600">{{ selectedItem.email }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Received</p>
            <p>{{ formatDateTime(selectedItem.created_at) }}</p>
          </div>
        </div>
        <div v-if="selectedItem.company || selectedItem.phone" class="grid gap-4 sm:grid-cols-2">
          <div v-if="selectedItem.company">
            <p class="text-xs font-semibold uppercase text-slate-500">Company</p>
            <p>{{ selectedItem.company }}</p>
          </div>
          <div v-if="selectedItem.phone">
            <p class="text-xs font-semibold uppercase text-slate-500">Phone</p>
            <p>{{ selectedItem.phone }}</p>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">Subject</p>
          <p>{{ selectedItem.subject || '—' }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">Message</p>
          <p class="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">{{ selectedItem.message }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>
