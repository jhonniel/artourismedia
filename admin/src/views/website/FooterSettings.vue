<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { settingsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)

const form = ref({
  footer_tagline: '',
  footer_description: '',
  footer_copyright: '',
  footer_address: '',
  footer_phone: '',
  footer_email: '',
})

async function loadSettings(): Promise<void> {
  loading.value = true
  try {
    const settings = await settingsApi.get('footer')
    for (const setting of settings) {
      if (setting.key in form.value) {
        form.value[setting.key as keyof typeof form.value] = setting.value || ''
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
    await settingsApi.update(form.value)
    toastStore.success('Footer settings saved')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

onMounted(loadSettings)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">Footer Settings</h2>
        <p class="admin-page-subtitle">Configure footer content and contact details</p>
      </div>
      <Button :loading="saving" @click="save">Save Changes</Button>
    </div>

    <LoadingState v-if="loading" />

    <Card v-else title="Footer Content">
      <div class="space-y-4">
        <Input v-model="form.footer_tagline" label="Tagline" />
        <Textarea v-model="form.footer_description" label="Description" rows="4" />
        <Input v-model="form.footer_copyright" label="Copyright Text" />
        <Input v-model="form.footer_address" label="Address" />
        <div class="grid gap-4 sm:grid-cols-2">
          <Input v-model="form.footer_phone" label="Phone" />
          <Input v-model="form.footer_email" label="Email" type="email" />
        </div>
      </div>
    </Card>
  </div>
</template>
