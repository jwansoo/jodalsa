<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  items: {
    no: string
    subject: string
    subtitle: string
    question: string
    ga: string
    na: string
    da: string
    la: string
  }
}>()
const no = ref(props.items.no)
const question = ref(props.items.question)
const ga = ref(props.items.ga)
const na = ref(props.items.na)
const da = ref(props.items.da)
const la = ref(props.items.la)

watch(
  () => props.items.question,
  (value) => {
    question.value = value
  },
)
</script>

<template>
  <div>
    <form @submit.prevent="">
      <div class="flex flex-row">
        <BaseInput class="w-12" v-model="no" label="문제" type="text" />
        <BaseInput class="w-full" v-model="question" label="" type="textarea" />
      </div>
      <div class="mt-2 ml-4">
        <BaseInput class="w-full" v-model="ga" label="가" type="textarea" />
        <BaseInput class="w-full" v-model="na" label="나" type="textarea" />
        <BaseInput class="w-full" v-model="da" label="다" type="textarea" />
        <BaseInput class="w-full" v-model="la" label="라" type="textarea" />
      </div>
      <button type="submit">제출</button>
    </form>
  </div>
</template>

<style scoped>
.event-card {
  padding: 20px;
  width: 250px;
  cursor: pointer;
  border: 1px solid #39495c;
  margin-bottom: 18px;
}
.event-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
