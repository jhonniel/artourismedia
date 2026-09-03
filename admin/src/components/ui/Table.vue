<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    empty?: boolean
    emptyMessage?: string
  }>(),
  {
    loading: false,
    empty: false,
    emptyMessage: 'No records found',
  },
)
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div v-if="$slots.toolbar" class="border-b border-slate-200 px-4 py-3">
      <slot name="toolbar" />
    </div>

    <div v-if="loading" class="flex items-center justify-center py-16">
      <svg class="h-8 w-8 animate-spin text-primary-600" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="empty" class="px-6 py-16 text-center text-sm text-slate-500">
      {{ emptyMessage }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <slot name="head" />
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          <slot />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
:deep(th) {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(100 116 139);
}

:deep(td) {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(51 65 85);
}
</style>
