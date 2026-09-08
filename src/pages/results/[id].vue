<script setup lang="ts">
import { profileQuery, testResultsQuery } from '@/utils/supaQuerys'
import { isExamPassed } from '@/utils/examScoring'
import type { Tables } from 'database/types'

const { id } = useRoute('/results/[id]').params

const profile = ref<Tables<'profiles'> | null>(null)
const results = ref<Tables<'test_results'>[] | null>(null)

const isPassed = (result: Tables<'test_results'>) =>
  isExamPassed([result.first_class, result.second_class, result.third_class], result.average)

const sortedResults = computed(() =>
  [...(results.value ?? [])].sort((a, b) => parseInt(a.round) - parseInt(b.round)),
)

const load = async () => {
  const { data: profileData, error: profileError } = await profileQuery({
    column: 'id',
    value: id,
  })
  if (profileError) useErrorStore().setError({ error: profileError })
  profile.value = profileData || null
  if (!profile.value) return

  const { data, error } = await testResultsQuery(profile.value.username)
  if (error) useErrorStore().setError({ error })
  results.value = data ?? null
}

await load()

usePageStore().pageData.title = '시험결과분석'

useMeta({
  title: '시험결과분석',
  meta: [
    {
      name: 'description',
      content: '회차별 모의고사 결과 분석',
    },
  ],
})
</script>

<template>
  <div class="flex flex-col gap-6 p-6 text-base">
    <h1 class="text-2xl font-bold">{{ profile?.full_name }}님의 시험결과분석</h1>

    <template v-if="sortedResults.length">
      <div v-for="result in sortedResults" :key="result.id" class="rounded-md border p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">{{ result.round }}</h2>
          <span
            :class="isPassed(result) ? 'text-green-600 dark:text-green-400' : 'text-destructive'"
          >
            {{ isPassed(result) ? '합격' : '불합격' }}
          </span>
        </div>
        <ul class="mt-2 flex flex-col gap-1">
          <li>1교시: {{ result.first_class }}점</li>
          <li>2교시: {{ result.second_class }}점</li>
          <li>3교시: {{ result.third_class }}점</li>
          <li>평균: {{ result.average }}점</li>
        </ul>
        <pre class="mt-3 text-sm whitespace-pre-wrap text-muted-foreground">{{
          result.analysis
        }}</pre>
      </div>
    </template>
    <p v-else class="text-muted-foreground">아직 응시한 모의고사가 없습니다.</p>

    <BackHomeLink />
  </div>
</template>

<style scoped></style>
