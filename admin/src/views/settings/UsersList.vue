<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { User } from '@/types'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import Table from '@/components/ui/Table.vue'

const router = useRouter()
const toastStore = useToastStore()

const loading = ref(true)
const users = ref<User[]>([])
const deleteTarget = ref<User | null>(null)
const deleteModalOpen = ref(false)

async function loadUsers(): Promise<void> {
  loading.value = true
  try {
    users.value = await usersApi.list()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await usersApi.delete(deleteTarget.value.uuid)
    toastStore.success('User deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadUsers()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadUsers)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">Users</h2>
        <p class="admin-page-subtitle">Manage admin accounts</p>
      </div>
      <Button @click="router.push('/settings/users/create')">New User</Button>
    </div>

    <Table :loading="loading" :empty="!loading && users.length === 0">
      <template #head>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th class="text-right">Actions</th>
      </template>

      <template #body>
        <tr v-for="user in users" :key="user.uuid">
          <td class="font-medium">{{ user.name }}</td>
          <td class="text-slate-500">{{ user.email }}</td>
          <td>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
              {{ user.role }}
            </span>
          </td>
          <td class="text-right">
            <Button variant="ghost" size="sm" @click="router.push(`/settings/users/${user.uuid}/edit`)">
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="text-red-600"
              @click="deleteTarget = user; deleteModalOpen = true"
            >
              Delete
            </Button>
          </td>
        </tr>
      </template>
    </Table>

    <Modal v-model:open="deleteModalOpen" title="Delete User" @confirm="confirmDelete">
      <p>Delete <strong>{{ deleteTarget?.name }}</strong>? This cannot be undone.</p>
    </Modal>
  </div>
</template>
