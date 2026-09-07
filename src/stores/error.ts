import type { CustomError, ExtendedPostgrestError } from '@/types/Error'
import type { PostgrestError } from '@supabase/supabase-js'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError | ExtendedPostgrestError>(null)
  const isCustomError = ref(false)

  const setError = ({
    error,
    customCode,
  }: {
    error: string | PostgrestError | Error
    customCode?: number
  }) => {
    if (typeof error === 'string' || !('code' in error)) {
      isCustomError.value = typeof error === 'string'
      const customError =
        typeof error === 'string' ? (Error(error) as CustomError) : (error as CustomError)
      customError.customCode = customCode || 500
      activeError.value = customError
      return
    }

    const postgrestError = error as ExtendedPostgrestError
    postgrestError.statusCode = customCode || 500
    activeError.value = postgrestError
  }

  const clearError = () => {
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    setError,
    isCustomError,
    clearError,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
