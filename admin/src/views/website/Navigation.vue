<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { navigationApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { NavigationItem } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const items = ref<NavigationItem[]>([])
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editing = ref<NavigationItem | null>(null)
const deleteTarget = ref<NavigationItem | null>(null)

const form = ref({
  label: '',
  url: '',
  target: '_self' as NavigationItem['target'],
  is_active: true,
  is_cta: false,
})

function resetForm(): void {
  form.value = { label: '', url: '', target: '_self', is_active: true, is_cta: false }
  editing.value = null
}

async function loadItems(): Promise<void> {
  loading.value = true
  try {
    items.value = await navigationApi.list()
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

function openEdit(item: NavigationItem): void {
  editing.value = item
  form.value = {
    label: item.label,
    url: item.url,
    target: item.target,
    is_active: item.is_active,
    is_cta: item.is_cta,
  }
  modalOpen.value = true
}

async function saveItem(): Promise<void> {
  saving.value = true
  try {
    if (editing.value) {
      await navigationApi.update(editing.value.uuid, form.value)
      toastStore.success('Navigation item updated')
    } else {
      await navigationApi.create(form.value)
      toastStore.success('Navigation item created')
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
    await navigationApi.reorder(list.map((i) => i.uuid))
    items.value = list
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await navigationApi.delete(deleteTarget.value.uuid)
    toastStore.success('Item deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadItems()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadItems)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="admin-page-title">Navigation</h2>
        <p class="admin-page-subtitle">Manage header menu links</p>
      </div>
      <Button @click="openCreate">Add Link</Button>
    </div>

    <Table :loading="loading" :empty="!loading && items.length === 0">
      <template #head>
        <th>Label</th>
        <th>URL</th>
        <th>CTA</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="(item, index) in items" :key="item.uuid">
        <td class="font-medium">{{ item.label }}</td>
        <td>{{ item.url }}</td>
        <td>{{ item.is_cta ? 'Yes' : 'No' }}</td>
        <td>{{ item.is_active ? 'Active' : 'Hidden' }}</td>
        <td class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm" :disabled="index === 0" @click="moveItem(index, -1)">↑</Button>
            <Button variant="ghost" size="sm" @click="openEdit(item)">Edit</Button>
            <Button variant="ghost" size="sm" @click="deleteTarget = item; deleteModalOpen = true">Delete</Button>
          </div>
        </td>
      </tr>
    </Table>

    <Modal v-model="modalOpen" :title="editing ? 'Edit Link' : 'Add Link'" :loading="saving" @confirm="saveItem">
      <div class="space-y-4">
        <Input v-model="form.label" label="Label" required />
        <Input v-model="form.url" label="URL" required />
        <div>
          <label class="admin-label">Target</label>
          <select v-model="form.target" class="admin-input">
            <option value="_self">Same tab</option>
            <option value="_blank">New tab</option>
          </select>
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_cta" type="checkbox" class="rounded border-slate-300 text-primary-600" />
          Primary CTA button
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" class="rounded border-slate-300 text-primary-600" />
          Active
        </label>
      </div>
    </Modal>

    <Modal
      v-model="deleteModalOpen"
      title="Delete link?"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">Delete <strong>{{ deleteTarget?.label }}</strong>?</p>
    </Modal>
  </div>
</template>
