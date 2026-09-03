<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { HomepageSection } from '@/types'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import ImageUploader from '@/components/ui/ImageUploader.vue'

const props = defineProps<{
  section: HomepageSection
}>()

const emit = defineEmits<{
  'update:content': [content: Record<string, unknown>]
}>()

const content = ref<Record<string, unknown>>({ ...(props.section.content || {}) })

watch(
  () => props.section,
  (section) => {
    content.value = { ...(section.content || {}) }
  },
  { deep: true },
)

watch(content, (value) => emit('update:content', value), { deep: true })

const isHero = computed(() => props.section.type === 'hero')
const isAbout = computed(() => props.section.type === 'about')
const isSectionHeader = computed(() =>
  ['services', 'featured_projects', 'latest_insights'].includes(props.section.type),
)

function field(key: string) {
  return computed({
    get: () => (content.value[key] as string) || '',
    set: (val: string) => {
      content.value = { ...content.value, [key]: val }
    },
  })
}

const badgeText = field('badge_text')
const headline = field('headline')
const headlineAccent = field('headline_accent')
const subheadline = field('subheadline')
const ctaText = field('cta_text')
const ctaUrl = field('cta_url')
const secondaryCtaText = field('secondary_cta_text')
const secondaryCtaUrl = field('secondary_cta_url')
const imageAlt = field('image_alt')
const eyebrow = field('eyebrow')
const title = field('title')
const titleAccent = field('title_accent')
const body = field('body')
const description = field('description')

const imageUrl = computed({
  get: () => (content.value.image_url as string) || null,
  set: (val: string | null) => {
    content.value = { ...content.value, image_url: val || '' }
  },
})

const rawJson = computed({
  get: () => JSON.stringify(content.value, null, 2),
  set: (val: string) => {
    try {
      content.value = JSON.parse(val)
    } catch {
      /* ignore invalid JSON while typing */
    }
  },
})
</script>

<template>
  <div class="space-y-4">
    <template v-if="isHero">
      <Input v-model="badgeText" label="Badge / Eyebrow" />
      <Input v-model="headline" label="Headline" />
      <Input v-model="headlineAccent" label="Headline Accent (display text)" />
      <Textarea v-model="subheadline" label="Subheadline" rows="3" />
      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="ctaText" label="Primary CTA Text" />
        <Input v-model="ctaUrl" label="Primary CTA URL" />
        <Input v-model="secondaryCtaText" label="Secondary CTA Text" />
        <Input v-model="secondaryCtaUrl" label="Secondary CTA URL" />
      </div>
      <ImageUploader v-model="imageUrl" label="Hero Image" />
      <Input v-model="imageAlt" label="Image Alt Text" />
    </template>

    <template v-else-if="isAbout">
      <Input v-model="eyebrow" label="Eyebrow" />
      <Input v-model="title" label="Title" />
      <Input v-model="titleAccent" label="Title Accent" />
      <Textarea v-model="body" label="Body" rows="5" />
      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="ctaText" label="CTA Text" />
        <Input v-model="ctaUrl" label="CTA URL" />
      </div>
      <ImageUploader v-model="imageUrl" label="About Image" />
      <Input v-model="imageAlt" label="Image Alt Text" />
    </template>

    <template v-else-if="isSectionHeader">
      <Input v-model="eyebrow" label="Eyebrow" />
      <Input v-model="title" label="Title" />
      <Input v-model="titleAccent" label="Title Accent" />
      <Textarea v-model="description" label="Description" rows="3" />
      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="ctaText" label="CTA Text" />
        <Input v-model="ctaUrl" label="CTA URL" />
      </div>
    </template>

    <template v-else>
      <Textarea
        v-model="rawJson"
        label="Content (JSON)"
        rows="10"
        hint="Advanced: edit raw JSON for this section type"
      />
    </template>
  </div>
</template>
