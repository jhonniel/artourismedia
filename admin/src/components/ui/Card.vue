<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    padding?: boolean
  }>(),
  {
    padding: true,
  },
)
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    :class="padding ? 'p-6' : ''"
  >
    <div v-if="title || subtitle || $slots.header" class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 v-if="title" class="text-base font-semibold text-slate-900">{{ title }}</h3>
        <p v-if="subtitle" class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
      </div>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>
