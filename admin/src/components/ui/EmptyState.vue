<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    actionLabel?: string
  }>(),
  {
    title: 'Nothing here yet',
    description: 'Get started by creating your first item.',
  },
)

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
    <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <h3 class="text-base font-semibold text-slate-900">{{ title }}</h3>
    <p class="mt-1 max-w-sm text-sm text-slate-500">{{ description }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
    <slot />
  </div>
</template>
