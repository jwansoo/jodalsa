<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  />
  <label v-if="label">{{ label }}</label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    modelValue?: boolean
  }>(),
  {
    label: '',
    modelValue: false,
  },
)
</script>

<style scoped></style>
