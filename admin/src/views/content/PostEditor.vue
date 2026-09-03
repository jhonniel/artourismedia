<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoriesApi, postsApi, tagsApi, usersApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { usePermissions } from '@/composables/usePermissions'
import { useToastStore } from '@/stores/toast'
import { slugify } from '@/utils/slug'
import type { Post, PostCategory, Tag, User } from '@/types'
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
const { isAuthor } = usePermissions()

const loading = ref(true)
const saving = ref(false)
const categories = ref<PostCategory[]>([])
const tags = ref<Tag[]>([])
const authors = ref<User[]>([])
const slugManual = ref(false)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image_url: null as string | null,
  status: 'draft' as Post['status'],
  is_featured: false,
  allow_social_sharing: true,
  published_at: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  post_category_uuid: '',
  author_uuid: '',
  tag_uuids: [] as string[],
})

const isEdit = computed(() => !!route.params.uuid)
const pageTitle = computed(() => (isEdit.value ? 'Edit Post' : 'New Post'))

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
    const [cats, tagList, userList] = await Promise.all([
      categoriesApi.list(),
      tagsApi.list(),
      isAuthor.value ? Promise.resolve([]) : usersApi.list(),
    ])
    categories.value = cats
    tags.value = tagList
    authors.value = userList

    if (isEdit.value) {
      const post = await postsApi.get(route.params.uuid as string)
      form.value = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content || '',
        featured_image_url: post.featured_image_url || null,
        status: post.status,
        is_featured: post.is_featured,
        allow_social_sharing: post.allow_social_sharing ?? true,
        published_at: post.published_at ? post.published_at.slice(0, 16) : '',
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        seo_keywords: post.seo_keywords || '',
        post_category_uuid: post.category?.uuid || post.post_category_uuid || '',
        author_uuid: post.author?.uuid || post.author_uuid || '',
        tag_uuids: post.tags?.map((t) => t.uuid) || [],
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
    const payload = {
      ...form.value,
      status: publish ? 'published' : form.value.status,
      published_at: publish && !form.value.published_at
        ? new Date().toISOString()
        : form.value.published_at || null,
    }

    if (isEdit.value) {
      await postsApi.update(route.params.uuid as string, payload)
      toastStore.success(publish ? 'Post published' : 'Post saved')
    } else {
      const post = await postsApi.create(payload)
      toastStore.success(publish ? 'Post published' : 'Post created')
      router.replace(`/content/posts/${post.uuid}/edit`)
    }
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}

async function previewPost(): Promise<void> {
  if (!isEdit.value) {
    toastStore.error('Save the post first before previewing')
    return
  }
  try {
    const { preview_url } = await postsApi.previewToken(route.params.uuid as string)
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
        <h2 class="admin-page-title">{{ pageTitle }}</h2>
        <p class="admin-page-subtitle">Write and publish blog content</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" @click="router.push('/content/posts')">Cancel</Button>
        <Button v-if="isEdit" variant="outline" @click="previewPost">Preview</Button>
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
              hint="URL-friendly identifier"
              @input="slugManual = true"
            />
            <Textarea v-model="form.excerpt" label="Excerpt" rows="3" />
            <RichTextEditor v-model="form.content" label="Body" />
          </div>
        </Card>

        <Card title="SEO">
          <div class="space-y-4">
            <Input v-model="form.seo_title" label="SEO Title" />
            <Textarea v-model="form.seo_description" label="SEO Description" rows="3" />
            <Input v-model="form.seo_keywords" label="Keywords" hint="Comma-separated" />
          </div>
        </Card>
      </div>

      <div class="space-y-6">
        <Card title="Publish">
          <div class="space-y-4">
            <div>
              <label class="admin-label">Status</label>
              <select v-model="form.status" class="admin-input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Input v-model="form.published_at" label="Publish Date" type="datetime-local" />
            <label class="flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.is_featured" type="checkbox" class="rounded border-slate-300 text-primary-600" />
              Featured post
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.allow_social_sharing" type="checkbox" class="rounded border-slate-300 text-primary-600" />
              Allow social sharing
            </label>
          </div>
        </Card>

        <Card title="Organization">
          <div class="space-y-4">
            <div v-if="!isAuthor">
              <label class="admin-label">Author</label>
              <select v-model="form.author_uuid" class="admin-input">
                <option value="">Default (current user on create)</option>
                <option v-for="author in authors" :key="author.uuid" :value="author.uuid">
                  {{ author.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="admin-label">Category</label>
              <select v-model="form.post_category_uuid" class="admin-input">
                <option value="">None</option>
                <option v-for="cat in categories" :key="cat.uuid" :value="cat.uuid">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="admin-label">Tags</label>
              <select v-model="form.tag_uuids" multiple class="admin-input min-h-28">
                <option v-for="tag in tags" :key="tag.uuid" :value="tag.uuid">{{ tag.name }}</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Featured Image">
          <ImageUploader v-model="form.featured_image_url" />
        </Card>
      </div>
    </div>
  </div>
</template>
