<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient'
import {
  createInquiryThreadQuery,
  createInquiryMessageQuery,
  inquiryMessagesQuery,
  inquiryThreadQuery,
} from '@/utils/supaQuerys'
import type { Tables } from 'database/types'

const STORAGE_KEY = 'inquiry-thread-id'

const isOpen = ref(false)
const threadId = ref<string | null>(null)
const messages = ref<Tables<'inquiry_messages'>[]>([])
const name = ref('')
const contact = ref('')
const draft = ref('')

let channel: ReturnType<typeof supabase.channel> | null = null

const subscribeToMessages = (id: string) => {
  channel?.unsubscribe()
  channel = supabase
    .channel(`inquiry_messages_${id}`)
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
}

const loadThread = async (id: string) => {
  const { data } = await inquiryThreadQuery(id)
  if (!data) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  threadId.value = id
  const { data: messageRows, error } = await inquiryMessagesQuery(id)
  if (error) useErrorStore().setError({ error })
  messages.value = messageRows ?? []
  subscribeToMessages(id)
}

onMounted(() => {
  const savedId = localStorage.getItem(STORAGE_KEY)
  if (savedId) loadThread(savedId)
})

onUnmounted(() => channel?.unsubscribe())

const togglePanel = () => {
  isOpen.value = !isOpen.value
  // Clicking leaves the button focused, which keeps the CSS hover/focus
  // tooltip stuck visible after the panel closes unless we blur it here.
  ;(document.activeElement as HTMLElement | null)?.blur()
}

const startThread = async () => {
  if (!name.value.trim() || !draft.value.trim()) return

  const { data: thread, error } = await createInquiryThreadQuery({
    name: name.value.trim(),
    contact: contact.value.trim() || null,
  })
  if (error || !thread) {
    useErrorStore().setError({ error })
    return
  }

  localStorage.setItem(STORAGE_KEY, thread.id)
  threadId.value = thread.id
  subscribeToMessages(thread.id)

  const message = draft.value.trim()
  draft.value = ''
  const { data: messageRow, error: messageError } = await createInquiryMessageQuery({
    thread_id: thread.id,
    sender: 'visitor',
    message,
  })
  if (messageError) useErrorStore().setError({ error: messageError })
  else if (!messages.value.some((m) => m.id === messageRow.id)) messages.value.push(messageRow)
}

const sendMessage = async () => {
  if (!threadId.value || !draft.value.trim()) return

  const message = draft.value.trim()
  draft.value = ''
  const { data: messageRow, error } = await createInquiryMessageQuery({
    thread_id: threadId.value,
    sender: 'visitor',
    message,
  })
  if (error) useErrorStore().setError({ error })
  else if (!messages.value.some((m) => m.id === messageRow.id)) messages.value.push(messageRow)
}

const submit = () => (threadId.value ? sendMessage() : startThread())
</script>

<template>
  <div class="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
    <Card v-if="isOpen" class="flex h-96 w-80 flex-col gap-0 overflow-hidden py-0">
      <div class="border-b bg-muted/40 px-4 py-3 font-bold">문의하기</div>
      <div class="border-b bg-primary/5 px-4 py-2 text-xs text-muted-foreground">
        입금하셨다면 <strong class="text-foreground">'입금했다'</strong>라고 메시지를 남겨주세요.
        확인 후 바로 상품이용이 가능합니다.
      </div>
      <div class="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        <template v-if="messages.length">
          <div
            v-for="message in messages"
            :key="message.id"
            class="max-w-[85%] rounded-lg px-3 py-2 text-sm"
            :class="
              message.sender === 'admin'
                ? 'self-start bg-muted'
                : 'self-end bg-primary text-primary-foreground'
            "
          >
            {{ message.message }}
          </div>
        </template>
        <p v-else class="text-sm text-muted-foreground">
          문의하실 내용을 남겨주시면 답변드리겠습니다.
        </p>
      </div>
      <form class="flex flex-col gap-2 border-t p-3" @submit.prevent="submit">
        <template v-if="!threadId">
          <Input v-model="name" placeholder="이름" required />
          <Input v-model="contact" placeholder="연락처 (선택)" />
        </template>
        <div class="flex gap-2">
          <Input v-model="draft" placeholder="메시지를 입력하세요" required />
          <Button type="submit">전송</Button>
        </div>
      </form>
    </Card>
    <div class="group relative">
      <span
        class="pointer-events-none absolute top-1/2 right-full mr-2 -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        채팅
      </span>
      <Button
        size="icon"
        class="h-12 w-12 rounded-full shadow-lg"
        aria-label="채팅"
        @click="togglePanel"
      >
        <iconify-icon :icon="isOpen ? 'lucide:x' : 'lucide:message-circle'" class="text-xl" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
