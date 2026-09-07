<script setup lang="ts">
import { useJodalsaStore } from '@/stores/loaders/jodalsa'
import { createNewYesangsQuery, yesangsCountQuery } from '@/utils/supaQuerys'
import type { CreateNewTest } from '@/types/CreateNewForm'
const sheetOpen = defineModel<boolean>()

const createTest = async (yesang: CreateNewTest) => {
  const { count } = await yesangsCountQuery
  const { error } = await createNewYesangsQuery((count ?? 0) + 1, yesang)
  if (error) {
    useErrorStore().setError({ error })
  } else {
    sheetOpen.value = false
  }
}

const testsLoader = useJodalsaStore()
const { yesangs } = storeToRefs(testsLoader)
const { getTests } = testsLoader
getTests()
console.log(yesangs)

const items = ref([
  {
    title: '공공조달과 법제도 이해',
    items: [
      '공공조달 개요',
      '공공조달 원칙 및 방법',
      '전자조달시스템',
      '전략적 공공조달',
      '공공조달법률 이해',
      '공공조달관리',
    ],
  },
  {
    title: '공공조달 계획수립 및 분석',
    items: ['공공조달 계획', '조달요구 응대및 제안', '입찰.제안평가및 계약체결'],
  },
  {
    title: '공공계약관리',
    items: ['계약관리 일반절차', '물품 계약관리', '용역.다수공급자 계약관리'],
  },
])

const selectedSubject = ref('')
const subtitleOptions = computed(
  () => items.value.find((item) => item.title === selectedSubject.value)?.items ?? [],
)

const fieldClasses = {
  outerClass: 'max-w-[40em]!',
  wrapperClass: 'flex! flex-row! items-center! gap-2!',
  labelClass: "mb-0! shrink-0 whitespace-nowrap after:content-[':']",
  innerClass: 'flex-1!',
}
</script>

<template>
  <Dialog v-model:open="sheetOpen">
    <DialogContent class="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>Create New Test</DialogTitle>
      </DialogHeader>
      <FormKit type="form" @submit="createTest" submit-lanel="Create Task">
        <FormKit
          type="select"
          name="subject"
          id="subject"
          label="분류"
          placeholder="분류"
          v-model="selectedSubject"
          :options="items.map((item) => item.title)"
          v-bind="fieldClasses"
        />
        <FormKit
          type="select"
          name="subtitle"
          id="subtitle"
          label="세분류"
          placeholder="세분류"
          :options="subtitleOptions"
          v-bind="fieldClasses"
        />
        <FormKit
          type="textarea"
          name="question"
          id="question"
          label="질문"
          placeholder="질문"
          v-bind="fieldClasses"
        />
        <FormKit
          type="text"
          name="ga"
          id="name"
          label="가"
          placeholder="내용"
          v-bind="fieldClasses"
        />
        <FormKit
          type="text"
          name="na"
          id="name"
          label="나"
          placeholder="내용"
          v-bind="fieldClasses"
        />
        <FormKit
          type="text"
          name="da"
          id="name"
          label="다"
          placeholder="내용"
          v-bind="fieldClasses"
        />
        <FormKit
          type="text"
          name="la"
          id="name"
          label="라"
          placeholder="내용"
          v-bind="fieldClasses"
        />
        <FormKit
          type="textarea"
          name="answer"
          id="answer"
          label="정답"
          placeholder="정답"
          v-bind="fieldClasses"
        />
        <FormKit
          type="textarea"
          name="explanation"
          id="explanation"
          label="해설"
          placeholder="해설"
          v-bind="fieldClasses"
        />
        <FormKit
          type="text"
          name="note"
          id="note"
          label="주석"
          placeholder="주석"
          v-bind="fieldClasses"
        />
      </FormKit>
    </DialogContent>
  </Dialog>
</template>
