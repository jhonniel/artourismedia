<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { mindanaoConnectVideosApi, type MindanaoConnectVideo } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { extractYouTubeId, youtubeThumbnail } from '@/utils/youtube'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const importing = ref(false)
const items = ref<MindanaoConnectVideo[]>([])
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editing = ref<MindanaoConnectVideo | null>(null)
const deleteTarget = ref<MindanaoConnectVideo | null>(null)

const form = ref({
  youtube_url: '',
  title: '',
  description: '',
  is_active: true,
})

const previewId = computed(() => extractYouTubeId(form.value.youtube_url))
const previewThumbnail = computed(() => (previewId.value ? youtubeThumbnail(previewId.value) : null))

watch(
  () => form.value.youtube_url,
  () => {
    if (!form.value.title.trim() && previewId.value) {
      form.value.title = `YouTube Video ${previewId.value}`
    }
  },
)

function resetForm(): void {
  form.value = { youtube_url: '', title: '', description: '', is_active: true }
  editing.value = null
}

async function loadItems(): Promise<void> {
  loading.value = true
  try {
    items.value = await mindanaoConnectVideosApi.list()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

function openCreate(): void {
  resetForm()
  modalOpen.value = true
}

function openEdit(item: MindanaoConnectVideo): void {
  editing.value = item
  form.value = {
    youtube_url: item.youtube_url,
    title: item.title,
    description: item.description || '',
    is_active: item.is_active,
  }
  modalOpen.value = true
}

async function saveItem(): Promise<void> {
  if (!previewId.value) {
    toastStore.error('Enter a valid YouTube video URL')
    return
  }

  saving.value = true
  try {
    if (editing.value) {
      await mindanaoConnectVideosApi.update(editing.value.uuid, form.value)
      toastStore.success('Video updated')
    } else {
      await mindanaoConnectVideosApi.create(form.value)
      toastStore.success('Video added')
    }
    modalOpen.value = false
    await loadItems()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function moveItem(index: number, direction: -1 | 1): Promise<void> {
  const target = index + direction
  if (target < 0 || target >= items.value.length) return
  const list = [...items.value]
  ;[list[index], list[target]] = [list[target], list[index]]
  try {
    await mindanaoConnectVideosApi.reorder(list.map((item) => item.uuid))
    items.value = list
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await mindanaoConnectVideosApi.delete(deleteTarget.value.uuid)
    toastStore.success('Video deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadItems()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function importFromChannel(): Promise<void> {
  importing.value = true
  try {
    const result = await mindanaoConnectVideosApi.importFromChannel()
    toastStore.success(`Imported ${result.total} videos (${result.imported} new, ${result.updated} updated)`)
    await loadItems()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    importing.value = false
  }
}

onMounted(loadItems)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="admin-page-title">Mindanao CONNECT Videos</h2>
        <p class="admin-page-subtitle">
          Synced automatically from
          <a
            href="https://www.youtube.com/@mindanaoroadtripwithart9335"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary-600 hover:underline"
          >
            Mindanao Roadtrip with Art
          </a>
          twice daily. Use import to sync now.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" :loading="importing" @click="importFromChannel">
          Import from YouTube Channel
        </Button>
        <Button @click="openCreate">Add Video</Button>
      </div>
    </div>

    <Table :loading="loading" :empty="!loading && items.length === 0">
      <template #head>
        <th>Preview</th>
        <th>Title</th>
        <th>Views</th>
        <th>YouTube URL</th>
        <th>Active</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="(item, index) in items" :key="item.uuid">
        <td>
          <img
            :src="item.thumbnail_url"
            :alt="item.title"
            class="h-16 w-28 rounded-md border border-slate-200 object-cover"
          />
        </td>
        <td>
          <p class="font-medium">{{ item.title }}</p>
          <p v-if="item.description" class="mt-1 max-w-xs truncate text-xs text-slate-500">
            {{ item.description }}
          </p>
        </td>
        <td class="text-sm text-slate-600">{{ item.view_count?.toLocaleString() ?? '0' }}</td>
        <td class="max-w-xs truncate text-sm text-slate-600">{{ item.youtube_url }}</td>
        <td>
          <span
            class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
            :class="item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
          >
            {{ item.is_active ? 'Active' : 'Hidden' }}
          </span>
        </td>
        <td class="space-x-2 whitespace-nowrap text-right">
          <button class="text-primary-600 hover:underline" @click="moveItem(index, -1)">↑</button>
          <button class="text-primary-600 hover:underline" @click="moveItem(index, 1)">↓</button>
          <button class="text-primary-600 hover:underline" @click="openEdit(item)">Edit</button>
          <button
            class="text-red-600 hover:underline"
            @click="deleteTarget = item; deleteModalOpen = true"
          >
            Delete
          </button>
        </td>
      </tr>
    </Table>

    <Modal v-model="modalOpen" :title="editing ? 'Edit Video' : 'Add Video'" size="lg">
      <div class="space-y-4">
        <Input
          v-model="form.youtube_url"
          label="YouTube URL"
          placeholder="https://youtube.com/watch?v=..."
          required
        />

        <div v-if="previewThumbnail" class="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Thumbnail preview</p>
          <img :src="previewThumbnail" alt="YouTube thumbnail preview" class="aspect-video w-full max-w-md rounded-md object-cover" />
        </div>

        <Input v-model="form.title" label="Title" required />
        <Textarea v-model="form.description" label="Description (optional)" rows="3" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" class="rounded" />
          Show on Mindanao CONNECT service page
        </label>
      </div>
      <template #footer>
        <Button variant="secondary" @click="modalOpen = false">Cancel</Button>
        <Button :loading="saving" @click="saveItem">Save</Button>
      </template>
    </Modal>

    <Modal v-model="deleteModalOpen" title="Delete Video">
      <p>Delete "{{ deleteTarget?.title }}"?</p>
      <template #footer>
        <Button variant="secondary" @click="deleteModalOpen = false">Cancel</Button>
        <Button variant="danger" @click="confirmDelete">Delete</Button>
      </template>
    </Modal>
  </div>
</template>
