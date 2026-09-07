<script setup lang="ts">
import type { Test } from '@/utils/supaQuerys'

const props = defineProps<{
  question: Test[number]
  modelValue?: string
  submitted?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const options = computed(() => [
  { key: '가', text: props.question.ga },
  { key: '나', text: props.question.na },
  { key: '다', text: props.question.da },
  { key: '라', text: props.question.la },
])
</script>

<template>
  <div class="border-b py-4">
    <p class="mb-3 text-lg font-medium">{{ question.no }}. {{ question.question }}</p>
    <div class="flex flex-col gap-3 pl-4">
      <label
        v-for="option in options"
        :key="option.key"
        class="flex items-center gap-2 text-[1.3rem]"
        :class="{
          'text-green-600 dark:text-green-400': submitted && option.key === question.answer,
          'text-destructive line-through':
            submitted && modelValue === option.key && option.key !== question.answer,
        }"
      >
        <input
          type="radio"
          :name="`q-${question.id}`"
          :value="option.key"
          :checked="modelValue === option.key"
          :disabled="submitted"
          @change="$emit('update:modelValue', option.key)"
        />
        {{ option.key }}. {{ option.text }}
      </label>
    </div>
  </div>
</template>
