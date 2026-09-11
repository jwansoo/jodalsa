<script setup lang="ts">
import { partnerOrganizationsQuery, type PartnerOrganizations } from '@/utils/supaQuerys'

const modelValue = defineModel<string>({ default: '' })

const OTHER = '__other__'

const organizations = ref<PartnerOrganizations>([])
const selectValue = ref(OTHER)
const otherText = ref('')
let initialized = false

onMounted(async () => {
  const { data } = await partnerOrganizationsQuery
  organizations.value = data ?? []

  if (initialized) return
  initialized = true
  const match = organizations.value.find((org) => org.name === modelValue.value)
  if (match) {
    selectValue.value = match.name
  } else {
    selectValue.value = OTHER
    otherText.value = modelValue.value
  }
})

watch([selectValue, otherText], () => {
  modelValue.value = selectValue.value === OTHER ? otherText.value.trim() : selectValue.value
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <select
      v-model="selectValue"
      class="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
    >
      <option v-for="org in organizations" :key="org.id" :value="org.name">
        {{ org.name }}
      </option>
      <option :value="OTHER">기타 (직접 입력)</option>
    </select>
    <Input v-if="selectValue === OTHER" v-model="otherText" placeholder="소속 단체/직장명 입력" />
  </div>
</template>
