<template>
  <div>
    <iconify-icon icon="lucide:triangle-alert" class="error-icon" />
    <h1 class="error-code">{{ error.code }}</h1>
    <p class="error-msg">{{ error.msg }}</p>
    <div class="error-footer">
      <p class="error-footer-text">홈페이지에서 많은 것을 탐색해보세요.</p>
      <RouterLink to="/">
        <Button class="max-w-36"> 홈페이지로 가기 </Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
  customCode?: number
  code: string
  statusCode?: number
  hint: string | null
  details: string
  isCustomError?: boolean
}>()

const error = ref({
  code: 500,
  msg: '서버에서 알 수 없는 오류가 발생했습니다.',
})
if (props.isCustomError) {
  error.value.code = props.customCode ?? 500
  error.value.msg = props.message
}

if (props.statusCode === 406) {
  error.value.code = 404
  error.value.msg = '서버에서 알 수 없는 오류가 발생했습니다.'
}
</script>

<style scoped></style>
