<template>
  <div class="flex flex-col gap-10 p-6">
    <section
      class="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-primary/10 via-background to-background px-6 py-16 text-center"
    >
      <div class="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          공공조달관리사 자격시험
        </span>
        <h1 class="text-3xl font-bold sm:text-3xl">공공조달관리사, 조달컨설팅과 함께 준비하세요</h1>
        <p class="max-w-xl text-muted-foreground">
          모의고사, 수험교재까지 — 공공조달관리사 자격시험 준비에 필요한 모든 것을 한 곳에서
          제공합니다.
        </p>
        <div v-if="!user" class="flex gap-2">
          <RouterLink :to="{ name: '/register' }">
            <Button size="lg">회원가입</Button>
          </RouterLink>
          <RouterLink :to="{ name: '/login' }">
            <Button size="lg" variant="outline">로그인</Button>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <RouterLink
        :to="{ name: '/tests/' }"
        class="group rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      >
        <div
          class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
        >
          <iconify-icon icon="lucide:building-2" class="text-xl" />
        </div>
        <h2 class="mb-1 text-xl font-bold">모의고사</h2>
        <p class="text-sm text-muted-foreground">실전과 동일한 3교시 구성으로 실력을 점검하세요.</p>
        <span
          class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
        >
          바로가기 <iconify-icon icon="lucide:arrow-right" />
        </span>
      </RouterLink>
      <RouterLink
        :to="{ name: '/materials/' }"
        class="group rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      >
        <div
          class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
        >
          <iconify-icon icon="lucide:badge-check" class="text-xl" />
        </div>
        <h2 class="mb-1 text-xl font-bold">수험교재</h2>
        <p class="text-sm text-muted-foreground">시험 범위별 필기·핵심규정·실기 교재를 확인하세요.</p>
        <span
          class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
        >
          바로가기 <iconify-icon icon="lucide:arrow-right" />
        </span>
      </RouterLink>
    </section>

    <section class="rounded-xl border bg-muted/30 p-6">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <span
          class="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
        >
          무료체험
        </span>
        <h2 class="text-2xl font-bold">1회차 모의고사 무료체험</h2>
      </div>
      <p class="mb-4 text-muted-foreground">
        로그인 없이 1회차 모의고사를 체험해보세요. 로그인하면 결과가 저장되어 나중에도 확인할 수
        있습니다.
      </p>
      <ExamRunner round="1회차" start-collapsed />
    </section>

    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
usePageStore().pageData.title = '홈'

const { user } = storeToRefs(useAuthStore())

useMeta({
  title: '조달컨설팅 — 공공조달관리사 시험 준비',
  meta: [
    {
      name: 'description',
      content: '공공조달관리사 자격시험 준비를 위한 모의고사, 수험교재 안내',
    },
  ],
})
</script>

<style scoped></style>
