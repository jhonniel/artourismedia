<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import type { PageMetadata } from '@/types'

const metadata = defineModel<PageMetadata>({ required: true })

function ensureMetadata(): void {
  metadata.value.values ??= []
  metadata.value.timeline ??= []
  metadata.value.team ??= []
}

function addValue(): void {
  ensureMetadata()
  metadata.value.values!.push({ title: '', description: '', icon: '' })
}

function addTimeline(): void {
  ensureMetadata()
  metadata.value.timeline!.push({ year: '', title: '', description: '' })
}

function addTeamMember(): void {
  ensureMetadata()
  metadata.value.team!.push({ name: '', role: '', bio: '' })
}

function removeAt<T>(items: T[] | undefined, index: number): void {
  items?.splice(index, 1)
}
</script>

<template>
  <Card title="Structured Sections">
    <p class="mb-4 text-sm text-slate-600">
      Optional content blocks for the About page layout (values, timeline, team).
    </p>

    <div class="space-y-8">
      <section>
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">Values</h3>
          <Button size="sm" variant="outline" @click="addValue">Add value</Button>
        </div>
        <div v-if="!(metadata.values?.length)" class="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          No values yet.
        </div>
        <div v-for="(value, index) in metadata.values" :key="`value-${index}`" class="mb-4 rounded-lg border border-slate-200 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase text-slate-500">Value {{ index + 1 }}</p>
            <Button size="sm" variant="ghost" class="text-red-600" @click="removeAt(metadata.values, index)">Remove</Button>
          </div>
          <Input v-model="value.title" label="Title" />
          <Input v-model="value.icon" label="Icon" hint="Emoji or short label" />
          <Textarea v-model="value.description" label="Description" rows="2" />
        </div>
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">Timeline</h3>
          <Button size="sm" variant="outline" @click="addTimeline">Add milestone</Button>
        </div>
        <div v-if="!(metadata.timeline?.length)" class="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          No timeline items yet.
        </div>
        <div v-for="(item, index) in metadata.timeline" :key="`timeline-${index}`" class="mb-4 rounded-lg border border-slate-200 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase text-slate-500">Milestone {{ index + 1 }}</p>
            <Button size="sm" variant="ghost" class="text-red-600" @click="removeAt(metadata.timeline, index)">Remove</Button>
          </div>
          <Input v-model="item.year" label="Year" />
          <Input v-model="item.title" label="Title" />
          <Textarea v-model="item.description" label="Description" rows="2" />
        </div>
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">Team</h3>
          <Button size="sm" variant="outline" @click="addTeamMember">Add member</Button>
        </div>
        <div v-if="!(metadata.team?.length)" class="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          No team members yet.
        </div>
        <div v-for="(member, index) in metadata.team" :key="`team-${index}`" class="mb-4 rounded-lg border border-slate-200 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase text-slate-500">Member {{ index + 1 }}</p>
            <Button size="sm" variant="ghost" class="text-red-600" @click="removeAt(metadata.team, index)">Remove</Button>
          </div>
          <Input v-model="member.name" label="Name" />
          <Input v-model="member.role" label="Role" />
          <Textarea v-model="member.bio" label="Bio" rows="3" />
        </div>
      </section>
    </div>
  </Card>
</template>
