<template>
  <component
    v-for="option in options"
    :key="option.value"
    :is="vertical ? 'div' : 'span'"
    :class="{ horizontal: !vertical }"
  >
    <BaseRadio
      :label="option.label"
      :value="option.value"
      :modelValue="modelValue"
      :name="name"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    options: Array<{
      label: string
      value: string | number
    }>
    name: string
    modelValue?: string | number
    vertical: boolean
  }>(),
  {
    option: '',
    name: '',
    modelValue: '',
    vertical: false,
  },
)
</script>

<style scoped></style>
