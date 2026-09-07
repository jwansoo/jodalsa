<template>
  <div class="flex flex-row text-xl w-24">
    <label class="w-16" v-if="label">{{ label }}</label>
    <input
      v-bind="$attrs"
      :value="modelValue"
      :placeholder="label"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    modelValue?: string | number
  }>(),
  {
    label: '',
    modelValue: '',
  },
)
</script>

<style scoped></style>
