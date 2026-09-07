<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'commit'): void
}>()

const isEditing = ref(false)
const draft = ref(props.modelValue)

const startEditing = () => {
  draft.value = props.modelValue
  isEditing.value = true
}

const commit = () => {
  isEditing.value = false
  if (draft.value === props.modelValue) return
  emit('update:modelValue', draft.value)
  emit('commit')
}

const cancel = () => {
  draft.value = props.modelValue
  isEditing.value = false
}
</script>

<template>
  <textarea
    v-if="isEditing"
    v-model="draft"
    autofocus
    :class="
      cn(
        'border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-3 md:text-sm',
        props.class,
      )
    "
    @blur="commit"
    @keydown.esc="cancel"
  />
  <button
    v-else
    type="button"
    :class="
      cn(
        '-mx-2 -my-1 w-full rounded-sm px-2 py-1 text-left whitespace-pre-wrap hover:bg-muted/50',
        props.class,
      )
    "
    @click="startEditing"
  >
    {{ modelValue || '—' }}
  </button>
</template>
