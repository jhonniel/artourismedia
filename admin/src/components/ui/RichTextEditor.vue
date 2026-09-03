<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Button from './Button.vue'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    minHeight?: string
  }>(),
  {
    placeholder: 'Write your content...',
    minHeight: '240px',
  },
)

const linkUrl = ref('')

const editor = useEditor({
  content: model.value,
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Image,
  ],
  editorProps: {
    attributes: {
      class: 'tiptap focus:outline-none',
      'data-placeholder': props.placeholder,
    },
  },
  onUpdate: ({ editor: ed }) => {
    model.value = ed.getHTML()
  },
})

watch(model, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value || '', { emitUpdate: false })
  }
})

function toggleBold(): void {
  editor.value?.chain().focus().toggleBold().run()
}

function toggleItalic(): void {
  editor.value?.chain().focus().toggleItalic().run()
}

function toggleHeading(level: 1 | 2): void {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

function toggleBulletList(): void {
  editor.value?.chain().focus().toggleBulletList().run()
}

function toggleOrderedList(): void {
  editor.value?.chain().focus().toggleOrderedList().run()
}

function toggleBlockquote(): void {
  editor.value?.chain().focus().toggleBlockquote().run()
}

function setLink(): void {
  if (!editor.value) return

  if (!linkUrl.value) {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: linkUrl.value })
    .run()
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div>
    <label v-if="label" class="admin-label">{{ label }}</label>
    <div class="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
      <div class="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <Button variant="ghost" size="sm" @click="toggleBold">Bold</Button>
        <Button variant="ghost" size="sm" @click="toggleItalic">Italic</Button>
        <Button variant="ghost" size="sm" @click="toggleHeading(1)">H1</Button>
        <Button variant="ghost" size="sm" @click="toggleHeading(2)">H2</Button>
        <Button variant="ghost" size="sm" @click="toggleBulletList">List</Button>
        <Button variant="ghost" size="sm" @click="toggleOrderedList">Numbered</Button>
        <Button variant="ghost" size="sm" @click="toggleBlockquote">Quote</Button>
        <div class="flex items-center gap-1">
          <input
            v-model="linkUrl"
            type="url"
            placeholder="https://"
            class="admin-input !py-1 text-xs"
            @keydown.enter.prevent="setLink"
          />
          <Button variant="ghost" size="sm" @click="setLink">Link</Button>
        </div>
      </div>
      <EditorContent
        :editor="editor"
        class="prose max-w-none"
        :style="{ minHeight }"
      />
    </div>
  </div>
</template>
