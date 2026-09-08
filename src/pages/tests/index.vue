<template>
  <div class="flex flex-col gap-6 p-6 text-base">
    <div class="flex flex-row items-center gap-4">
      <div class="text-2xl">모의고사 시험</div>
      <BaseSelect
        v-if="availableLists.length"
        :options="availableLists"
        v-model="list"
        label="시험선택"
      />
    </div>

    <p v-if="!availableLists.length" class="text-muted-foreground">
      구매한 모의고사 회차가 없습니다.
      <RouterLink :to="{ name: '/purchase/' }" class="text-primary underline">
        이용상품구매
      </RouterLink>
      에서 구매 후 이용해주세요.
    </p>

    <ExamRunner v-if="list" :key="list" :round="list" />
  </div>
</template>

<script setup lang="ts">
usePageStore().pageData.title = '모의고사 문제들'

const { profile } = storeToRefs(useAuthStore())
const entitlements = useEntitlementsStore()
await entitlements.load()

const allLists = [
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
]

const availableLists = computed(() => {
  if (profile.value?.is_admin || entitlements.hasAnnual) return allLists
  return allLists.filter((label) =>
    entitlements.allowedRounds.has(Number(label.replace('회차', ''))),
  )
})

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
