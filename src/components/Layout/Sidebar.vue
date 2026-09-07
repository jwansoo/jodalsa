<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 transition-[width]"
    :class="{ 'w-52': menuOpen, 'w-24': !menuOpen }"
  >
    <div class="flex h-16 items-center border-b px-2 lg:px-4 shrink-0 gap-1 justify-between">
      <Button @click="toggleMenu" variant="outline" size="icon" class="w-8 h-8">
        <iconify-icon icon="lucide:menu" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon" class="w-8 h-8">
            <iconify-icon icon="lucide:plus" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem :disabled="!profile?.is_admin" @click="$emit('testClicked')">
            Test
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <nav class="flex flex-col gap-2 justify-between h-full relative">
      <div>
        <SidebarLinks :links="mainLinks" />
        <SidebarLinks :links="adminLinks" />
      </div>
      <div class="border-y text-center bg-background py-3">
        <SidebarLinks :links="accountLinks" @actionClicked="executeAction" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { menuKey, type MenuInjectionOprions } from '@/utils/injectionKeys'
import { useWindowSize } from '@vueuse/core'
const { profile } = storeToRefs(useAuthStore())
const mainLinks = computed(() => [
  { title: '홈', to: '/', icon: 'lucide:house' },
  ...(profile.value?.is_admin
    ? [{ title: '문제모음', to: '/jodalsa', icon: 'lucide:building' }]
    : []),
  { title: '모의고사', to: '/tests', icon: 'lucide:building-2' },
  { title: '수험교재', to: '/materials', icon: 'lucide:badge-check' },
])
const adminLinks = computed(() =>
  profile.value?.is_admin
    ? [
        { title: '문의관리', to: '/admin/inquiries', icon: 'lucide:inbox' },
        { title: '사용설명서', to: '/admin/manual', icon: 'lucide:book-open' },
      ]
    : [],
)
const router = useRouter()

const accountLinks = computed(() =>
  profile.value
    ? [
        { title: '프로필', to: `/users/${profile.value.username}`, icon: 'lucide:user' },
        // { title: '설정', to: '/settings', icon: 'lucide:settings' },
        { title: '로그아웃', icon: 'lucide:log-out' },
      ]
    : [{ title: '로그인', to: '/login', icon: 'lucide:log-in' }],
)

const executeAction = async (linkTitle: string) => {
  if (linkTitle === '로그아웃') {
    const { logout } = await import('@/utils/supaAuth')
    const isLoggedOut = await logout()
    if (isLoggedOut) router.push('/login')
  }
}
defineEmits(['testClicked'])

const { menuOpen, toggleMenu } = inject(menuKey) as MenuInjectionOprions
const windowWidth = useWindowSize().width

watchEffect(() => {
  if (windowWidth.value > 1024) {
    menuOpen.value = true
  } else {
    menuOpen.value = false
  }
})
</script>

<style scoped></style>
