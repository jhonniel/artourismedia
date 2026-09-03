<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { trustStripApi, type TrustStripItem } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const items = ref<TrustStripItem[]>([])
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editing = ref<TrustStripItem | null>(null)
const deleteTarget = ref<TrustStripItem | null>(null)

const form = ref({
  title: '',
  description: '',
  icon: '',
  link: '',
  is_active: true,
})

function resetForm(): void {
  form.value = { title: '', description: '', icon: '', link: '', is_active: true }
  editing.value = null
}

async function loadItems(): Promise<void> {
  loading.value = true
  try {
    items.value = await trustStripApi.list()
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

function openEdit(item: TrustStripItem): void {
  editing.value = item
  form.value = {
    title: item.title,
    description: item.description || '',
    icon: item.icon || '',
    link: item.link || '',
    is_active: item.is_active,
  }
  modalOpen.value = true
}

async function saveItem(): Promise<void> {
  saving.value = true
  try {
    if (editing.value) {
      await trustStripApi.update(editing.value.uuid, form.value)
      toastStore.success('Trust strip item updated')
    } else {
      await trustStripApi.create(form.value)
      toastStore.success('Trust strip item created')
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
    await trustStripApi.reorder(list.map((i) => i.uuid))
    items.value = list
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await trustStripApi.delete(deleteTarget.value.uuid)
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
        <h2 class="admin-page-title">Trust Strip</h2>
        <p class="admin-page-subtitle">Partner categories shown below the hero section</p>
      </div>
      <Button @click="openCreate">Add Item</Button>
    </div>

    <Table :loading="loading" :columns="['Title', 'Description', 'Active', 'Actions']">
      <tr v-for="(item, index) in items" :key="item.uuid">
        <td class="font-medium">{{ item.title }}</td>
        <td class="text-slate-500">{{ item.description }}</td>
        <td>
          <span
            class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
            :class="item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
          >
            {{ item.is_active ? 'Active' : 'Hidden' }}
          </span>
        </td>
        <td class="space-x-2 whitespace-nowrap">
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

    <Modal v-model="modalOpen" :title="editing ? 'Edit Item' : 'Add Item'">
      <div class="space-y-4">
        <Input v-model="form.title" label="Title" required />
        <Textarea v-model="form.description" label="Description" rows="2" />
        <Input v-model="form.icon" label="Icon (emoji or identifier)" />
        <Input v-model="form.link" label="Link URL (optional)" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" class="rounded" />
          Active
        </label>
      </div>
      <template #footer>
        <Button variant="secondary" @click="modalOpen = false">Cancel</Button>
        <Button :loading="saving" @click="saveItem">Save</Button>
      </template>
    </Modal>

    <Modal v-model="deleteModalOpen" title="Delete Item">
      <p>Delete "{{ deleteTarget?.title }}"?</p>
      <template #footer>
        <Button variant="secondary" @click="deleteModalOpen = false">Cancel</Button>
        <Button variant="danger" @click="confirmDelete">Delete</Button>
      </template>
    </Modal>
  </div>
</template>
