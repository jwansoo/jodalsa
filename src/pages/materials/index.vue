<script setup lang="ts">
import { coreRegulationList, practicalMaterialList } from '@/utils/courseList'

usePageStore().pageData.title = '수험교재'

useMeta({
  title: '수험교재',
  meta: [
    {
      name: 'description',
      content: '공공조달관리사 시험 범위와 교재 목차',
    },
  ],
})
</script>

<template>
  <div class="flex flex-col gap-8 p-6">
    <div>
      <h1 class="text-2xl font-bold">수험교재</h1>
      <p class="text-muted-foreground">시험 범위별 교재를 확인하세요.</p>
    </div>

    <section class="flex flex-col gap-3">
      <h2 class="flex items-center gap-2 text-lg font-bold">
        <iconify-icon icon="lucide:file-text" />
        필기
      </h2>
      <div class="rounded-lg border">
        <CourseTree />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="flex items-center gap-2 text-lg font-bold">
        <iconify-icon icon="lucide:scale" />
        핵심규정
      </h2>
      <div class="rounded-lg border p-2">
        <FlatMaterialList :items="coreRegulationList" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="flex items-center gap-2 text-lg font-bold">
        <iconify-icon icon="lucide:pencil" />
        실기
      </h2>
      <div class="rounded-lg border p-2">
        <FlatMaterialList :items="practicalMaterialList" />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
