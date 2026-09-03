<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { tagsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { slugify } from '@/utils/slug'
import type { Tag } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const tags = ref<Tag[]>([])
const modalOpen = ref(false)
const editing = ref<Tag | null>(null)
const deleteModalOpen = ref(false)
const deleteTarget = ref<Tag | null>(null)

const form = ref({ name: '', slug: '' })

async function loadTags(): Promise<void> {
  loading.value = true
  try {
    tags.value = await tagsApi.list()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function saveTag(): Promise<void> {
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      slug: form.value.slug || slugify(form.value.name),
    }

    if (editing.value) {
      await tagsApi.update(editing.value.uuid, payload)
      toastStore.success('Tag updated')
    } else {
      await tagsApi.create(payload)
      toastStore.success('Tag created')
    }

    modalOpen.value = false
    editing.value = null
    form.value = { name: '', slug: '' }
    await loadTags()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await tagsApi.delete(deleteTarget.value.uuid)
    toastStore.success('Tag deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadTags()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadTags)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="admin-page-title">Tags</h2>
        <p class="admin-page-subtitle">Manage blog post tags</p>
      </div>
      <Button @click="modalOpen = true; editing = null; form = { name: '', slug: '' }">Add Tag</Button>
    </div>

    <Table :loading="loading" :columns="['Name', 'Slug', 'Actions']">
      <tr v-for="tag in tags" :key="tag.uuid">
        <td class="font-medium">{{ tag.name }}</td>
        <td class="text-slate-500">{{ tag.slug }}</td>
        <td>
          <button class="mr-3 text-primary-600 hover:underline" @click="editing = tag; form = { name: tag.name, slug: tag.slug }; modalOpen = true">
            Edit
          </button>
          <button
            class="text-red-600 hover:underline"
            @click="deleteTarget = tag; deleteModalOpen = true"
          >
            Delete
          </button>
        </td>
      </tr>
    </Table>

    <Modal v-model="modalOpen" :title="editing ? 'Edit Tag' : 'Add Tag'">
      <div class="space-y-4">
        <Input v-model="form.name" label="Name" required />
        <Input v-model="form.slug" label="Slug" hint="Auto-generated from name if empty" />
      </div>
      <template #footer>
        <Button variant="secondary" @click="modalOpen = false">Cancel</Button>
        <Button :loading="saving" @click="saveTag">{{ editing ? 'Update' : 'Create' }}</Button>
      </template>
    </Modal>

    <Modal v-model="deleteModalOpen" title="Delete Tag">
      <p>Delete tag "{{ deleteTarget?.name }}"?</p>
      <template #footer>
        <Button variant="secondary" @click="deleteModalOpen = false">Cancel</Button>
        <Button variant="danger" @click="confirmDelete">Delete</Button>
      </template>
    </Modal>
  </div>
</template>
