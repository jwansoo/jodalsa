<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import {
  createInquiryMessageQuery,
  inquiryMessagesQuery,
  inquiryThreadQuery,
} from '@/utils/supaQuerys'
import type { Tables } from 'database/types'

const { id } = useRoute('/admin/inquiries/[id]').params

const thread = ref<Tables<'inquiry_threads'> | null>(null)
const messages = ref<Tables<'inquiry_messages'>[]>([])
const reply = ref('')

const load = async () => {
  const { data, error } = await inquiryThreadQuery(id)
  if (error) useErrorStore().setError({ error })
  thread.value = data ?? null

  const { data: messageRows, error: messagesError } = await inquiryMessagesQuery(id)
  if (messagesError) useErrorStore().setError({ error: messagesError })
  messages.value = messageRows ?? []
}

await load()

usePageStore().pageData.title = thread.value ? `${thread.value.name}님 문의` : '문의 상세'

const channel = supabase
  .channel(`admin_inquiry_messages_${id}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'inquiry_messages',
      filter: `thread_id=eq.${id}`,
    },
    (payload) => {
      const incoming = payload.new as Tables<'inquiry_messages'>
      if (messages.value.some((message) => message.id === incoming.id)) return
      messages.value.push(incoming)
    },
  )
  .subscribe()

onUnmounted(() => channel.unsubscribe())

const sendReply = async () => {
  const message = reply.value.trim()
  if (!message) return

  reply.value = ''
  const { data: messageRow, error } = await createInquiryMessageQuery({
    thread_id: id,
    sender: 'admin',
    message,
  })
  if (error) useErrorStore().setError({ error })
  else if (!messages.value.some((m) => m.id === messageRow.id)) messages.value.push(messageRow)
}

useMeta({
  title: '문의 상세',
  meta: [
    {
      name: 'description',
      content: '방문자 문의 상세 및 답변',
    },
  ],
})
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <div v-if="thread">
      <h1 class="text-2xl font-bold">{{ thread.name }}</h1>
      <p v-if="thread.contact" class="text-muted-foreground">{{ thread.contact }}</p>
    </div>

    <div class="flex flex-col gap-2 rounded-md border p-4">
      <div
        v-for="message in messages"
        :key="message.id"
        class="max-w-[70%] rounded-lg px-3 py-2 text-sm"
        :class="
          message.sender === 'admin'
            ? 'self-end bg-primary text-primary-foreground'
            : 'self-start bg-muted'
        "
      >
        {{ message.message }}
      </div>
      <p v-if="!messages.length" class="text-muted-foreground">메시지가 없습니다.</p>
    </div>

    <form class="flex gap-2" @submit.prevent="sendReply">
      <Input v-model="reply" placeholder="답변을 입력하세요" />
      <Button type="submit">답변 보내기</Button>
    </form>
  </div>
</template>

<style scoped></style>
