<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { newsletterApi } from '@/api'
import { getErrorMessage } from '@/api/client'
import { useToastStore } from '@/stores/toast'
import { formatDateTime } from '@/utils/slug'
import type { NewsletterSubscriber } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Table from '@/components/ui/Table.vue'

const toastStore = useToastStore()

const loading = ref(true)
const subscribers = ref<NewsletterSubscriber[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const unsubscribeTarget = ref<NewsletterSubscriber | null>(null)
const unsubscribeModalOpen = ref(false)
const unsubscribing = ref(false)

async function loadSubscribers(): Promise<void> {
  loading.value = true
  try {
    const data = await newsletterApi.list({ page: page.value, search: search.value || undefined })
    subscribers.value = data.items
    lastPage.value = data.meta.last_page
    total.value = data.meta.total
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

async function confirmUnsubscribe(): Promise<void> {
  if (!unsubscribeTarget.value) return
  unsubscribing.value = true
  try {
    await newsletterApi.unsubscribe(unsubscribeTarget.value.uuid)
    toastStore.success('Subscriber unsubscribed')
    unsubscribeModalOpen.value = false
    unsubscribeTarget.value = null
    await loadSubscribers()
  } catch (error) {
    toastStore.error(getErrorMessage(error))
  } finally {
    unsubscribing.value = false
  }
}

onMounted(loadSubscribers)
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="admin-page-title">Newsletter Subscribers</h2>
      <p class="admin-page-subtitle">Manage email subscribers</p>
    </div>

    <Table :loading="loading" :empty="!loading && subscribers.length === 0">
      <template #toolbar>
        <form class="flex gap-2" @submit.prevent="loadSubscribers">
          <Input v-model="search" placeholder="Search by email..." />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </template>

      <template #head>
        <th>Email</th>
        <th>Name</th>
        <th>Subscribed</th>
        <th>Status</th>
        <th class="text-right">Actions</th>
      </template>

      <tr v-for="subscriber in subscribers" :key="subscriber.uuid">
        <td class="font-medium">{{ subscriber.email }}</td>
        <td>{{ subscriber.name || '—' }}</td>
        <td>{{ formatDateTime(subscriber.subscribed_at) }}</td>
        <td>
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
            :class="subscriber.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
          >
            {{ subscriber.status }}
          </span>
        </td>
        <td class="text-right">
          <Button
            v-if="subscriber.status === 'subscribed'"
            variant="ghost"
            size="sm"
            @click="unsubscribeTarget = subscriber; unsubscribeModalOpen = true"
          >
            Unsubscribe
          </Button>
        </td>
      </tr>
    </Table>

    <Pagination v-model:page="page" :last-page="lastPage" :total="total" @update:page="loadSubscribers" />

    <Modal
      v-model="unsubscribeModalOpen"
      title="Unsubscribe user?"
      confirm-text="Unsubscribe"
      confirm-variant="danger"
      :loading="unsubscribing"
      @confirm="confirmUnsubscribe"
      @cancel="unsubscribeTarget = null"
    >
      <p class="text-sm text-slate-600">
        Unsubscribe <strong>{{ unsubscribeTarget?.email }}</strong> from the newsletter?
      </p>
    </Modal>
  </div>
</template>
