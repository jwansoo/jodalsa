<script setup lang="ts">
import { register } from '@/utils/supaAuth'

const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})
const router = useRouter()

const signup = async () => {
  const isRegistered = await register(formData.value)

  if (isRegistered) router.push('/')
}
</script>

<template>
  <div
    class="mx-auto w-full flex justify-center items-center p-10 text-center -mt-10 min-h-[90vh] h-full"
  >
    <Card class="max-w-sm w-full mx-auto h-full">
      <CardHeader>
        <CardTitle class="text-2xl">사용자 등록 </CardTitle>
        <CardDescription> 새로운 계정을 생성하세요 </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <!-- <Button variant="outline" class="w-full"> Register with Google </Button> -->
          <!-- <Separator label="Or" /> -->
        </div>
        <form class="grid gap-4" @submit.prevent="signup">
          <div class="grid gap-2">
            <Label id="username" class="text-left">사용자명</Label>
            <Input
              id="username"
              type="text"
              placeholder="전체 이름"
              required
              v-model="formData.username"
            />
          </div>
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div class="grid gap-2">
              <Label id="first_name" class="text-left">이름</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="이름 입력"
                required
                v-model="formData.firstName"
              />
            </div>
            <div class="grid gap-2">
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
          <div class="grid gap-2">
            <Label id="email" class="text-left">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일 입력"
              required
              v-model="formData.email"
            />
          </div>

          <div class="grid gap-2">
            <Label id="phone" class="text-left">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="전화번호 입력"
              required
              v-model="formData.phone"
            />
          </div>

          <div class="grid gap-2">
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

          <div class="grid gap-2">
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
          <Button type="submit" class="w-full"> 사용자 등록 </Button>
          <!-- <Button variant="outline" class="w-full"> Login with Google </Button> -->
        </form>
        <div class="mt-4 text-sm text-center">
          이미 계정이 있으신가요?
          <RouterLink to="/login" class="underline"> 로그인 </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
