import { supabase } from '@/lib/supabaseClient'
import type { LoginForm, RegisterForm } from '@/types/AuthForm'
import { getDeviceId } from '@/utils/deviceId'
import { trustDeviceQuery, trustedDeviceQuery } from '@/utils/supaQuerys'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'

export const register = async (
  formData: RegisterForm,
): Promise<{ error: AuthError | PostgrestError | null }> => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (error) return { error }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: formData.username,
      full_name: formData.lastName.concat(' ', formData.firstName),
      phone: formData.phone,
      birthdate: formData.birthdate,
    })

    if (profileError) return { error: profileError }

    // The device used to register is trusted immediately — no OTP challenge on first login.
    await trustDeviceQuery(data.user.id, getDeviceId(), navigator.userAgent)
  }

  return { error: null }
}

export type LoginResult =
  | { status: 'success'; error: null }
  | { status: 'otp_required'; error: null; email: string }
  | { status: 'error'; error: AuthError }

// TEMPORARY — PG(결제) 심사용 계정은 심사자가 다른 기기에서 로그인해도 OTP 메일을 받을 수 없으므로
// 기기신뢰 확인을 건너뛴다. PG 심사가 끝나면 이 상수와 아래 분기를 반드시 삭제할 것.
const OTP_BYPASS_EMAILS = ['pgtest@jodalsa.com']

export const login = async (formData: LoginForm): Promise<LoginResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) return { status: 'error', error }

  if (OTP_BYPASS_EMAILS.includes(formData.email)) {
    return { status: 'success', error: null }
  }

  const deviceId = getDeviceId()
  const { data: trustedDevice } = await trustedDeviceQuery(data.user.id, deviceId)

  if (trustedDevice) {
    await trustDeviceQuery(data.user.id, deviceId, navigator.userAgent)
    return { status: 'success', error: null }
  }

  // Unrecognized device — drop the session and require an email OTP before granting access.
  await supabase.auth.signOut()
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: formData.email,
    options: { shouldCreateUser: false },
  })
  if (otpError) return { status: 'error', error: otpError }

  return { status: 'otp_required', error: null, email: formData.email }
}

export const verifyLoginOtp = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  if (error || !data.user) return { error: error ?? new Error('인증에 실패했습니다.') }

  await trustDeviceQuery(data.user.id, getDeviceId(), navigator.userAgent)
  return { error: null }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) return console.log(error)

  return true
}
