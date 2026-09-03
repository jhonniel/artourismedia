<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    message: 'Loading...',
    size: 'md',
  },
)

const sizeClasses = {
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center" :class="sizeClasses[size]">
    <svg class="h-8 w-8 animate-spin text-primary-600" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <p v-if="message" class="mt-3 text-sm text-slate-500">{{ message }}</p>
  </div>
</template>
