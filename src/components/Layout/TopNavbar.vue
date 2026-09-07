<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const { profile } = storeToRefs(useAuthStore())

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <nav class="h-16 border-b bg-muted/40 flex gap-2 justify-between px-6 items-center">
    <form class="relative h-fit w-full max-w-96">
      <iconify-icon
        class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
        icon="lucide:search"
      ></iconify-icon>
      <Input class="w-full pl-8 bg-background" type="text" placeholder="Search ..." />
    </form>
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
