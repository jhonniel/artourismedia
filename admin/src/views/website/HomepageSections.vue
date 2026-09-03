<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { homepageApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { HomepageSection } from '@/types'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import Modal from '@/components/ui/Modal.vue'
import HomepageSectionEditor from '@/components/website/HomepageSectionEditor.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const sections = ref<HomepageSection[]>([])
const editModalOpen = ref(false)
const editing = ref<HomepageSection | null>(null)
const editContent = ref<Record<string, unknown>>({})

async function loadSections(): Promise<void> {
  loading.value = true
  try {
    sections.value = await homepageApi.list()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function toggleActive(section: HomepageSection): Promise<void> {
  try {
    await homepageApi.update(section.uuid, { is_active: !section.is_active })
    section.is_active = !section.is_active
    toastStore.success('Section updated')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function moveSection(index: number, direction: -1 | 1): Promise<void> {
  const target = index + direction
  if (target < 0 || target >= sections.value.length) return

  const items = [...sections.value]
  ;[items[index], items[target]] = [items[target], items[index]]

  try {
    await homepageApi.reorder(items.map((s) => s.uuid))
    sections.value = items
    toastStore.success('Order updated')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

function openEdit(section: HomepageSection): void {
  editing.value = { ...section }
  editContent.value = { ...(section.content || {}) }
  editModalOpen.value = true
}

async function saveSection(): Promise<void> {
  if (!editing.value) return
  saving.value = true
  try {
    await homepageApi.update(editing.value.uuid, {
      title: editing.value.title,
      content: editContent.value,
    })
    toastStore.success('Section content saved')
    editModalOpen.value = false
    await loadSections()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

onMounted(loadSections)
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="admin-page-title">Homepage Sections</h2>
      <p class="admin-page-subtitle">Enable, reorder, and configure homepage blocks</p>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="space-y-4">
      <Card v-for="(section, index) in sections" :key="section.uuid">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="font-semibold text-slate-900">{{ section.title || section.type }}</h3>
              <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{{ section.type }}</span>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="section.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ section.is_active ? 'Active' : 'Disabled' }}
              </span>
            </div>
            <p class="mt-1 text-sm text-slate-500">Order: {{ section.sort_order + 1 }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" :disabled="index === 0" @click="moveSection(index, -1)">Move Up</Button>
            <Button variant="outline" size="sm" :disabled="index === sections.length - 1" @click="moveSection(index, 1)">Move Down</Button>
            <Button variant="outline" size="sm" @click="toggleActive(section)">
              {{ section.is_active ? 'Disable' : 'Enable' }}
            </Button>
            <Button size="sm" @click="openEdit(section)">Edit Content</Button>
          </div>
        </div>
      </Card>
    </div>

    <Modal v-model="editModalOpen" title="Edit Section Content" size="lg" :loading="saving" @confirm="saveSection">
      <div v-if="editing" class="space-y-4">
        <Input v-model="editing.title" label="Section Title" />
        <HomepageSectionEditor
          :section="editing"
          @update:content="editContent = $event"
        />
      </div>
    </Modal>
  </div>
</template>
