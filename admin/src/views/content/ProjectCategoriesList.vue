<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { projectCategoriesApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { slugify } from '@/utils/slug'
import type { ProjectCategory } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const categories = ref<ProjectCategory[]>([])
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editing = ref<ProjectCategory | null>(null)
const deleteTarget = ref<ProjectCategory | null>(null)

const form = ref({
  name: '',
  slug: '',
  color: '#078C95',
  is_active: true,
})

function resetForm(): void {
  form.value = { name: '', slug: '', color: '#078C95', is_active: true }
  editing.value = null
}

async function loadCategories(): Promise<void> {
  loading.value = true
  try {
    categories.value = await projectCategoriesApi.list()
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

function openEdit(category: ProjectCategory): void {
  editing.value = category
  form.value = {
    name: category.name,
    slug: category.slug,
    color: category.color || '#078C95',
    is_active: category.is_active ?? true,
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
      await projectCategoriesApi.update(editing.value.uuid, payload)
      toastStore.success('Category updated')
    } else {
      await projectCategoriesApi.create(payload)
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

async function moveItem(index: number, direction: -1 | 1): Promise<void> {
  const target = index + direction
  if (target < 0 || target >= categories.value.length) return
  const list = [...categories.value]
  ;[list[index], list[target]] = [list[target], list[index]]
  try {
    await projectCategoriesApi.reorder(list.map((c) => c.uuid))
    categories.value = list
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await projectCategoriesApi.delete(deleteTarget.value.uuid)
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
        <h2 class="admin-page-title">Project Categories</h2>
        <p class="admin-page-subtitle">Organize case studies by category</p>
      </div>
      <Button @click="openCreate">Add Category</Button>
    </div>

    <Table :loading="loading" :columns="['Name', 'Slug', 'Color', 'Actions']">
      <tr v-for="(category, index) in categories" :key="category.uuid">
        <td class="font-medium">{{ category.name }}</td>
        <td class="text-slate-500">{{ category.slug }}</td>
        <td>
          <span
            class="inline-block h-5 w-5 rounded-full border border-slate-200"
            :style="{ backgroundColor: category.color || '#078C95' }"
          />
        </td>
        <td class="space-x-2 whitespace-nowrap">
          <button class="text-primary-600 hover:underline" @click="moveItem(index, -1)">↑</button>
          <button class="text-primary-600 hover:underline" @click="moveItem(index, 1)">↓</button>
          <button class="text-primary-600 hover:underline" @click="openEdit(category)">Edit</button>
          <button class="text-red-600 hover:underline" @click="deleteTarget = category; deleteModalOpen = true">Delete</button>
        </td>
      </tr>
    </Table>

    <Modal v-model="modalOpen" :title="editing ? 'Edit Category' : 'Add Category'">
      <div class="space-y-4">
        <Input v-model="form.name" label="Name" required />
        <Input v-model="form.slug" label="Slug" />
        <Input v-model="form.color" label="Color" type="color" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" class="rounded" />
          Active
        </label>
      </div>
      <template #footer>
        <Button variant="secondary" @click="modalOpen = false">Cancel</Button>
        <Button :loading="saving" @click="saveCategory">Save</Button>
      </template>
    </Modal>

    <Modal v-model="deleteModalOpen" title="Delete Category">
      <p>Delete "{{ deleteTarget?.name }}"?</p>
      <template #footer>
        <Button variant="secondary" @click="deleteModalOpen = false">Cancel</Button>
        <Button variant="danger" @click="confirmDelete">Delete</Button>
      </template>
    </Modal>
  </div>
</template>
