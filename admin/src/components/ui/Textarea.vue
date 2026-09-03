<script setup lang="ts">
const model = defineModel<string | null>({ default: '' })

withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    error?: string
    hint?: string
    rows?: number | string
    disabled?: boolean
    required?: boolean
    id?: string
  }>(),
  {
    rows: 4,
    disabled: false,
    required: false,
  },
)
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="admin-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="id"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="admin-input resize-y"
      :class="error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''"
    />
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
