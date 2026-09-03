<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { pagesApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { Page } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Table from '@/components/ui/Table.vue'

const router = useRouter()
const toastStore = useToastStore()

const loading = ref(true)
const pages = ref<Page[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const deleteTarget = ref<Page | null>(null)
const deleteModalOpen = ref(false)

async function loadPages(): Promise<void> {
  loading.value = true
  try {
    const data = await pagesApi.list({ page: page.value, search: search.value || undefined })
    pages.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await pagesApi.delete(deleteTarget.value.uuid)
    toastStore.success('Page deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadPages()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadPages)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">Pages</h2>
        <p class="admin-page-subtitle">Manage CMS pages like Privacy Policy and Terms</p>
      </div>
      <Button @click="router.push('/content/pages/create')">New Page</Button>
    </div>

    <Table :loading="loading" :empty="!loading && pages.length === 0">
      <template #toolbar>
        <form class="flex gap-2" @submit.prevent="loadPages">
          <Input v-model="search" placeholder="Search pages..." />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </template>

      <template #head>
        <th>Title</th>
        <th>Slug</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <template #body>
        <tr v-for="item in pages" :key="item.uuid">
          <td class="font-medium">{{ item.title }}</td>
          <td class="text-slate-500">/{{ item.slug }}</td>
          <td>
            <span
              class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
              :class="item.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
            >
              {{ item.is_published ? 'Published' : 'Draft' }}
            </span>
          </td>
          <td class="text-right">
            <Button variant="ghost" size="sm" @click="router.push(`/content/pages/${item.uuid}/edit`)">
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="text-red-600"
              @click="deleteTarget = item; deleteModalOpen = true"
            >
              Delete
            </Button>
          </td>
        </tr>
      </template>

      <template #footer>
        <Pagination
          v-model:page="page"
          :last-page="lastPage"
          :total="total"
          @update:page="loadPages"
        />
      </template>
    </Table>

    <Modal v-model:open="deleteModalOpen" title="Delete Page" @confirm="confirmDelete">
      <p>Delete <strong>{{ deleteTarget?.title }}</strong>? This cannot be undone.</p>
    </Modal>
  </div>
</template>
