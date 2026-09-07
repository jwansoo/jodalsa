import type { LoginForm } from '@/types/AuthForm'
import type { AuthError } from '@supabase/supabase-js'

export const useFormErrors = () => {
  const serverError = ref('')
  const realtimeErrors = ref()
  const handleServerError = (error: AuthError) => {
    serverError.value =
      error.message === '잘못된 로그인 인증 정보'
        ? '이메일 또는 비밀번호가 잘못되었습니다.'
        : '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.'
  }

  const handleLoginForm = async (formData: LoginForm) => {
    realtimeErrors.value = {
      email: [],
      password: [],
    }

    const { validateEmail, validatePassword } = await import('@/utils/formValidations')

    const emailErrors = validateEmail(formData.email)
    if (emailErrors.length) realtimeErrors.value.email = emailErrors

    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length) realtimeErrors.value.password = passwordErrors
  }

  return {
    serverError,
    handleServerError,
    handleLoginForm,
    realtimeErrors,
  }
}
