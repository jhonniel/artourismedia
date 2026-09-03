<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { postsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { formatDateTime } from '@/utils/slug'
import type { Post } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Table from '@/components/ui/Table.vue'

const router = useRouter()
const toastStore = useToastStore()

const loading = ref(true)
const bulkLoading = ref(false)
const posts = ref<Post[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const statusFilter = ref('')
const selected = ref<Set<string>>(new Set())
const deleteTarget = ref<Post | null>(null)
const deleteModalOpen = ref(false)
const bulkModalOpen = ref(false)
const bulkAction = ref<'delete' | 'publish' | 'archive' | 'draft'>('publish')
const deleting = ref(false)

const allSelected = computed(() => posts.value.length > 0 && posts.value.every((p) => selected.value.has(p.uuid)))
const selectedCount = computed(() => selected.value.size)

async function loadPosts(): Promise<void> {
  loading.value = true
  try {
    const data = await postsApi.list({
      page: page.value,
      search: search.value || undefined,
      status: statusFilter.value || undefined,
    })
    posts.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
    selected.value = new Set()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

function onSearch(): void {
  page.value = 1
  loadPosts()
}

function toggleAll(): void {
  if (allSelected.value) {
    selected.value = new Set()
  } else {
    selected.value = new Set(posts.value.map((p) => p.uuid))
  }
}

function toggleOne(uuid: string): void {
  const next = new Set(selected.value)
  if (next.has(uuid)) next.delete(uuid)
  else next.add(uuid)
  selected.value = next
}

function openBulk(action: typeof bulkAction.value): void {
  bulkAction.value = action
  bulkModalOpen.value = true
}

async function confirmBulk(): Promise<void> {
  bulkLoading.value = true
  try {
    const { count } = await postsApi.bulk({
      uuids: [...selected.value],
      action: bulkAction.value,
    })
    toastStore.success(`${count} post(s) updated`)
    bulkModalOpen.value = false
    await loadPosts()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    bulkLoading.value = false
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await postsApi.delete(deleteTarget.value.uuid)
    toastStore.success('Post deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadPosts()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    deleting.value = false
  }
}

onMounted(loadPosts)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">Posts</h2>
        <p class="admin-page-subtitle">Manage blog posts and articles</p>
      </div>
      <Button @click="router.push('/content/posts/create')">New Post</Button>
    </div>

    <div
      v-if="selectedCount > 0"
      class="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3"
    >
      <span class="text-sm font-medium text-primary-900">{{ selectedCount }} selected</span>
      <Button size="sm" variant="outline" @click="openBulk('publish')">Publish</Button>
      <Button size="sm" variant="outline" @click="openBulk('draft')">Draft</Button>
      <Button size="sm" variant="outline" @click="openBulk('archive')">Archive</Button>
      <Button size="sm" variant="outline" class="text-red-600" @click="openBulk('delete')">Delete</Button>
    </div>

    <Table :loading="loading" :empty="!loading && posts.length === 0">
      <template #toolbar>
        <form class="flex flex-wrap gap-2" @submit.prevent="onSearch">
          <Input v-model="search" placeholder="Search posts..." class="max-w-xs" />
          <select v-model="statusFilter" class="admin-input w-auto" @change="onSearch">
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </template>

      <template #head>
        <th class="w-10">
          <input type="checkbox" :checked="allSelected" class="rounded border-slate-300" @change="toggleAll" />
        </th>
        <th>Title</th>
        <th>Status</th>
        <th>Published</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="post in posts" :key="post.uuid">
        <td>
          <input
            type="checkbox"
            :checked="selected.has(post.uuid)"
            class="rounded border-slate-300"
            @change="toggleOne(post.uuid)"
          />
        </td>
        <td>
          <p class="font-medium text-slate-900">{{ post.title }}</p>
          <p class="text-xs text-slate-500">{{ post.slug }}</p>
        </td>
        <td>
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
            :class="post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
          >
            {{ post.status }}
          </span>
        </td>
        <td>{{ formatDateTime(post.published_at) }}</td>
        <td class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm" @click="router.push(`/content/posts/${post.uuid}/edit`)">
              Edit
            </Button>
            <Button variant="ghost" size="sm" @click="deleteTarget = post; deleteModalOpen = true">Delete</Button>
          </div>
        </td>
      </tr>
    </Table>

    <Pagination v-model:page="page" :last-page="lastPage" :total="total" @update:page="loadPosts" />

    <Modal
      v-model="bulkModalOpen"
      title="Confirm bulk action"
      :loading="bulkLoading"
      confirm-variant="danger"
      @confirm="confirmBulk"
    >
      <p class="text-sm text-slate-600">
        Apply <strong>{{ bulkAction }}</strong> to {{ selectedCount }} post(s)?
      </p>
    </Modal>

    <Modal
      v-model="deleteModalOpen"
      title="Delete post?"
      confirm-text="Delete"
      confirm-variant="danger"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">
        Are you sure you want to delete <strong>{{ deleteTarget?.title }}</strong>? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>
