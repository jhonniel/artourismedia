<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { mediaApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { formatDateTime, formatFileSize } from '@/utils/slug'
import type { MediaItem } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'

const toastStore = useToastStore()

const loading = ref(true)
const uploading = ref(false)
const items = ref<MediaItem[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const deleteTarget = ref<MediaItem | null>(null)
const deleteModalOpen = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

async function loadMedia(): Promise<void> {
  loading.value = true
  try {
    const data = await mediaApi.list({ page: page.value, search: search.value || undefined })
    items.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function onUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  uploading.value = true
  try {
    for (const file of files) {
      await mediaApi.upload(file)
    }
    toastStore.success('Upload complete')
    await loadMedia()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function copyUrl(item: MediaItem): Promise<void> {
  try {
    await navigator.clipboard.writeText(item.url)
    toastStore.success('URL copied to clipboard')
  } catch {
    toastStore.error('Failed to copy URL')
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await mediaApi.delete(deleteTarget.value.uuid)
    toastStore.success('Media deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadMedia()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadMedia)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">Media Library</h2>
        <p class="admin-page-subtitle">Upload and manage images and files</p>
      </div>
      <Button :loading="uploading" @click="fileInput?.click()">Upload Files</Button>
      <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="onUpload" />
    </div>

    <form class="mb-4 flex gap-2" @submit.prevent="loadMedia">
      <Input v-model="search" placeholder="Search media..." class="max-w-sm" />
      <Button type="submit" variant="outline">Search</Button>
    </form>

    <div v-if="loading" class="py-16 text-center text-sm text-slate-500">Loading media...</div>

    <div v-else-if="items.length === 0" class="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500">
      No media files yet. Upload your first file to get started.
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="item in items"
        :key="item.uuid"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="aspect-video bg-slate-100">
          <img
            v-if="item.mime_type.startsWith('image/')"
            :src="item.thumbnail_url || item.url"
            :alt="item.alt_text || item.original_filename"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
            {{ item.mime_type }}
          </div>
        </div>
        <div class="space-y-2 p-3">
          <p class="truncate text-sm font-medium text-slate-900">{{ item.original_filename }}</p>
          <p class="text-xs text-slate-500">
            {{ formatFileSize(item.size) }} · {{ formatDateTime(item.created_at) }}
          </p>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" class="flex-1" @click="copyUrl(item)">Copy URL</Button>
            <Button variant="ghost" size="sm" @click="deleteTarget = item; deleteModalOpen = true">Delete</Button>
          </div>
        </div>
      </div>
    </div>

    <Pagination v-model:page="page" :last-page="lastPage" :total="total" @update:page="loadMedia" />

    <Modal
      v-model="deleteModalOpen"
      title="Delete media?"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">Delete <strong>{{ deleteTarget?.original_filename }}</strong>?</p>
    </Modal>
  </div>
</template>
