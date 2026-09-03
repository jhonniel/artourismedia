<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pagesApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { slugify } from '@/utils/slug'
import type { Page, PageMetadata } from '@/types'
import PageMetadataEditor from '@/components/content/PageMetadataEditor.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
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
  content: '',
  is_published: false,
  seo_title: '',
  seo_description: '',
})

const metadata = ref<PageMetadata>({
  values: [],
  timeline: [],
  team: [],
})

const isEdit = computed(() => !!route.params.uuid)
const pageTitle = computed(() => (isEdit.value ? 'Edit Page' : 'New Page'))
const showMetadataEditor = computed(() => form.value.slug === 'about')

watch(
  () => form.value.title,
  (title) => {
    if (!slugManual.value) {
      form.value.slug = slugify(title)
    }
  },
)

async function loadData(): Promise<void> {
  loading.value = true
  try {
    if (isEdit.value) {
      const page = await pagesApi.get(route.params.uuid as string)
      form.value = {
        title: page.title,
        slug: page.slug,
        content: page.content || '',
        is_published: page.is_published ?? false,
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
      }
      metadata.value = {
        values: page.metadata?.values ?? [],
        timeline: page.metadata?.timeline ?? [],
        team: page.metadata?.team ?? [],
      }
      slugManual.value = true
    }
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function save(publish = false): Promise<void> {
  saving.value = true
  try {
    const payload: Partial<Page> = {
      ...form.value,
      is_published: publish ? true : form.value.is_published,
      metadata: showMetadataEditor.value ? metadata.value : undefined,
    }

    if (isEdit.value) {
      await pagesApi.update(route.params.uuid as string, payload)
      toastStore.success(publish ? 'Page published' : 'Page saved')
    } else {
      const page = await pagesApi.create(payload)
      toastStore.success(publish ? 'Page published' : 'Page created')
      router.replace(`/content/pages/${page.uuid}/edit`)
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
        <p class="admin-page-subtitle">Create and edit CMS pages</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" @click="router.push('/content/pages')">Cancel</Button>
        <Button variant="outline" :loading="saving" @click="save(false)">Save Draft</Button>
        <Button :loading="saving" @click="save(true)">Publish</Button>
      </div>
    </div>

    <LoadingState v-if="loading" />

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <Card title="Content">
          <div class="space-y-4">
            <Input v-model="form.title" label="Title" required />
            <Input
              v-model="form.slug"
              label="Slug"
              hint="URL path, e.g. privacy-policy"
              @input="slugManual = true"
            />
            <RichTextEditor v-model="form.content" label="Body" />
          </div>
        </Card>

        <PageMetadataEditor v-if="showMetadataEditor" v-model="metadata" />

        <Card title="SEO">
          <div class="space-y-4">
            <Input v-model="form.seo_title" label="SEO Title" />
            <Textarea v-model="form.seo_description" label="SEO Description" rows="3" />
          </div>
        </Card>
      </div>

      <div class="space-y-6">
        <Card title="Publish">
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input v-model="form.is_published" type="checkbox" class="rounded border-slate-300 text-primary-600" />
            Published
          </label>
        </Card>
      </div>
    </div>
  </div>
</template>
