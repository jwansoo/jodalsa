<template>
  <div class="flex flex-col gap-10 p-6">
    <HeroBanner
      :free-round="21"
      @start-trial="scrollToTrial"
      @preview-book="router.push('/materials')"
      @close="heroDismissed = true"
    />

    <section
      v-if="heroDismissed"
      class="mx-auto max-w-3xl rounded-xl border border-primary/30 bg-linear-to-br from-primary/15 via-primary/5 to-transparent p-6 text-center shadow-sm"
    >
      <p class="font-semibold text-foreground">
        세계적으로 검증된 기술(<span class="text-primary">Vue.js, TypeScript, Supabase, Netlify, Resend</span>)을
        최신 버전으로 적용하여
      </p>
      <p class="mt-2 font-semibold text-foreground">
        <span class="text-primary">안정적인 오류 처리</span>와
        <span class="text-primary">엄격한 개인정보 보호</span> 위에서, 학습에만 집중하실 수 있는
        환경을 만들었습니다.
      </p>
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
        <p class="text-sm text-muted-foreground">
          시험 범위별 필기·핵심규정·실기 교재를 확인하세요.
        </p>
        <span
          class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
        >
          바로가기 <iconify-icon icon="lucide:arrow-right" />
        </span>
      </RouterLink>
    </section>

    <section id="trial" class="rounded-xl border bg-muted/30 p-6">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <span
          class="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
        >
          무료체험
        </span>
        <h2 class="text-2xl font-bold">모의고사 '무료체험'</h2>
      </div>
      <template v-if="user">
        <p class="mb-4 text-muted-foreground">
          모의고사를 체험해 보세요. 결과가 저장되어 나중에도 확인할 수 있습니다.
        </p>
        <ExamRunner round="21회차" start-collapsed />
      </template>
      <template v-else>
        <p class="mb-4 text-muted-foreground">
          회원가입 후 로그인하여 모의고사 무료체험을 이용하실 수 있습니다.
        </p>
        <RouterLink :to="{ name: '/register' }">
          <Button>회원가입 하러가기</Button>
        </RouterLink>
      </template>
    </section>

    <ChatWidget />

    <Dialog v-model:open="promoOpen">
      <DialogContent
        class="promo-dialog max-w-3xl overflow-hidden border-0 bg-transparent p-0 shadow-none"
      >
        <DialogTitle class="sr-only">회원가입 할인 안내</DialogTitle>
        <PromoBanner
          @claim="onPromoClaim"
          @trial="onPromoTrial"
          @dismiss-today="onPromoDismissToday"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
usePageStore().pageData.title = '홈'

const router = useRouter()
const { user } = storeToRefs(useAuthStore())

const scrollToTrial = () => {
  document.getElementById('trial')?.scrollIntoView({ behavior: 'smooth' })
}

const HERO_DISMISS_KEY = 'hero-banner-dismiss-date'

const isHeroDismissedToday = () => {
  try {
    return localStorage.getItem(HERO_DISMISS_KEY) === new Date().toDateString()
  } catch {
    return false
  }
}

const heroDismissed = ref(isHeroDismissedToday())

const PROMO_DISMISS_KEY = 'promo-banner-dismiss-date'

const isPromoDismissedToday = () => {
  try {
    return localStorage.getItem(PROMO_DISMISS_KEY) === new Date().toDateString()
  } catch {
    return false
  }
}

const promoOpen = ref(!isPromoDismissedToday())

const onPromoClaim = () => {
  promoOpen.value = false
  router.push('/purchase')
}

const onPromoTrial = () => {
  promoOpen.value = false
  nextTick(() => scrollToTrial())
}

const onPromoDismissToday = () => {
  promoOpen.value = false
  try {
    localStorage.setItem(PROMO_DISMISS_KEY, new Date().toDateString())
  } catch {
    // localStorage unavailable (private browsing etc.) — just close for this visit
  }
}

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

<style>
/* PromoBanner sits on a transparent DialogContent, so the close button can land on
   the dark overlay, the dark promo card, or (depending on theme) neither — give it
   its own opaque chip so it stays legible no matter what's behind it.
   Global (unscoped) on purpose: DialogContent is teleported through DialogPortal via a
   plain reka-ui DialogClose, so it never receives this component's scoped data-v-*
   attribute and a `scoped` + `:deep()` rule here can never match it. */
.promo-dialog [data-slot='dialog-close'] {
  padding: 4px;
  border-radius: 9999px;
  background-color: rgba(238, 241, 245, 0.92);
  color: #101a26;
}
.promo-dialog [data-slot='dialog-close']:hover {
  background-color: #eef1f5;
}
</style>
