<template>
  <div>
    <Sidebar @test-clicked="testSheetOpen = true" />
    <AppNewTest v-model="testSheetOpen" />
    <div
      class="flex min-h-screen flex-col trancition-[margin]"
      :class="{ 'ml-52': menuOpen, 'ml-24': !menuOpen }"
    >
      <TopNavbar />
      <main class="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
        <div class="flex items-center">
          <!-- <h1 class="text-lg font-semibold md:text-2xl">{{ pageData.title }}</h1> -->
        </div>
        <slot />
      </main>
      <Footbar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { menuKey } from '@/utils/injectionKeys'

// const { pageData } = storeToRefs(usePageStore())
const testSheetOpen = ref(false)

const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)

provide(menuKey, {
  menuOpen,
  toggleMenu,
})
</script>

<style scoped></style>
