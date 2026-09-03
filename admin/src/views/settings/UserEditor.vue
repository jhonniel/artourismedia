<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'editor',
})

const isEdit = computed(() => !!route.params.uuid)
const pageTitle = computed(() => (isEdit.value ? 'Edit User' : 'New User'))

async function loadData(): Promise<void> {
  loading.value = true
  try {
    if (isEdit.value) {
      const user = await usersApi.get(route.params.uuid as string)
      form.value = {
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
      }
    }
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function save(): Promise<void> {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (isEdit.value && !payload.password) {
      delete (payload as { password?: string }).password
      delete (payload as { password_confirmation?: string }).password_confirmation
    }

    if (isEdit.value) {
      await usersApi.update(route.params.uuid as string, payload)
      toastStore.success('User updated')
    } else {
      await usersApi.create(payload)
      toastStore.success('User created')
      router.push('/settings/users')
    }
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">{{ pageTitle }}</h2>
        <p class="admin-page-subtitle">Create or update admin accounts</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="router.push('/settings/users')">Cancel</Button>
        <Button :loading="saving" @click="save">Save</Button>
      </div>
    </div>

    <LoadingState v-if="loading" />

    <Card v-else title="Account Details" class="max-w-xl">
      <div class="space-y-4">
        <Input v-model="form.name" label="Name" required />
        <Input v-model="form.email" label="Email" type="email" required />
        <div>
          <label class="admin-label">Role</label>
          <select v-model="form.role" class="admin-input">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
          </select>
        </div>
        <Input
          v-model="form.password"
          label="Password"
          type="password"
          :required="!isEdit"
          :hint="isEdit ? 'Leave blank to keep current password' : undefined"
        />
        <Input v-model="form.password_confirmation" label="Confirm Password" type="password" :required="!isEdit" />
      </div>
    </Card>
  </div>
</template>
