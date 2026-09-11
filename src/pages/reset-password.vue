<script setup lang="ts">
import { resetPassword } from '@/utils/supaAuth'
import { validatePassword } from '@/utils/formValidations'

const router = useRouter()
const { user } = storeToRefs(useAuthStore())

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

// The reset-password email link authenticates the browser (a recovery session) before this
// page renders — router guard's getSession() call already resolved it by the time we mount.
// No session here means the link was already used or has expired.
const invalidLink = computed(() => !success.value && !user.value)

const submit = async () => {
  error.value = ''

  const passwordErrors = validatePassword(password.value)
  if (passwordErrors.length) {
    error.value = passwordErrors[0] ?? ''
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  loading.value = true
  const { error: updateError } = await resetPassword(password.value)
  loading.value = false

  if (updateError) {
    error.value = '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.'
    return
  }

  success.value = true
}

const goHome = () => router.push('/')
</script>

<template>
  <div
    class="mx-auto flex w-full flex-col justify-center items-center p-10 text-center -mt-20 min-h-[90vh]"
  >
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <template v-if="success">
          <CardTitle class="text-2xl"> 비밀번호가 변경되었습니다 </CardTitle>
          <CardDescription> 새 비밀번호로 계속 이용하실 수 있습니다 </CardDescription>
        </template>
        <template v-else-if="invalidLink">
          <CardTitle class="text-2xl"> 유효하지 않은 링크입니다 </CardTitle>
          <CardDescription> 재설정 링크가 만료되었거나 이미 사용되었습니다 </CardDescription>
        </template>
        <template v-else>
          <CardTitle class="text-2xl"> 새 비밀번호 설정 </CardTitle>
          <CardDescription> 새로 사용할 비밀번호를 입력해주세요 </CardDescription>
        </template>
      </CardHeader>
      <CardContent v-if="success">
        <Button class="w-full" @click="goHome"> 홈으로 이동 </Button>
      </CardContent>
      <CardContent v-else-if="invalidLink">
        <RouterLink to="/forgot-password">
          <Button variant="outline" class="w-full"> 재설정 링크 다시 받기 </Button>
        </RouterLink>
      </CardContent>
      <CardContent v-else>
        <form class="grid gap-4" @submit.prevent="submit">
          <div class="grid gap-2">
            <Label id="password" class="text-left">새 비밀번호</Label>
            <Input
              id="password"
              type="password"
              autocomplete
              required
              v-model="password"
              :class="{ 'border-red-500': error }"
            />
          </div>
          <div class="grid gap-2">
            <Label id="confirm_password" class="text-left">새 비밀번호 확인</Label>
            <Input
              id="confirm_password"
              type="password"
              autocomplete
              required
              v-model="confirmPassword"
              :class="{ 'border-red-500': error }"
            />
          </div>
          <ul class="text-sm text-left text-red-500" v-if="error">
            <li class="list-disc">{{ error }}</li>
          </ul>
          <Button type="submit" class="w-full" :disabled="loading"> 비밀번호 변경 </Button>
        </form>
      </CardContent>
    </Card>
    <BackHomeLink />
  </div>
</template>
