<script setup lang="ts">
const model = defineModel<string | number | null>({ default: '' })

withDefaults(
  defineProps<{
    label?: string
    type?: string
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    id?: string
  }>(),
  {
    type: 'text',
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
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="admin-input"
      :class="error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''"
    />
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
