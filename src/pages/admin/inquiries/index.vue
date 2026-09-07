<script setup lang="ts">
import { inquiryThreadsQuery } from '@/utils/supaQuerys'
import type { Tables } from 'database/types'

usePageStore().pageData.title = '문의 관리'

const threads = ref<Tables<'inquiry_threads'>[]>([])

const load = async () => {
  const { data, error } = await inquiryThreadsQuery
  if (error) useErrorStore().setError({ error })
  threads.value = data ?? []
}

await load()

useMeta({
  title: '문의 관리',
  meta: [
    {
      name: 'description',
      content: '방문자 문의 목록',
    },
  ],
})
</script>

<template>
  <div class="flex flex-col gap-2 p-6">
    <RouterLink
      v-for="thread in threads"
      :key="thread.id"
      :to="{ name: '/admin/inquiries/[id]', params: { id: thread.id } }"
      class="rounded-md border p-4 hover:bg-muted"
    >
      <div class="flex items-center justify-between">
        <span class="font-bold">{{ thread.name }}</span>
        <span class="text-sm text-muted-foreground">{{
          new Date(thread.created_at).toLocaleString('ko-KR')
        }}</span>
      </div>
      <p v-if="thread.contact" class="text-sm text-muted-foreground">{{ thread.contact }}</p>
    </RouterLink>
    <p v-if="!threads.length" class="text-muted-foreground">아직 문의가 없습니다.</p>
  </div>
</template>

<style scoped></style>
