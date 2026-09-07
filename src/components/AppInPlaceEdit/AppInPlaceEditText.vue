<script setup lang="ts">
const props = defineProps<{
  modelValue: string
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
  <Input
    v-if="isEditing"
    v-model="draft"
    autofocus
    @blur="commit"
    @keydown.enter="commit"
    @keydown.esc="cancel"
  />
  <button
    v-else
    type="button"
    class="-mx-2 -my-1 w-full rounded-sm px-2 py-1 text-left hover:bg-muted/50"
    @click="startEditing"
  >
    {{ modelValue || '—' }}
  </button>
</template>
