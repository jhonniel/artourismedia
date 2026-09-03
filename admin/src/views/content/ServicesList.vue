<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { servicesApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useReorder } from '@/composables/useReorder'
import { useToastStore } from '@/stores/toast'
import type { Service } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Table from '@/components/ui/Table.vue'

const router = useRouter()
const toastStore = useToastStore()

const loading = ref(true)
const services = ref<Service[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const reorderMode = ref(false)
const deleteTarget = ref<Service | null>(null)
const deleteModalOpen = ref(false)

const { moveItem } = useReorder(services, servicesApi.reorder, toastStore)

const showPagination = computed(() => !reorderMode.value && lastPage.value > 1)

async function loadServices(): Promise<void> {
  loading.value = true
  try {
    const data = await servicesApi.list({
      page: reorderMode.value ? 1 : page.value,
      per_page: reorderMode.value ? 200 : 15,
      search: reorderMode.value ? undefined : search.value || undefined,
    })
    services.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

function toggleReorderMode(): void {
  reorderMode.value = !reorderMode.value
  page.value = 1
  loadServices()
}

function openDelete(service: Service): void {
  deleteTarget.value = service
  deleteModalOpen.value = true
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await servicesApi.delete(deleteTarget.value.uuid)
    toastStore.success('Service deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadServices()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

watch(reorderMode, () => {
  if (reorderMode.value) search.value = ''
})

onMounted(loadServices)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">Services</h2>
        <p class="admin-page-subtitle">Manage service offerings</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="toggleReorderMode">
          {{ reorderMode ? 'Done Reordering' : 'Reorder' }}
        </Button>
        <Button @click="router.push('/content/services/create')">New Service</Button>
      </div>
    </div>

    <Table :loading="loading" :empty="!loading && services.length === 0">
      <template v-if="!reorderMode" #toolbar>
        <form class="flex gap-2" @submit.prevent="loadServices">
          <Input v-model="search" placeholder="Search services..." />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </template>

      <template #head>
        <th v-if="reorderMode" class="w-16">Order</th>
        <th>Title</th>
        <th>Category</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="(service, index) in services" :key="service.uuid">
        <td v-if="reorderMode">
          <div class="flex gap-1">
            <Button variant="ghost" size="sm" :disabled="index === 0" @click="moveItem(index, -1)">↑</Button>
            <Button variant="ghost" size="sm" :disabled="index === services.length - 1" @click="moveItem(index, 1)">↓</Button>
          </div>
        </td>
        <td>
          <p class="font-medium">{{ service.title }}</p>
          <p class="text-xs text-slate-500">{{ service.slug }}</p>
        </td>
        <td>{{ service.category || '—' }}</td>
        <td>{{ service.is_active ? 'Active' : 'Inactive' }}</td>
        <td class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm" @click="router.push(`/content/services/${service.uuid}/edit`)">
              Edit
            </Button>
            <Button variant="ghost" size="sm" @click="openDelete(service)">Delete</Button>
          </div>
        </td>
      </tr>
    </Table>

    <Pagination v-if="showPagination" v-model:page="page" :last-page="lastPage" :total="total" @update:page="loadServices" />

    <Modal
      v-model="deleteModalOpen"
      title="Delete service?"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">Delete <strong>{{ deleteTarget?.title }}</strong>?</p>
    </Modal>
  </div>
</template>
