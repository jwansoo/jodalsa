import { supabase } from '@/lib/supabaseClient'
import type { LoginForm, RegisterForm } from '@/types/AuthForm'
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
      full_name: formData.firstName.concat(' ', formData.lastName),
      phone: formData.phone,
    })

    if (profileError) return { error: profileError }
  }

  return { error: null }
}

export const login = async (formData: LoginForm) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  return { error }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) return console.log(error)

  return true
}
