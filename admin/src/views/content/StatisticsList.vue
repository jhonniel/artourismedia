<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { statisticsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { Statistic } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const statistics = ref<Statistic[]>([])
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editing = ref<Statistic | null>(null)
const deleteTarget = ref<Statistic | null>(null)

const form = ref({
  number: '',
  prefix: '',
  suffix: '',
  title: '',
  description: '',
  icon: '',
  is_active: true,
  sort_order: 0,
})

function resetForm(): void {
  form.value = {
    number: '',
    prefix: '',
    suffix: '',
    title: '',
    description: '',
    icon: '',
    is_active: true,
    sort_order: statistics.value.length,
  }
  editing.value = null
}

async function loadStatistics(): Promise<void> {
  loading.value = true
  try {
    statistics.value = await statisticsApi.list()
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

function openEdit(stat: Statistic): void {
  editing.value = stat
  form.value = {
    number: stat.number,
    prefix: stat.prefix || '',
    suffix: stat.suffix || '',
    title: stat.title,
    description: stat.description || '',
    icon: stat.icon || '',
    is_active: stat.is_active,
    sort_order: stat.sort_order,
  }
  modalOpen.value = true
}

async function saveStatistic(): Promise<void> {
  saving.value = true
  try {
    if (editing.value) {
      await statisticsApi.update(editing.value.uuid, form.value)
      toastStore.success('Statistic updated')
    } else {
      await statisticsApi.create(form.value)
      toastStore.success('Statistic created')
    }
    modalOpen.value = false
    await loadStatistics()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function moveUp(index: number): Promise<void> {
  if (index <= 0) return
  const items = [...statistics.value]
  ;[items[index - 1], items[index]] = [items[index], items[index - 1]]
  try {
    await statisticsApi.reorder(items.map((s) => s.uuid))
    statistics.value = items
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await statisticsApi.delete(deleteTarget.value.uuid)
    toastStore.success('Statistic deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadStatistics()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadStatistics)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="admin-page-title">Statistics</h2>
        <p class="admin-page-subtitle">Homepage stats and counters</p>
      </div>
      <Button @click="openCreate">New Statistic</Button>
    </div>

    <Table :loading="loading" :empty="!loading && statistics.length === 0">
      <template #head>
        <th>Number</th>
        <th>Title</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="(stat, index) in statistics" :key="stat.uuid">
        <td class="font-semibold">
          {{ stat.prefix }}{{ stat.number }}{{ stat.suffix }}
        </td>
        <td>{{ stat.title }}</td>
        <td>{{ stat.is_active ? 'Active' : 'Inactive' }}</td>
        <td class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm" :disabled="index === 0" @click="moveUp(index)">↑</Button>
            <Button variant="ghost" size="sm" @click="openEdit(stat)">Edit</Button>
            <Button
              variant="ghost"
              size="sm"
              @click="deleteTarget = stat; deleteModalOpen = true"
            >
              Delete
            </Button>
          </div>
        </td>
      </tr>
    </Table>

    <Modal v-model="modalOpen" :title="editing ? 'Edit Statistic' : 'New Statistic'" :loading="saving" @confirm="saveStatistic">
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input v-model="form.prefix" label="Prefix" placeholder="$" />
          <Input v-model="form.number" label="Number" required />
          <Input v-model="form.suffix" label="Suffix" placeholder="+" />
        </div>
        <Input v-model="form.title" label="Title" required />
        <Textarea v-model="form.description" label="Description" />
        <Input v-model="form.icon" label="Icon" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" class="rounded border-slate-300 text-primary-600" />
          Active
        </label>
      </div>
    </Modal>

    <Modal
      v-model="deleteModalOpen"
      title="Delete statistic?"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">Delete <strong>{{ deleteTarget?.title }}</strong>?</p>
    </Modal>
  </div>
</template>
