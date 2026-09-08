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

const { profile } = storeToRefs(useAuthStore())
const entitlements = useEntitlementsStore()
await entitlements.load()

const canAccess = (material: string) =>
  !!profile.value?.is_admin || entitlements.hasAnnual || entitlements.allowedMaterials.has(material)
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
        <span v-if="!canAccess('필기')" class="text-xs font-normal text-muted-foreground">
          (구매 필요)
        </span>
      </h2>
      <div v-if="canAccess('필기')" class="rounded-lg border">
        <CourseTree />
      </div>
      <div v-else class="flex flex-col items-start gap-2 rounded-lg border bg-muted/20 p-4 text-sm">
        <p class="text-muted-foreground">구매 후 이용 가능한 교재입니다.</p>
        <RouterLink :to="{ name: '/purchase/' }" class="text-primary underline">
          이용상품구매 바로가기
        </RouterLink>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="flex items-center gap-2 text-lg font-bold">
        <iconify-icon icon="lucide:scale" />
        핵심규정
        <span v-if="!canAccess('핵심규정')" class="text-xs font-normal text-muted-foreground">
          (구매 필요)
        </span>
      </h2>
      <div v-if="canAccess('핵심규정')" class="rounded-lg border p-2">
        <FlatMaterialList :items="coreRegulationList" />
      </div>
      <div v-else class="flex flex-col items-start gap-2 rounded-lg border bg-muted/20 p-4 text-sm">
        <p class="text-muted-foreground">구매 후 이용 가능한 교재입니다.</p>
        <RouterLink :to="{ name: '/purchase/' }" class="text-primary underline">
          이용상품구매 바로가기
        </RouterLink>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="flex items-center gap-2 text-lg font-bold">
        <iconify-icon icon="lucide:pencil" />
        실기
        <span v-if="!canAccess('실기')" class="text-xs font-normal text-muted-foreground">
          (구매 필요)
        </span>
      </h2>
      <div v-if="canAccess('실기')" class="rounded-lg border p-2">
        <FlatMaterialList :items="practicalMaterialList" />
      </div>
      <div v-else class="flex flex-col items-start gap-2 rounded-lg border bg-muted/20 p-4 text-sm">
        <p class="text-muted-foreground">구매 후 이용 가능한 교재입니다.</p>
        <RouterLink :to="{ name: '/purchase/' }" class="text-primary underline">
          이용상품구매 바로가기
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
