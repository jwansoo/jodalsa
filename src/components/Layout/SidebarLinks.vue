<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      exact-active-class="text-primary bg-muted"
      :to="link.to"
      class="nav-link"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
    >
      <iconify-icon :icon="link.icon" />
      <span class="text-nowrap" :class="{ block: menuOpen, hidden: !menuOpen }">{{
        link.title
      }}</span>
    </RouterLink>
    <div
      v-else
      class="nav-link cursor-pointer"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
      @click="emitActionClicked(link.title)"
    >
      <iconify-icon :icon="link.icon" />
      <span class="text-nowrap" :class="{ block: menuOpen, hidden: !menuOpen }">{{
        link.title
      }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { menuKey, type MenuInjectionOprions } from '@/utils/injectionKeys'

interface LInkProps {
  title: string
  to?: string
  icon: string
}
defineProps<{
  links: LInkProps[]
}>()

const emits = defineEmits<{
  actionClicked: [string]
}>()

const emitActionClicked = (linkTitle: string) => {
  emits('actionClicked', linkTitle)
}

const { menuOpen } = inject(menuKey) as MenuInjectionOprions
</script>

<style scoped></style>
