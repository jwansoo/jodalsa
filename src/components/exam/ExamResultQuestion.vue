<script setup lang="ts">
import type { Test } from '@/utils/supaQuerys'

const props = defineProps<{
  question: Test[number]
  selected?: string
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
    <ul class="flex flex-col gap-1 pl-4">
      <li
        v-for="option in options"
        :key="option.key"
        class="flex items-center gap-2 text-[1.3rem]"
        :class="{
          'text-destructive line-through':
            selected === option.key && option.key !== question.answer,
        }"
      >
        <span>{{ option.key }}. {{ option.text }}</span>
        <span v-if="option.key === question.answer" class="text-green-600 dark:text-green-400"
          >✓</span
        >
      </li>
    </ul>
    <div class="bg-muted/50 mt-3 ml-4 rounded-md border p-3 text-base">
      <p class="mb-1 font-semibold">해설</p>
      <p>{{ question.explanation || '해설이 없습니다.' }}</p>
    </div>
  </div>
</template>
