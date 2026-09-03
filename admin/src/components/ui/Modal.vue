<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import Button from './Button.vue'

const open = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    title?: string
    size?: 'sm' | 'md' | 'lg'
    showFooter?: boolean
    confirmText?: string
    cancelText?: string
    confirmVariant?: 'primary' | 'danger'
    loading?: boolean
  }>(),
  {
    size: 'md',
    showFooter: true,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
    loading: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    close()
  }
}

function close(): void {
  open.value = false
  emit('cancel')
}

function confirm(): void {
  emit('confirm')
}

watch(open, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="w-full rounded-xl bg-white shadow-xl"
          :class="sizeClasses[size]"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 v-if="title" class="text-lg font-semibold text-slate-900">{{ title }}</h2>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              @click="close"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-4">
            <slot />
          </div>

          <div
            v-if="showFooter || $slots.footer"
            class="flex justify-end gap-3 border-t border-slate-200 px-6 py-4"
          >
            <slot name="footer">
              <Button variant="outline" @click="close">{{ cancelText }}</Button>
              <Button
                :variant="confirmVariant"
                :loading="loading"
                @click="confirm"
              >
                {{ confirmText }}
              </Button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
