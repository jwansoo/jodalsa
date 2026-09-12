<template>
  <metainfo></metainfo>
  <Transition name="fade" mode="out-in">
    <Component :is="showAuthLayout ? AuthLayout : GuestLayout" :key="user?.id">
      <AppErrorPage v-if="errorStore.activeError" />
      <RouterView v-else v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <div class="w-full" :key="route.path">
            <Suspense v-if="Component" :timeout="0">
              <component :is="Component" :key="route.name" />
              <template #fallback>
                <div
                  class="absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center w-full h-screen bg-background bg-opacity-90 z-50"
                >
                  <iconify-icon icon="lucide:loader-circle" class="text-6xl animate-spin" />
                </div>
              </template>
            </Suspense>
          </div>
        </Transition>
      </RouterView>
    </Component>
  </Transition>
</template>

<script setup lang="ts">
const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error })
})

onMounted(async () => {
  useAuthStore().trackAuthChanges()
})

const { user } = storeToRefs(useAuthStore())
const route = useRoute()
const showAuthLayout = computed(() => !!user.value || route.path === '/')

// 관리자용(/admin/*)과 일반 이용자용을 서로 다른 이름/아이콘으로 각각 홈 화면에 설치할 수 있도록,
// 현재 보고 있는 화면에 맞춰 PWA manifest를 바꿔 낍니다 — 관리자 화면에서 설치하면
// "조달컨설팅 관리자"(vite-plugin-pwa가 생성한 manifest.webmanifest, 시작화면 /admin/orders)가,
// 그 외 화면에서 설치하면 "공공조달관리사"(manifest-user.webmanifest, 시작화면 /)이 설치됩니다.
watch(
  () => route.path,
  (path) => {
    const href = path.startsWith('/admin') ? '/manifest.webmanifest' : '/manifest-user.webmanifest'
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'manifest'
      document.head.appendChild(link)
    }
    if (link.getAttribute('href') !== href) link.setAttribute('href', href)
  },
  { immediate: true },
)

const AuthLayout = defineAsyncComponent(() => import('./components/Layout/main/AuthLayout.vue'))
const GuestLayout = defineAsyncComponent(() => import('./components/Layout/main/GuestLayout.vue'))

useMeta({
  title: '조달관련 컨설팅',
  meta: [
    {
      name: 'description',
      content: '공공조달에 관한 컨설팅및 공공조달관리사 시험을 위한 교재,모의고사 등 지원 ',
    },
  ],
})
</script>

<style scoped></style>
