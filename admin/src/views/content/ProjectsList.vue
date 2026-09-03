<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { projectsApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useReorder } from '@/composables/useReorder'
import { useToastStore } from '@/stores/toast'
import type { Project } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Table from '@/components/ui/Table.vue'

const router = useRouter()
const toastStore = useToastStore()

const loading = ref(true)
const projects = ref<Project[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const publishedFilter = ref('')
const featuredFilter = ref('')
const reorderMode = ref(false)
const deleteTarget = ref<Project | null>(null)
const deleteModalOpen = ref(false)

const { moveItem } = useReorder(projects, projectsApi.reorder, toastStore)

const showPagination = computed(() => !reorderMode.value && lastPage.value > 1)

async function loadProjects(): Promise<void> {
  loading.value = true
  try {
    const data = await projectsApi.list({
      page: reorderMode.value ? 1 : page.value,
      per_page: reorderMode.value ? 200 : 15,
      search: reorderMode.value ? undefined : search.value || undefined,
      is_published: publishedFilter.value === '' ? undefined : publishedFilter.value === 'published',
      is_featured: featuredFilter.value === 'yes' ? true : featuredFilter.value === 'no' ? false : undefined,
    })
    projects.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

function toggleReorderMode(): void {
  reorderMode.value = !reorderMode.value
  page.value = 1
  loadProjects()
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  try {
    await projectsApi.delete(deleteTarget.value.uuid)
    toastStore.success('Project deleted')
    deleteModalOpen.value = false
    deleteTarget.value = null
    await loadProjects()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  }
}

watch(reorderMode, () => {
  if (reorderMode.value) {
    search.value = ''
    publishedFilter.value = ''
    featuredFilter.value = ''
  }
})

function onSearch(): void {
  page.value = 1
  loadProjects()
}

onMounted(loadProjects)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="admin-page-title">Projects</h2>
        <p class="admin-page-subtitle">Manage portfolio and case studies</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="toggleReorderMode">
          {{ reorderMode ? 'Done Reordering' : 'Reorder' }}
        </Button>
        <Button @click="router.push('/content/projects/create')">New Project</Button>
      </div>
    </div>

    <Table :loading="loading" :empty="!loading && projects.length === 0">
      <template v-if="!reorderMode" #toolbar>
        <form class="flex flex-wrap gap-2" @submit.prevent="onSearch">
          <Input v-model="search" placeholder="Search projects..." class="w-full sm:min-w-[200px] sm:max-w-xs" />
          <select v-model="publishedFilter" class="admin-input w-auto">
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select v-model="featuredFilter" class="admin-input w-auto">
            <option value="">All projects</option>
            <option value="yes">Featured only</option>
            <option value="no">Not featured</option>
          </select>
          <Button type="submit" variant="outline">Filter</Button>
        </form>
      </template>

      <template #head>
        <th v-if="reorderMode" class="w-16">Order</th>
        <th>Title</th>
        <th>Status</th>
        <th>Featured</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="(project, index) in projects" :key="project.uuid">
        <td v-if="reorderMode">
          <div class="flex gap-1">
            <Button variant="ghost" size="sm" :disabled="index === 0" @click="moveItem(index, -1)">↑</Button>
            <Button variant="ghost" size="sm" :disabled="index === projects.length - 1" @click="moveItem(index, 1)">↓</Button>
          </div>
        </td>
        <td>
          <p class="font-medium">{{ project.title }}</p>
          <p class="text-xs text-slate-500">{{ project.slug }}</p>
        </td>
        <td>{{ project.is_published ? 'Published' : 'Draft' }}</td>
        <td>{{ project.is_featured ? 'Yes' : 'No' }}</td>
        <td class="text-right">
          <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm" @click="router.push(`/content/projects/${project.uuid}/edit`)">
              Edit
            </Button>
            <Button variant="ghost" size="sm" @click="deleteTarget = project; deleteModalOpen = true">Delete</Button>
          </div>
        </td>
      </tr>
    </Table>

    <Pagination v-if="showPagination" v-model:page="page" :last-page="lastPage" :total="total" @update:page="loadProjects" />

    <Modal
      v-model="deleteModalOpen"
      title="Delete project?"
      confirm-text="Delete"
      confirm-variant="danger"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    >
      <p class="text-sm text-slate-600">Delete <strong>{{ deleteTarget?.title }}</strong>?</p>
    </Modal>
  </div>
</template>
