<template>
  <label v-if="label" class="text-2xl">{{ label }}</label>
  <select
    class="bg-primary-500"
    :value="modelValue"
    v-bind="{
      ...$attrs,
      onChange: ($event) => {
        $emit('update:modelValue', ($event.target as HTMLSelectElement)?.value)
      },
    }"
  >
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    modelValue?: string | number
    options?: (string | number)[]
  }>(),
  {
    label: '',
    modelValue: '',
    options: () => [],
  },
)
</script>

<style scoped></style>
