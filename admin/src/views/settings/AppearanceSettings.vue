<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { settingsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import Input from '@/components/ui/Input.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)

const form = ref({
  logo_url: null as string | null,
  favicon_url: null as string | null,
  primary_color: '#078C95',
  secondary_color: '#FF5A1F',
  accent_color: '#0B2447',
  google_analytics_id: '',
  default_seo_title: '',
  default_seo_description: '',
})

async function loadSettings(): Promise<void> {
  loading.value = true
  try {
    const settings = await settingsApi.get('branding')
    for (const setting of settings) {
      if (setting.key in form.value) {
        const key = setting.key as keyof typeof form.value
        if (key === 'logo_url' || key === 'favicon_url') {
          form.value[key] = setting.value
        } else {
          form.value[key] = setting.value || ''
        }
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
    toastStore.success('Appearance settings saved')
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
        <h2 class="admin-page-title">Appearance</h2>
        <p class="admin-page-subtitle">Brand colors, logo, favicon, and analytics</p>
      </div>
      <Button :loading="saving" @click="save">Save Changes</Button>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="grid gap-6 lg:grid-cols-2">
      <Card title="Brand Assets">
        <div class="space-y-4">
          <ImageUploader v-model="form.logo_url" label="Logo" />
          <ImageUploader v-model="form.favicon_url" label="Favicon" />
        </div>
      </Card>

      <Card title="Colors">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input v-model="form.primary_color" label="Primary" type="color" />
          <Input v-model="form.secondary_color" label="Secondary" type="color" />
          <Input v-model="form.accent_color" label="Accent" type="color" />
        </div>
      </Card>

      <Card title="Default SEO" class="lg:col-span-2">
        <div class="space-y-4">
          <Input v-model="form.default_seo_title" label="Default Page Title" />
          <Textarea v-model="form.default_seo_description" label="Default Meta Description" rows="3" />
        </div>
      </Card>

      <Card title="Analytics" class="lg:col-span-2">
        <Input
          v-model="form.google_analytics_id"
          label="Google Analytics Measurement ID"
          hint="e.g. G-XXXXXXXXXX"
        />
      </Card>
    </div>
  </div>
</template>
