<script setup lang="ts">
import { useFormErrors } from '@/composables/formErrors'
import { login, verifyLoginOtp } from '@/utils/supaAuth'
import { watchDebounced } from '@vueuse/core'

const formData = ref({
  email: '',
  password: '',
})

const { mapServerError, handleLoginForm, realtimeErrors } = useFormErrors()
const router = useRouter()
const route = useRoute()

const otpCode = ref('')
const otpError = ref('')

// login() briefly signs the user in (to check trusted_devices) then signs back out for an
// untrusted device — that flips App.vue's `:key="user?.id"` layout key twice and remounts
// this whole page, wiping any local ref set afterward. Route query state survives that
// remount, so both the pending-OTP step and the post-login error live there instead of in
// local refs.
const otpEmail = computed(() => (typeof route.query.otpEmail === 'string' ? route.query.otpEmail : ''))
const otpRequired = computed(() => !!otpEmail.value)
const serverError = computed(() =>
  typeof route.query.loginError === 'string' ? route.query.loginError : '',
)

// Debounce the form login handler to avoid excessive validation calls
watchDebounced(
  formData,
  () => {
    handleLoginForm(formData.value)
  },
  { debounce: 1000, deep: true },
)

const signin = async () => {
  const result = await login(formData.value)
  if (result.status === 'success') return router.push('/')
  if (result.status === 'otp_required') {
    return router.replace({ name: '/login', query: { otpEmail: result.email } })
  }

  return router.replace({ name: '/login', query: { loginError: mapServerError(result.error) } })
}

const confirmOtp = async () => {
  otpError.value = ''
  const { error } = await verifyLoginOtp(otpEmail.value, otpCode.value)
  if (!error) return router.push('/')

  otpError.value = '인증코드가 올바르지 않거나 만료되었습니다. 다시 시도해주세요.'
}

const cancelOtp = () => router.replace({ name: '/login', query: {} })
</script>

<template>
  <div
    class="mx-auto flex w-full flex-col justify-center items-center p-10 text-center -mt-20 min-h-[90vh]"
  >
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <template v-if="!otpRequired">
          <CardTitle class="text-2xl"> 로그인 </CardTitle>
          <CardDescription> 계정에 로그인하세요 </CardDescription>
        </template>
        <template v-else>
          <CardTitle class="text-2xl"> 이메일을 확인해주세요 </CardTitle>
          <CardDescription> 처음 사용하는 기기라 본인 확인이 필요합니다 </CardDescription>
        </template>
      </CardHeader>
      <CardContent v-if="!otpRequired">
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
              <RouterLink to="/forgot-password" class="inline-block ml-auto text-xs underline">
                암호를 잊으셨나요?
              </RouterLink>
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
      <CardContent v-else>
        <p class="text-sm mb-4 rounded-md border bg-muted/50 p-3 text-left">
          <strong>{{ otpEmail }}</strong
          >로 인증코드를 보내드렸습니다. 메일함(스팸함 포함)을 확인하신 후, 메일에 적힌 코드를 아래
          입력해주세요.
        </p>
        <form class="grid gap-4" @submit.prevent="confirmOtp">
          <div class="grid gap-2">
            <Label id="otp" class="text-left">인증코드</Label>
            <Input
              id="otp"
              type="text"
              inputmode="numeric"
              placeholder="인증코드 입력"
              required
              v-model="otpCode"
              :class="{ 'border-red-500': otpError }"
            />
          </div>
          <ul class="text-sm text-left text-red-500" v-if="otpError">
            <li class="list-disc">{{ otpError }}</li>
          </ul>
          <Button type="submit" class="w-full"> 확인 </Button>
          <Button type="button" variant="outline" class="w-full" @click="cancelOtp">
            취소
          </Button>
        </form>
      </CardContent>
    </Card>
    <BackHomeLink />
  </div>
</template>
