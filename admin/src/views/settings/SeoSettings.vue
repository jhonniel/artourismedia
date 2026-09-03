<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { seoApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import type { SeoSetting } from '@/types'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import Input from '@/components/ui/Input.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import Textarea from '@/components/ui/Textarea.vue'

const toastStore = useToastStore()

const loading = ref(true)
const savingUuid = ref<string | null>(null)
const settings = ref<SeoSetting[]>([])

async function loadSettings(): Promise<void> {
  loading.value = true
  try {
    settings.value = await seoApi.list()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function saveSetting(setting: SeoSetting): Promise<void> {
  savingUuid.value = setting.uuid
  try {
    await seoApi.update(setting.uuid, setting)
    toastStore.success(`${setting.page_key} SEO saved`)
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    savingUuid.value = null
  }
}

onMounted(loadSettings)
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="admin-page-title">SEO Settings</h2>
      <p class="admin-page-subtitle">Configure meta tags per page</p>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="space-y-6">
      <Card v-for="setting in settings" :key="setting.uuid" :title="setting.page_key">
        <div class="space-y-4">
          <Input v-model="setting.title" label="Meta Title" />
          <Textarea v-model="setting.description" label="Meta Description" rows="3" />
          <Textarea v-model="setting.keywords" label="Keywords" rows="2" />
          <Input v-model="setting.canonical_url" label="Canonical URL" />
          <ImageUploader v-model="setting.og_image_url" label="OG Image" />
          <div class="flex justify-end">
            <Button :loading="savingUuid === setting.uuid" @click="saveSetting(setting)">
              Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
