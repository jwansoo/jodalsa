import { testQuery, testsQuery } from '@/utils/supaQuerys'
import type { Test, Tests } from '@/utils/supaQuerys'
import { useMemoize } from '@vueuse/core'
export const useTestsStore = defineStore('tests-store', () => {
  const test = ref<Test | null>(null)
  const tests = ref<Tests | null>(null)
  const loadTest = useMemoize(async (round: string) => await testQuery(round))
  const loadTests = useMemoize(async (_key: string) => await testsQuery)

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
    tests.value = null
    const { data, error, status } = await loadTests('tests')
    if (error) useErrorStore().setError({ error, customCode: status })
    if (data) tests.value = data

    validateCache({
      ref: tests,
      query: testsQuery,
      key: 'tests',
      loaderFn: loadTests,
    })
  }

  const getTest = async (round: string) => {
    test.value = null
    const { data, error, status } = await loadTest(String(round))
    if (error) useErrorStore().setError({ error, customCode: status })
    if (data) test.value = data

    validateCache({
      ref: test,
      query: (key: string) => testQuery(key),
      key: String(round),
      loaderFn: loadTest,
    })
  }

  return {
    test,
    tests,
    getTest,
    getTests,
  }
})
