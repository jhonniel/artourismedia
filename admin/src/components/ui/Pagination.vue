<script setup lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'

const props = withDefaults(
  defineProps<{
    page: number
    lastPage: number
    total: number
    perPage?: number
  }>(),
  {
    perPage: 15,
  },
)

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const from = computed(() => (props.page - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.page * props.perPage, props.total))

function goTo(page: number): void {
  if (page < 1 || page > props.lastPage || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <div
    v-if="lastPage > 1"
    class="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row"
  >
    <p class="text-sm text-slate-500">
      Showing <span class="font-medium text-slate-700">{{ from }}</span> to
      <span class="font-medium text-slate-700">{{ to }}</span> of
      <span class="font-medium text-slate-700">{{ total }}</span> results
    </p>

    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" :disabled="page <= 1" @click="goTo(page - 1)">
        Previous
      </Button>
      <span class="text-sm text-slate-600">Page {{ page }} of {{ lastPage }}</span>
      <Button variant="outline" size="sm" :disabled="page >= lastPage" @click="goTo(page + 1)">
        Next
      </Button>
    </div>
  </div>
</template>
