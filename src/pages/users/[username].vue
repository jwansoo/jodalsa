<script setup lang="ts">
import { profileQuery, updateProfileQuery } from '@/utils/supaQuerys'
import type { Tables } from 'database/types'

const { username } = useRoute('/users/[username]').params
const profile = ref<Tables<'profiles'> | null>(null)
const authStore = useAuthStore()
const isOwnProfile = computed(() => !!profile.value && authStore.profile?.id === profile.value.id)

const getTasks = async () => {
  const { data, error, status } = await profileQuery({
    column: 'username',
    value: username,
  })
  if (error) useErrorStore().setError({ error, customCode: status })
  profile.value = data || null
}

await getTasks()

const editOpen = ref(false)
const editError = ref('')
const editForm = ref({ username: '', full_name: '', bio: '', birthdate: '', workplace_name: '' })

const openEdit = () => {
  if (!profile.value) return
  editForm.value = {
    username: profile.value.username,
    full_name: profile.value.full_name,
    bio: profile.value.bio ?? '',
    birthdate: profile.value.birthdate ?? '',
    workplace_name: profile.value.workplace_name ?? '',
  }
  editError.value = ''
  editOpen.value = true
}

const submitEdit = async () => {
  if (!profile.value) return
  editError.value = ''

  const { data, error } = await updateProfileQuery(profile.value.id, {
    username: editForm.value.username.trim(),
    full_name: editForm.value.full_name.trim(),
    bio: editForm.value.bio.trim() || null,
    birthdate: editForm.value.birthdate || null,
    workplace_name: editForm.value.workplace_name.trim() || null,
  })

  if (error) {
    editError.value =
      error.code === '23505' ? '이미 사용 중인 사용자명입니다.' : '수정에 실패했습니다.'
    return
  }

  profile.value = data
  if (authStore.profile?.id === data.id) authStore.profile = data
  editOpen.value = false
}
</script>

<template>
  <div class="mx-auto mb-10 flex w-full flex-col items-center justify-center py-10 text-center">
    <div class="flex flex-col items-center justify-center pb-4">
      <Avatar class="size-20">
        <AvatarImage :src="profile?.avatar_url || ''" alt="@radix-vue" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <p class="mt-2 text-gray-500">@{{ profile?.username }}</p>
      <h1 class="mt-5 text-4xl font-bold">{{ profile?.full_name }}</h1>
      <p class="mt-2 text-sm">{{ profile?.bio || '' }}</p>
      <p v-if="isOwnProfile && profile?.birthdate" class="mt-2 text-sm text-gray-500">
        생년월일: {{ profile.birthdate }}
      </p>
      <p v-if="isOwnProfile && profile?.workplace_name" class="mt-2 text-sm text-gray-500">
        직장명: {{ profile.workplace_name }}
      </p>
    </div>
    <Button v-if="isOwnProfile" @click="openEdit">프로필 수정</Button>
    <BackHomeLink />

    <Dialog v-model:open="editOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>
        <form class="flex flex-col gap-4 text-left" @submit.prevent="submitEdit">
          <div class="grid gap-2">
            <Label>사용자명</Label>
            <Input v-model="editForm.username" required />
          </div>
          <div class="grid gap-2">
            <Label>이름</Label>
            <Input v-model="editForm.full_name" required />
          </div>
          <div class="grid gap-2">
            <Label>소개글</Label>
            <Input v-model="editForm.bio" />
          </div>
          <div class="grid gap-2">
            <Label>생년월일</Label>
            <Input type="date" v-model="editForm.birthdate" />
          </div>
          <div class="grid gap-2">
            <Label>직장명 (단체가입 시 필요)</Label>
            <WorkplaceNameField v-model="editForm.workplace_name" />
          </div>
          <ul class="text-sm text-left text-red-500" v-if="editError">
            <li class="list-disc">{{ editError }}</li>
          </ul>
          <DialogFooter>
            <Button type="submit">저장</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
