import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastItem, ToastType } from '@/types'
import { generateId } from '@/utils/id'

export const useToastStore = defineStore('toast', () => {
  const items = ref<ToastItem[]>([])

  function show(type: ToastType, message: string, duration = 4000): void {
    const id = generateId()
    items.value.push({ id, type, message })

    window.setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  function success(message: string): void {
    show('success', message)
  }

  function error(message: string): void {
    show('error', message, 6000)
  }

  function warning(message: string): void {
    show('warning', message)
  }

  function info(message: string): void {
    show('info', message)
  }

  function dismiss(id: string): void {
    items.value = items.value.filter((item) => item.id !== id)
  }

  return { items, show, success, error, warning, info, dismiss }
})
