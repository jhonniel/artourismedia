<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { servicesApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { slugify } from '@/utils/slug'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import Input from '@/components/ui/Input.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import RichTextEditor from '@/components/ui/RichTextEditor.vue'
import Textarea from '@/components/ui/Textarea.vue'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()

const loading = ref(true)
const saving = ref(false)
const slugManual = ref(false)

const form = ref({
  title: '',
  slug: '',
  description: '',
  content: '',
  icon: '',
  image_url: null as string | null,
  cta_text: '',
  cta_url: '',
  category: '',
  is_active: true,
  sort_order: 0,
})

const isEdit = computed(() => !!route.params.uuid)

watch(
  () => form.value.title,
  (title) => {
    if (!slugManual.value) form.value.slug = slugify(title)
  },
)

async function loadData(): Promise<void> {
  loading.value = true
  try {
    if (isEdit.value) {
      const service = await servicesApi.get(route.params.uuid as string)
      form.value = {
        title: service.title,
        slug: service.slug,
        description: service.description || '',
        content: service.content || '',
        icon: service.icon || '',
        image_url: service.image_url || null,
        cta_text: service.cta_text || '',
        cta_url: service.cta_url || '',
        category: service.category || '',
        is_active: service.is_active,
        sort_order: service.sort_order,
      }
      slugManual.value = true
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
    if (isEdit.value) {
      await servicesApi.update(route.params.uuid as string, form.value)
      toastStore.success('Service updated')
    } else {
      const service = await servicesApi.create(form.value)
      toastStore.success('Service created')
      router.replace(`/content/services/${service.uuid}/edit`)
    }
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function previewService(): Promise<void> {
  if (!isEdit.value) {
    toastStore.error('Save the service first before previewing')
    return
  }
  try {
    const { preview_url } = await servicesApi.previewToken(route.params.uuid as string)
    window.open(preview_url, '_blank', 'noopener,noreferrer')
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

onMounted(loadData)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">{{ isEdit ? 'Edit Service' : 'New Service' }}</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" @click="router.push('/content/services')">Cancel</Button>
        <Button v-if="isEdit" variant="outline" @click="previewService">Preview</Button>
        <Button :loading="saving" @click="save">Save</Button>
      </div>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <Card title="Service Details">
          <div class="space-y-4">
            <Input v-model="form.title" label="Title" required />
            <Input v-model="form.slug" label="Slug" @input="slugManual = true" />
            <Textarea v-model="form.description" label="Short Description" />
            <RichTextEditor v-model="form.content" label="Full Content" />
          </div>
        </Card>
      </div>

      <div class="space-y-6">
        <Card title="Settings">
          <div class="space-y-4">
            <Input v-model="form.category" label="Category" />
            <Input v-model="form.icon" label="Icon" hint="Icon name or class" />
            <Input v-model="form.cta_text" label="CTA Text" />
            <Input v-model="form.cta_url" label="CTA URL" />
            <Input v-model.number="form.sort_order" label="Sort Order" type="number" />
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.is_active" type="checkbox" class="rounded border-slate-300 text-primary-600" />
              Active
            </label>
          </div>
        </Card>

        <Card title="Image">
          <ImageUploader v-model="form.image_url" />
        </Card>
      </div>
    </div>
  </div>
</template>
