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
          <DropdownMenuItem @click="$emit('testClicked')">Test</DropdownMenuItem>
          <DropdownMenuItem>Project</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <nav class="flex flex-col gap-2 justify-between h-full relative">
      <div>
        <SidebarLinks :links="mainLinks" @actionClicked="executeMainAction" />
        <div v-if="showCourseList && menuOpen" class="pl-4">
          <SidebarLinks :links="writtenMaterialLinks" @actionClicked="executeMaterialAction" />
          <CourseTree v-if="showWrittenMaterials" />
          <SidebarLinks :links="coreRegulationLinks" @actionClicked="executeMaterialAction" />
          <FlatMaterialList v-if="showCoreRegulations" :items="coreRegulationList" />
          <SidebarLinks :links="practicalLinks" @actionClicked="executeMaterialAction" />
          <FlatMaterialList v-if="showPractical" :items="practicalMaterialList" />
        </div>
        <SidebarLinks :links="adminLinks" @actionClicked="executeMainAction" />
      </div>
      <div class="border-y text-center bg-background py-3">
        <SidebarLinks :links="accountLinks" @actionClicked="executeAction" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { coreRegulationList, practicalMaterialList } from '@/utils/courseList'
import { menuKey, type MenuInjectionOprions } from '@/utils/injectionKeys'
import { useWindowSize } from '@vueuse/core'
const { user, profile } = storeToRefs(useAuthStore())
const mainLinks = computed(() => [
  { title: '홈', to: '/', icon: 'lucide:house' },
  { title: '문제모음', to: '/jodalsa', icon: 'lucide:building' },
  { title: '모의고사', to: '/tests', icon: 'lucide:building-2' },
  { title: '수험교재', icon: 'lucide:badge-check' },
])
const adminLinks = computed(() =>
  profile.value?.is_admin
    ? [
        { title: '문의관리', to: '/admin/inquiries', icon: 'lucide:inbox' },
        { title: '사용설명서', to: '/admin/manual', icon: 'lucide:book-open' },
      ]
    : [],
)
const writtenMaterialLinks = computed(() => [{ title: '필기', icon: 'lucide:file-text' }])
const coreRegulationLinks = computed(() => [{ title: '핵심규정', icon: 'lucide:scale' }])
const practicalLinks = computed(() => [{ title: '실기', icon: 'lucide:pencil' }])
const { showCourseList } = storeToRefs(useCourseMaterialsStore())
const showWrittenMaterials = ref(false)
const showCoreRegulations = ref(false)
const showPractical = ref(false)
const router = useRouter()

const executeMainAction = (linkTitle: string) => {
  if (linkTitle !== '수험교재') return
  if (!user.value) {
    router.push('/login')
    return
  }
  showCourseList.value = !showCourseList.value
}

const executeMaterialAction = (linkTitle: string) => {
  if (linkTitle === '필기') showWrittenMaterials.value = !showWrittenMaterials.value
  else if (linkTitle === '핵심규정') showCoreRegulations.value = !showCoreRegulations.value
  else if (linkTitle === '실기') showPractical.value = !showPractical.value
}
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
