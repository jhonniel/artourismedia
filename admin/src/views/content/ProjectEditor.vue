<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { slugify } from '@/utils/slug'
import type { ProjectCategory } from '@/types'
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
const categories = ref<ProjectCategory[]>([])
const slugManual = ref(false)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: null as string | null,
  project_category_uuid: '',
  category_label: '',
  cta_text: '',
  cta_url: '',
  color: '',
  is_featured: false,
  is_published: false,
  seo_title: '',
  seo_description: '',
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
    categories.value = await projectsApi.categories()

    if (isEdit.value) {
      const project = await projectsApi.get(route.params.uuid as string)
      form.value = {
        title: project.title,
        slug: project.slug,
        excerpt: project.excerpt || '',
        content: project.content || '',
        cover_image_url: project.cover_image_url || null,
        project_category_uuid: project.category?.uuid || project.project_category_uuid || '',
        category_label: project.category_label || '',
        cta_text: project.cta_text || '',
        cta_url: project.cta_url || '',
        color: project.color || '',
        is_featured: project.is_featured,
        is_published: project.is_published,
        seo_title: project.seo_title || '',
        seo_description: project.seo_description || '',
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
      await projectsApi.update(route.params.uuid as string, form.value)
      toastStore.success('Project updated')
    } else {
      const project = await projectsApi.create(form.value)
      toastStore.success('Project created')
      router.replace(`/content/projects/${project.uuid}/edit`)
    }
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function previewProject(): Promise<void> {
  if (!isEdit.value) {
    toastStore.error('Save the project first before previewing')
    return
  }
  try {
    const { preview_url } = await projectsApi.previewToken(route.params.uuid as string)
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
        <h2 class="admin-page-title">{{ isEdit ? 'Edit Project' : 'New Project' }}</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" @click="router.push('/content/projects')">Cancel</Button>
        <Button v-if="isEdit" variant="outline" @click="previewProject">Preview</Button>
        <Button :loading="saving" @click="save">Save</Button>
      </div>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <Card title="Project Details">
          <div class="space-y-4">
            <Input v-model="form.title" label="Title" required />
            <Input v-model="form.slug" label="Slug" @input="slugManual = true" />
            <Textarea v-model="form.excerpt" label="Excerpt" />
            <RichTextEditor v-model="form.content" label="Content" />
          </div>
        </Card>

        <Card title="SEO">
          <div class="space-y-4">
            <Input v-model="form.seo_title" label="SEO Title" />
            <Textarea v-model="form.seo_description" label="SEO Description" />
          </div>
        </Card>
      </div>

      <div class="space-y-6">
        <Card title="Settings">
          <div class="space-y-4">
            <div>
              <label class="admin-label">Category</label>
              <select v-model="form.project_category_uuid" class="admin-input">
                <option value="">None</option>
                <option v-for="cat in categories" :key="cat.uuid" :value="cat.uuid">{{ cat.name }}</option>
              </select>
            </div>
            <Input v-model="form.category_label" label="Category Label" />
            <Input v-model="form.cta_text" label="CTA Text" />
            <Input v-model="form.cta_url" label="CTA URL" />
            <Input v-model="form.color" label="Accent Color" placeholder="#3b82f6" />
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.is_published" type="checkbox" class="rounded border-slate-300 text-primary-600" />
              Published
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="form.is_featured" type="checkbox" class="rounded border-slate-300 text-primary-600" />
              Featured
            </label>
          </div>
        </Card>

        <Card title="Cover Image">
          <ImageUploader v-model="form.cover_image_url" />
        </Card>
      </div>
    </div>
  </div>
</template>
