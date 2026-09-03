<script setup lang="ts">
import { ref } from 'vue'
import { mediaApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { MediaItem } from '@/types'
import Button from './Button.vue'
import Modal from './Modal.vue'
import LoadingState from './LoadingState.vue'

const model = defineModel<string | null>({ default: null })

withDefaults(
  defineProps<{
    label?: string
    hint?: string
  }>(),
  {},
)

const toastStore = useToastStore()
const pickerOpen = ref(false)
const uploading = ref(false)
const loadingMedia = ref(false)
const mediaItems = ref<MediaItem[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

async function openPicker(): Promise<void> {
  pickerOpen.value = true
  loadingMedia.value = true
  try {
    const data = await mediaApi.list({ per_page: 24 })
    mediaItems.value = data.items
  } catch (error) {
    toastStore.error(getErrorMessage(error, 'Failed to load media'))
  } finally {
    loadingMedia.value = false
  }
}

function selectImage(item: MediaItem): void {
  model.value = item.url
  pickerOpen.value = false
}

function clearImage(): void {
  model.value = null
}

async function onFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const item = await mediaApi.upload(file)
    model.value = item.url
    toastStore.success('Image uploaded')
  } catch (error) {
    toastStore.error(getErrorMessage(error, 'Upload failed'))
  } finally {
    uploading.value = false
    input.value = ''
  }
}
</script>

<template>
  <div>
    <label v-if="label" class="admin-label">{{ label }}</label>

    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div v-if="model" class="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <img :src="model" alt="Selected image" class="max-h-48 w-full object-cover" />
      </div>

      <div class="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" :loading="uploading" @click="fileInput?.click()">
          Upload
        </Button>
        <Button variant="outline" size="sm" @click="openPicker">Choose from library</Button>
        <Button v-if="model" variant="ghost" size="sm" @click="clearImage">Remove</Button>
      </div>

      <p v-if="hint" class="mt-2 text-xs text-slate-500">{{ hint }}</p>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    <Modal v-model="pickerOpen" title="Select image" size="lg" :show-footer="false">
      <LoadingState v-if="loadingMedia" size="sm" />
      <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button
          v-for="item in mediaItems"
          :key="item.uuid"
          type="button"
          class="overflow-hidden rounded-lg border border-slate-200 hover:border-primary-500 hover:ring-2 hover:ring-primary-500/20"
          @click="selectImage(item)"
        >
          <img
            :src="item.thumbnail_url || item.url"
            :alt="item.alt_text || item.original_filename"
            class="aspect-square w-full object-cover"
          />
        </button>
      </div>
    </Modal>
  </div>
</template>
