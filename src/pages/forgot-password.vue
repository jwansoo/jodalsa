<script setup lang="ts">
import { requestPasswordReset } from '@/utils/supaAuth'
import { validateEmail } from '@/utils/formValidations'

const email = ref('')
const error = ref('')
const sent = ref(false)
const loading = ref(false)

const submit = async () => {
  error.value = ''

  const emailErrors = validateEmail(email.value)
  if (emailErrors.length) {
    error.value = emailErrors[0] ?? ''
    return
  }

  loading.value = true
  const { error: resetError } = await requestPasswordReset(email.value.trim())
  loading.value = false

  if (resetError) {
    error.value = '재설정 링크 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'
    return
  }

  sent.value = true
}
</script>

<template>
  <div
    class="mx-auto flex w-full flex-col justify-center items-center p-10 text-center -mt-20 min-h-[90vh]"
  >
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <template v-if="!sent">
          <CardTitle class="text-2xl"> 비밀번호 재설정 </CardTitle>
          <CardDescription> 가입한 이메일로 재설정 링크를 보내드립니다 </CardDescription>
        </template>
        <template v-else>
          <CardTitle class="text-2xl"> 이메일을 확인해주세요 </CardTitle>
          <CardDescription> 비밀번호 재설정 링크를 보내드렸습니다 </CardDescription>
        </template>
      </CardHeader>
      <CardContent v-if="!sent">
        <form class="grid gap-4" @submit.prevent="submit">
          <div class="grid gap-2">
            <Label id="email" class="text-left">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="가입한 이메일 입력"
              required
              v-model="email"
              :class="{ 'border-red-500': error }"
            />
          </div>
          <ul class="text-sm text-left text-red-500" v-if="error">
            <li class="list-disc">{{ error }}</li>
          </ul>
          <Button type="submit" class="w-full" :disabled="loading"> 재설정 링크 보내기 </Button>
        </form>
        <div class="mt-4 text-sm text-center">
          <RouterLink to="/login" class="underline"> 로그인으로 돌아가기 </RouterLink>
        </div>
      </CardContent>
      <CardContent v-else>
        <p class="text-sm mb-4 rounded-md border bg-muted/50 p-3 text-left">
          <strong>{{ email }}</strong
          >로 비밀번호 재설정 링크를 보내드렸습니다. 메일함(스팸함 포함)을 확인하신 후, 메일 속
          링크를 눌러 새 비밀번호를 설정해주세요.
        </p>
        <RouterLink to="/login">
          <Button variant="outline" class="w-full"> 로그인으로 돌아가기 </Button>
        </RouterLink>
      </CardContent>
    </Card>
    <BackHomeLink />
  </div>
</template>
