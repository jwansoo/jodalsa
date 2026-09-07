<template>
  <div class="flex flex-col gap-6 p-6 text-base">
    <div class="flex flex-row items-center gap-4">
      <div class="text-2xl">모의고사 시험</div>
      <BaseSelect :options="lists" v-model="list" label="시험선택" />
    </div>

    <ExamRunner v-if="list" :key="list" :round="list" />
  </div>
</template>

<script setup lang="ts">
usePageStore().pageData.title = '모의고사 문제들'

const lists = ref([
  '1회차',
  '2회차',
  '3회차',
  '4회차',
  '5회차',
  '6회차',
  '7회차',
  '8회차',
  '9회차',
  '10회차',
])
const list = ref('')

useMeta({
  title: '공공조달관리사 모의평가',
  meta: [
    {
      name: 'description',
      content: '공공조달관리사 평가 시험을 위한 모의고사 문제 ',
    },
  ],
})
</script>

<style scoped></style>
