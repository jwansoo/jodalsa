<script setup lang="ts">
import {
  addPartnerOrganizationQuery,
  deletePartnerOrganizationQuery,
  partnerOrganizationsQuery,
  type PartnerOrganizations,
} from '@/utils/supaQuerys'

usePageStore().pageData.title = '단체관리'

useMeta({
  title: '단체관리',
  meta: [
    {
      name: 'description',
      content: '단체가입(70% 할인) 대상 단체 명단 관리',
    },
  ],
})

const organizations = ref<PartnerOrganizations>([])
const newName = ref('')
const isSubmitting = ref(false)
const deletingId = ref<number | null>(null)
const error = ref('')

const load = async () => {
  const { data, error: loadError } = await partnerOrganizationsQuery
  if (loadError) useErrorStore().setError({ error: loadError })
  organizations.value = data ?? []
}

await load()

const addOrganization = async () => {
  const name = newName.value.trim()
  if (!name) return

  isSubmitting.value = true
  error.value = ''
  const { error: addError } = await addPartnerOrganizationQuery(name)
  isSubmitting.value = false

  if (addError) {
    error.value = addError.code === '23505' ? '이미 등록된 단체입니다.' : '등록에 실패했습니다.'
    return
  }
  newName.value = ''
  await load()
}

const removeOrganization = async (id: number) => {
  deletingId.value = id
  const { error: deleteError } = await deletePartnerOrganizationQuery(id)
  deletingId.value = null
  if (deleteError) {
    error.value = '삭제에 실패했습니다.'
    return
  }
  await load()
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
    <div>
      <h1 class="text-2xl font-bold">단체관리</h1>
      <p class="text-sm text-muted-foreground">
        여기 등록된 단체 소속(직장명) 회원만 이용상품구매에서 단체가입(70% 할인)을 선택할 수
        있습니다.
      </p>
    </div>

    <form class="flex gap-2" @submit.prevent="addOrganization">
      <Input v-model="newName" placeholder="단체명 입력" />
      <Button type="submit" :disabled="!newName.trim() || isSubmitting">추가</Button>
    </form>

    <ul class="text-sm text-left text-red-500" v-if="error">
      <li class="list-disc">{{ error }}</li>
    </ul>

    <ul v-if="organizations.length" class="flex flex-col gap-2">
      <li
        v-for="org in organizations"
        :key="org.id"
        class="flex items-center justify-between rounded-md border px-3 py-2"
      >
        <span>{{ org.name }}</span>
        <Button
          variant="outline"
          size="sm"
          :disabled="deletingId === org.id"
          @click="removeOrganization(org.id)"
        >
          삭제
        </Button>
      </li>
    </ul>
    <p v-else class="text-sm text-muted-foreground">등록된 단체가 없습니다.</p>
  </div>
</template>

<style scoped></style>
