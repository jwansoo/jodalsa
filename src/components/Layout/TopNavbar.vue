<script setup lang="ts">
import { coreRegulationList, courseList, practicalMaterialList } from '@/utils/courseList'
import { searchYesangsQuery } from '@/utils/supaQuerys'
import { useDark, useToggle, watchDebounced } from '@vueuse/core'
import type { RouteLocationRaw } from 'vue-router'

const { profile } = storeToRefs(useAuthStore())
const router = useRouter()
const entitlements = useEntitlementsStore()
entitlements.load()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const canAccessMaterial = (category: string) =>
  !!profile.value?.is_admin || entitlements.hasAnnual || entitlements.allowedMaterials.has(category)

interface SearchResult {
  key: string
  title: string
  group: string
  to: RouteLocationRaw
}

const searchQuery = ref('')
const isSearchFocused = ref(false)
const yesangResults = ref<SearchResult[]>([])

const staticResults = computed<SearchResult[]>(() => {
  const query = searchQuery.value.trim()
  if (!query) return []

  const pages: SearchResult[] = [
    { key: 'page-home', title: '홈', group: '메뉴', to: { name: '/' } },
    { key: 'page-intro', title: '사이트소개', group: '메뉴', to: { name: '/intro' } },
    { key: 'page-tests', title: '모의고사', group: '메뉴', to: { name: '/tests/' } },
    { key: 'page-materials', title: '수험교재', group: '메뉴', to: { name: '/materials/' } },
    { key: 'page-purchase', title: '이용상품구매', group: '메뉴', to: { name: '/purchase/' } },
    { key: 'page-manual', title: '사용설명서', group: '메뉴', to: { name: '/manual' } },
  ]
  if (profile.value?.is_admin) {
    pages.push(
      { key: 'page-jodalsa', title: '문제모음', group: '메뉴', to: { name: '/jodalsa/' } },
      {
        key: 'page-inquiries',
        title: '문의관리',
        group: '메뉴',
        to: { name: '/admin/inquiries/' },
      },
      {
        key: 'page-organizations',
        title: '단체관리',
        group: '메뉴',
        to: { name: '/admin/organizations/' },
      },
    )
  }

  const materials: SearchResult[] = [
    ...(canAccessMaterial('필기')
      ? courseList.flatMap((subject) =>
          subject.children.map((title) => ({
            key: `material-${subject.title}-${title}`,
            title,
            group: '수험교재 · 필기',
            to: { name: '/materials/' } as RouteLocationRaw,
          })),
        )
      : []),
    ...(canAccessMaterial('핵심규정')
      ? coreRegulationList.map((item) => ({
          key: `material-core-${item.title}`,
          title: item.title,
          group: '수험교재 · 핵심규정',
          to: { name: '/materials/' } as RouteLocationRaw,
        }))
      : []),
    ...(canAccessMaterial('실기')
      ? practicalMaterialList.map((item) => ({
          key: `material-practical-${item.title}`,
          title: item.title,
          group: '수험교재 · 실기',
          to: { name: '/materials/' } as RouteLocationRaw,
        }))
      : []),
  ]

  return [...pages, ...materials].filter((result) => result.title.includes(query))
})

watchDebounced(
  searchQuery,
  async (query) => {
    const trimmed = query.trim()
    if (!trimmed || !profile.value?.is_admin) {
      yesangResults.value = []
      return
    }
    const { data } = await searchYesangsQuery(trimmed)
    yesangResults.value = (data ?? []).map((row) => ({
      key: `yesang-${row.id}`,
      title: row.question,
      group: `문제모음 · ${row.subject}`,
      to: { name: '/jodalsa/[id]', params: { id: row.id } },
    }))
  },
  { debounce: 300 },
)

const allResults = computed(() => [...staticResults.value, ...yesangResults.value])

const goToResult = (result: SearchResult) => {
  router.push(result.to)
  searchQuery.value = ''
  isSearchFocused.value = false
}

const onSearchBlur = () => {
  setTimeout(() => (isSearchFocused.value = false), 150)
}
</script>

<template>
  <nav class="h-16 border-b bg-muted/40 flex gap-2 justify-between px-6 items-center">
    <div class="flex items-center gap-3">
      <RouterLink
        :to="{ name: '/intro' }"
        class="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        사이트소개
      </RouterLink>

      <div class="relative h-fit w-full max-w-96" role="search">
        <iconify-icon
          class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
          icon="lucide:search"
        ></iconify-icon>
        <Input
          v-model="searchQuery"
          class="w-full pl-8 bg-background"
          type="text"
          placeholder="검색 ..."
          autocomplete="off"
          @focus="isSearchFocused = true"
          @blur="onSearchBlur"
          @keydown.enter.prevent="allResults[0] && goToResult(allResults[0])"
        />

        <div
          v-if="isSearchFocused && searchQuery.trim()"
          class="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md"
        >
          <ul v-if="allResults.length" class="max-h-80 overflow-y-auto py-1">
            <li v-for="result in allResults" :key="result.key">
              <button
                type="button"
                class="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted"
                @mousedown.prevent="goToResult(result)"
              >
                <span class="truncate">{{ result.title }}</span>
                <span class="text-xs text-muted-foreground">{{ result.group }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="px-3 py-2 text-sm text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center gap-1">
      <div class="w-8 gap-4">
        <DropdownMenu v-if="profile">
          <DropdownMenuTrigger>
            <iconify-icon icon="lucide:user"></iconify-icon>
            <!-- <Avatar>
              <AvatarImage
                :src="profile.avatar_url || 'wansoo.png'"
                :alt="`${profile.full_name} profile picture`"
              />
              <AvatarFallback class="w-16">CN</AvatarFallback>
            </Avatar> -->
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel class="bg-muted">나의 프로필</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RouterLink
                :to="{
                  name: '/users/[username]',
                  params: { username: profile.username },
                }"
                class="w-full h-full"
              >
                프로필
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RouterLink :to="{ name: '/orders/' }" class="w-full h-full"> 구매내역 </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RouterLink
                :to="{
                  name: '/results/[id]',
                  params: { id: profile.id },
                }"
                class="w-full h-full"
              >
                시험결과분석
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button @click="toggleDark()" class="w-8 h-8">
        <Transition name="scale" mode="out-in">
          <iconify-icon v-if="isDark" icon="lucide:sun"></iconify-icon>
          <iconify-icon v-else icon="lucide:moon"></iconify-icon>
        </Transition>
      </Button>
    </div>
  </nav>
</template>
