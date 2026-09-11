<script setup lang="ts">
import { register } from '@/utils/supaAuth'

const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthdate: '',
  workplaceName: '',
  password: '',
  confirmPassword: '',
})
const router = useRouter()
const registerError = ref('')

const signup = async () => {
  registerError.value = ''
  const { error } = await register(formData.value)

  if (!error) {
    router.push('/')
    return
  }

  registerError.value =
    'code' in error && error.code === '23505'
      ? '이미 사용 중인 사용자명입니다.'
      : error.message === 'User already registered'
        ? '이미 가입된 이메일입니다.'
        : '가입에 실패했습니다. 잠시 후 다시 시도해주세요.'
}
</script>

<template>
  <div
    class="mx-auto w-full flex flex-col justify-center items-center p-6 text-center -mt-6 min-h-[84vh] h-full"
  >
    <Card class="max-w-[422px] w-full mx-auto h-full gap-4 py-4">
      <CardHeader>
        <CardTitle class="text-2xl">사용자 등록 </CardTitle>
        <CardDescription> 새로운 계정을 생성하세요 </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-2.5" @submit.prevent="signup">
          <div class="grid gap-1">
            <Label id="username" class="text-left">사용자명</Label>
            <Input
              id="username"
              type="text"
              placeholder="전체 이름"
              required
              v-model="formData.username"
            />
          </div>
          <div class="flex flex-col sm:flex-row justify-between gap-2.5 sm:gap-4">
            <div class="grid gap-1 w-full">
              <Label id="first_name" class="text-left">이름</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="이름 입력"
                required
                v-model="formData.firstName"
              />
            </div>
            <div class="grid gap-1 w-full">
              <Label id="last_name" class="text-left">성</Label>
              <Input
                id="last_name"
                type="text"
                placeholder="성 입력"
                required
                v-model="formData.lastName"
              />
            </div>
          </div>
          <div class="grid gap-1">
            <Label id="email" class="text-left">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일 입력"
              required
              v-model="formData.email"
            />
          </div>

          <div class="flex flex-col sm:flex-row justify-between gap-2.5 sm:gap-4">
            <div class="grid gap-1 w-full">
              <Label id="phone" class="text-left">전화번호</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="전화번호 입력"
                required
                v-model="formData.phone"
              />
            </div>
            <div class="grid gap-1 w-full">
              <Label id="birthdate" class="text-left">생년월일</Label>
              <Input id="birthdate" type="date" required v-model="formData.birthdate" />
            </div>
          </div>

          <div class="grid gap-1">
            <Label class="text-left">직장명 (단체 소속인 경우 선택, 아니면 직접 입력)</Label>
            <WorkplaceNameField v-model="formData.workplaceName" />
          </div>

          <div class="flex flex-col sm:flex-row justify-between gap-2.5 sm:gap-4">
            <div class="grid gap-1 w-full">
              <Label id="password" class="text-left">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="*****"
                autocomplete
                required
                v-model="formData.password"
              />
            </div>
            <div class="grid gap-1 w-full">
              <Label id="confirm_password" class="text-left">비밀번호 확인</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="*****"
                autocomplete
                required
                v-model="formData.confirmPassword"
              />
            </div>
          </div>
          <ul class="text-sm text-left text-red-500" v-if="registerError">
            <li class="list-disc">{{ registerError }}</li>
          </ul>
          <Button type="submit" class="w-full"> 사용자 등록 </Button>
        </form>
        <div class="mt-3 text-sm text-center">
          이미 계정이 있으신가요?
          <RouterLink to="/login" class="underline"> 로그인 </RouterLink>
        </div>
      </CardContent>
    </Card>
    <BackHomeLink />
  </div>
</template>
