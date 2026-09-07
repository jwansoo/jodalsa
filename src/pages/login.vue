<script setup lang="ts">
import { useFormErrors } from '@/composables/formErrors'
import { login } from '@/utils/supaAuth'
import { watchDebounced } from '@vueuse/core'

const formData = ref({
  email: '',
  password: '',
})

const { serverError, handleServerError, handleLoginForm, realtimeErrors } = useFormErrors()
const router = useRouter()

// Debounce the form login handler to avoid excessive validation calls
watchDebounced(
  formData,
  () => {
    handleLoginForm(formData.value)
  },
  { debounce: 1000, deep: true },
)

const signin = async () => {
  const { error } = await login(formData.value)
  if (!error) return router.push('/')

  handleServerError(error)
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center -mt-20 min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl"> 로그인 </CardTitle>
        <CardDescription> 계정에 로그인하세요 </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <!-- <Button variant="outline" class="w-full"> 구글로 등록 </Button> -->
          <!-- <Separator label="또는" /> -->
        </div>

        <form class="grid gap-4" @submit.prevent="signin">
          <div class="grid gap-2">
            <Label id="email" class="text-left">이메일</Label>
            <Input
              type="email"
              placeholder="이메일 입력"
              required
              v-model="formData.email"
              :class="{ 'border-red-500': serverError }"
            />
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.email.length">
              <li v-for="error in realtimeErrors.email" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label id="password">비밀번호</Label>
              <a href="#" class="inline-block ml-auto text-xs underline"> 암호를 잊으셨나요? </a>
            </div>
            <Input
              id="password"
              type="password"
              autocomplete
              required
              v-model="formData.password"
              :class="{ 'border-red-500': serverError }"
            />
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.password.length">
              <li v-for="error in realtimeErrors.password" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <ul class="text-sm text-left text-red-500" v-if="serverError">
            <li class="list-disc">{{ serverError }}</li>
          </ul>
          <Button type="submit" class="w-full"> 로그인 </Button>
        </form>
        <div class="mt-4 text-sm text-center">
          계정이 없으신가요?
          <RouterLink to="/register" class="underline"> 계정 등록 </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
