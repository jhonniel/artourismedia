<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { categoriesApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useReorder } from '@/composables/useReorder'
import { useToastStore } from '@/stores/toast'
import { slugify } from '@/utils/slug'
import type { PostCategory } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const categories = ref<PostCategory[]>([])
const modalOpen = ref(false)
const editing = ref<PostCategory | null>(null)
const deleteTarget = ref<PostCategory | null>(null)
const deleteModalOpen = ref(false)

const { moveItem } = useReorder(categories, categoriesApi.reorder, toastStore)

const form = ref({
  name: '',
  slug: '',
  description: '',
  is_active: true,
})

function resetForm(): void {
  form.value = { name: '', slug: '', description: '', is_active: true }
  editing.value = null
}

async function loadCategories(): Promise<void> {
  loading.value = true
  try {
    categories.value = await categoriesApi.list()
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

function openEdit(category: PostCategory): void {
  editing.value = category
  form.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    is_active: category.is_active,
  }
  modalOpen.value = true
}

async function saveCategory(): Promise<void> {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      slug: form.value.slug || slugify(form.value.name),
    }

    if (editing.value) {
      await categoriesApi.update(editing.value.uuid, payload)
      toastStore.success('Category updated')
    } else {
      await categoriesApi.create(payload)
      toastStore.success('Category created')
    }

    modalOpen.value = false
    await loadCategories()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await categoriesApi.delete(deleteTarget.value.uuid)
    toastStore.success('Category deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadCategories()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadCategories)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="admin-page-title">Categories</h2>
        <p class="admin-page-subtitle">Organize posts by category</p>
      </div>
      <Button @click="openCreate">New Category</Button>
    </div>

    <Table :loading="loading" :empty="!loading && categories.length === 0">
      <template #head>
        <th class="w-16">Order</th>
        <th>Name</th>
        <th>Slug</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="(category, index) in categories" :key="category.uuid">
        <td>
          <div class="flex gap-1">
            <Button variant="ghost" size="sm" :disabled="index === 0" @click="moveItem(index, -1)">↑</Button>
            <Button variant="ghost" size="sm" :disabled="index === categories.length - 1" @click="moveItem(index, 1)">↓</Button>
          </div>
        </td>
        <td class="font-medium">{{ category.name }}</td>
        <td>{{ category.slug }}</td>
        <td>{{ category.is_active ? 'Active' : 'Inactive' }}</td>
        <td class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm" @click="openEdit(category)">Edit</Button>
            <Button variant="ghost" size="sm" @click="deleteTarget = category; deleteModalOpen = true">Delete</Button>
          </div>
        </td>
      </tr>
    </Table>

    <Modal
      v-model="modalOpen"
      :title="editing ? 'Edit Category' : 'New Category'"
      :loading="saving"
      @confirm="saveCategory"
    >
      <div class="space-y-4">
        <Input v-model="form.name" label="Name" required />
        <Input v-model="form.slug" label="Slug" />
        <Textarea v-model="form.description" label="Description" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" class="rounded border-slate-300 text-primary-600" />
          Active
        </label>
      </div>
    </Modal>

    <Modal
      v-model="deleteModalOpen"
      title="Delete category?"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">Delete <strong>{{ deleteTarget?.name }}</strong>?</p>
    </Modal>
  </div>
</template>
