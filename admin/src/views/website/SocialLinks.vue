<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { socialLinksApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { SocialLink } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const links = ref<SocialLink[]>([])
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editing = ref<SocialLink | null>(null)
const deleteTarget = ref<SocialLink | null>(null)

const form = ref({
  platform: '',
  username: '',
  url: '',
  icon: '',
  is_active: true,
})

function resetForm(): void {
  form.value = { platform: '', username: '', url: '', icon: '', is_active: true }
  editing.value = null
}

async function loadLinks(): Promise<void> {
  loading.value = true
  try {
    links.value = await socialLinksApi.list()
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

function openEdit(link: SocialLink): void {
  editing.value = link
  form.value = {
    platform: link.platform,
    username: link.username || '',
    url: link.url,
    icon: link.icon || '',
    is_active: link.is_active,
  }
  modalOpen.value = true
}

async function saveLink(): Promise<void> {
  saving.value = true
  try {
    if (editing.value) {
      await socialLinksApi.update(editing.value.uuid, form.value)
      toastStore.success('Social link updated')
    } else {
      await socialLinksApi.create(form.value)
      toastStore.success('Social link created')
    }
    modalOpen.value = false
    await loadLinks()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function moveLink(index: number, direction: -1 | 1): Promise<void> {
  const target = index + direction
  if (target < 0 || target >= links.value.length) return
  const list = [...links.value]
  ;[list[index], list[target]] = [list[target], list[index]]
  try {
    await socialLinksApi.reorder(list.map((l) => l.uuid))
    links.value = list
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await socialLinksApi.delete(deleteTarget.value.uuid)
    toastStore.success('Link deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadLinks()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadLinks)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="admin-page-title">Social Links</h2>
        <p class="admin-page-subtitle">Manage social media profiles</p>
      </div>
      <Button @click="openCreate">Add Link</Button>
    </div>

    <Table :loading="loading" :empty="!loading && links.length === 0">
      <template #head>
        <th>Platform</th>
        <th>URL</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="(link, index) in links" :key="link.uuid">
        <td class="font-medium">{{ link.platform }}</td>
        <td>{{ link.url }}</td>
        <td>{{ link.is_active ? 'Active' : 'Hidden' }}</td>
        <td class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm" :disabled="index === 0" @click="moveLink(index, -1)">↑</Button>
            <Button variant="ghost" size="sm" @click="openEdit(link)">Edit</Button>
            <Button variant="ghost" size="sm" @click="deleteTarget = link; deleteModalOpen = true">Delete</Button>
          </div>
        </td>
      </tr>
    </Table>

    <Modal v-model="modalOpen" :title="editing ? 'Edit Social Link' : 'Add Social Link'" :loading="saving" @confirm="saveLink">
      <div class="space-y-4">
        <Input v-model="form.platform" label="Platform" placeholder="Twitter, LinkedIn..." required />
        <Input v-model="form.username" label="Username" />
        <Input v-model="form.url" label="URL" required />
        <Input v-model="form.icon" label="Icon" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" class="rounded border-slate-300 text-primary-600" />
          Active
        </label>
      </div>
    </Modal>

    <Modal
      v-model="deleteModalOpen"
      title="Delete social link?"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">Delete <strong>{{ deleteTarget?.platform }}</strong>?</p>
    </Modal>
  </div>
</template>
