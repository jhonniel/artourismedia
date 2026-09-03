<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { cacheApi, settingsApi } from '@/api'
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
const flushing = ref(false)

const form = ref({
  site_name: '',
  site_tagline: '',
  contact_email: '',
  contact_phone: '',
  contact_address: '',
  facebook_url: '',
  twitter_url: '',
  linkedin_url: '',
  instagram_url: '',
})

async function loadSettings(): Promise<void> {
  loading.value = true
  try {
    const settings = await settingsApi.get('general')
    for (const setting of settings) {
      if (setting.key in form.value) {
        const key = setting.key as keyof typeof form.value
        form.value[key] = setting.value || ''
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
    toastStore.success('Settings saved')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function flushCache(): Promise<void> {
  flushing.value = true
  try {
    await cacheApi.flush()
    toastStore.success('Public cache cleared')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    flushing.value = false
  }
}

onMounted(loadSettings)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">General Settings</h2>
        <p class="admin-page-subtitle">Site name, contact info, and social profiles</p>
      </div>
      <Button :loading="saving" @click="save">Save Changes</Button>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="grid gap-6 lg:grid-cols-2">
      <Card title="Site Info">
        <div class="space-y-4">
          <Input v-model="form.site_name" label="Site Name" />
          <Input v-model="form.site_tagline" label="Tagline" />
        </div>
      </Card>

      <Card title="Contact">
        <div class="space-y-4">
          <Input v-model="form.contact_email" label="Email" type="email" />
          <Input v-model="form.contact_phone" label="Phone" />
          <Textarea v-model="form.contact_address" label="Address" rows="3" />
        </div>
      </Card>

      <Card title="Social Profiles" class="lg:col-span-2">
        <div class="grid gap-4 sm:grid-cols-2">
          <Input v-model="form.facebook_url" label="Facebook URL" />
          <Input v-model="form.twitter_url" label="Twitter URL" />
          <Input v-model="form.linkedin_url" label="LinkedIn URL" />
          <Input v-model="form.instagram_url" label="Instagram URL" />
        </div>
      </Card>

      <Card title="Maintenance" class="lg:col-span-2">
        <p class="mb-4 text-sm text-slate-600">
          Clear cached homepage, site settings, and sitemap data after manual database changes.
        </p>
        <Button variant="outline" :loading="flushing" @click="flushCache">Clear Public Cache</Button>
      </Card>
    </div>
  </div>
</template>
