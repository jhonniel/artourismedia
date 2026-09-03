import type { Ref } from 'vue'
import { getErrorMessage } from '@/api/client'
import type { useToastStore } from '@/stores/toast'

type ToastStore = ReturnType<typeof useToastStore>

export function useReorder<T extends { uuid: string }>(
  items: Ref<T[]>,
  reorderFn: (uuids: string[]) => Promise<unknown>,
  toastStore: ToastStore,
) {
  async function moveItem(index: number, direction: -1 | 1): Promise<void> {
    const target = index + direction
    if (target < 0 || target >= items.value.length) return

    const list = [...items.value]
    ;[list[index], list[target]] = [list[target], list[index]]

    try {
      await reorderFn(list.map((item) => item.uuid))
      items.value = list
    } catch (error) {
      toastStore.error(getErrorMessage(error))
    }
  }

  return { moveItem }
}
