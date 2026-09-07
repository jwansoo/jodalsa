import { updateYesangQuery, yesangsQuery, yesangQuery } from '@/utils/supaQuerys'
import type { Yesangs, Yesang } from '@/utils/supaQuerys'
import { useMemoize } from '@vueuse/core'
export const useJodalsaStore = defineStore('jodalsa-store', () => {
  const yesang = ref<Yesang | null>(null)
  const yesangs = ref<Yesangs | null>(null)
  const loadYesang = useMemoize(async (id: number) => await yesangQuery(id))
  const loadYesangs = useMemoize(async (_key: string) => await yesangsQuery)

  interface ValidateCacheParams<TKey, TData> {
    ref: Ref<TData | null>
    query:
      | PromiseLike<{ data: TData | null; error: unknown }>
      | ((key: TKey) => PromiseLike<{ data: TData | null; error: unknown }>)
    key: TKey
    loaderFn: { delete: (key: TKey) => void }
  }
  const validateCache = <TKey, TData>({
    ref,
    query,
    key,
    loaderFn,
  }: ValidateCacheParams<TKey, TData>) => {
    if (ref.value) {
      const finalQuery = typeof query === 'function' ? query(key) : query
      finalQuery.then(({ data, error }) => {
        if (JSON.stringify(ref.value) === JSON.stringify(data)) {
          return
        } else {
          loaderFn.delete(key)
          if (!error && data) ref.value = data
        }
      })
    }
  }

  const getTests = async () => {
    yesangs.value = null
    const { data, error, status } = await loadYesangs('yesangs')
    if (error) useErrorStore().setError({ error, customCode: status })
    if (data) yesangs.value = data

    validateCache({
      ref: yesangs,
      query: yesangsQuery,
      key: 'yesangs',
      loaderFn: loadYesangs,
    })
  }

  const getTest = async (id: number) => {
    yesang.value = null
    const { data, error, status } = await loadYesang(id)
    if (error) useErrorStore().setError({ error, customCode: status })
    if (data) yesang.value = data

    validateCache({
      ref: yesang,
      query: yesangQuery,
      key: id,
      loaderFn: loadYesang,
    })
  }

  const updateTest = async (updatedYesang: Yesang) => {
    const { id, ...yesangProperties } = updatedYesang
    const { error } = await updateYesangQuery(yesangProperties, id)
    if (error) useErrorStore().setError({ error })
    else await getTests()
  }

  return {
    yesang,
    yesangs,
    getTest,
    getTests,
    updateTest,
  }
})
