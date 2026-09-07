<template>
  <DataTable v-if="yesangs" :columns="columns" :data="yesangs" />
</template>

<script setup lang="ts">
import { yesangsColumns } from '@/utils/tableColumns/yesangsColumns'
import { useJodalsaStore } from '@/stores/loaders/jodalsa'
// import { useCollabs } from '@/composables/collabs'
usePageStore().pageData.title = '모의고사 문제들'

const yesangsLoader = useJodalsaStore()
const { yesangs } = storeToRefs(yesangsLoader)
const { getTests } = yesangsLoader

getTests()
const columns = yesangsColumns

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
