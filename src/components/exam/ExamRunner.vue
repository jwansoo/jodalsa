<script setup lang="ts">
import { useTestsStore } from '@/stores/loaders/tests'
import { useCountdown } from '@/composables/useCountdown'
import { upsertTestResultQuery, type Test } from '@/utils/supaQuerys'
import { isExamPassed } from '@/utils/examScoring'

const props = withDefaults(defineProps<{ round: string; startCollapsed?: boolean }>(), {
  startCollapsed: false,
})

const testLoader = useTestsStore()
const { test } = storeToRefs(testLoader)
const { getTest } = testLoader

getTest(props.round)

const TOTAL_EXAM_MINUTES = 120
const PERIOD_SIZES = [30, 20, 30]
const TOTAL_QUESTIONS = PERIOD_SIZES.reduce((sum, size) => sum + size, 0)
const PERIODS = PERIOD_SIZES.map((count, index) => ({
  label: `${index + 1}교시`,
  count,
  minutes: (TOTAL_EXAM_MINUTES * count) / TOTAL_QUESTIONS,
}))

const getPeriod = (index: number) => {
  const period = PERIODS[index]
  if (!period) throw new Error(`Invalid period index: ${index}`)
  return period
}

const sortedQuestions = computed(() => [...(test.value ?? [])].sort((a, b) => a.no - b.no))

const periodQuestions = computed(() => {
  const groups: Test[] = []
  let index = 0
  for (const size of PERIOD_SIZES) {
    groups.push(sortedQuestions.value.slice(index, index + size))
    index += size
  }
  return groups
})

const submittedPeriods = ref([false, false, false])
const answers = ref<Record<number, string>>({})
const viewedPeriod = ref<number | null>(props.startCollapsed ? null : 0)
const showResultSheet = ref(false)
const showAnalysis = ref(false)

const toggleResultSheet = () => {
  showResultSheet.value = !showResultSheet.value
  if (showResultSheet.value) showAnalysis.value = false
}

const toggleAnalysis = () => {
  showAnalysis.value = !showAnalysis.value
  if (showAnalysis.value) showResultSheet.value = false
}
const activePeriod = computed(() => submittedPeriods.value.findIndex((submitted) => !submitted))

const timer = useCountdown(() => submitPeriod(activePeriod.value))
const { isRunning: timerIsRunning } = timer

watch(test, (rows) => {
  if (!rows?.length) return
  submittedPeriods.value = [false, false, false]
  answers.value = {}
  viewedPeriod.value = props.startCollapsed ? null : 0
  showResultSheet.value = false
  showAnalysis.value = false
  timer.start(getPeriod(0).minutes * 60)
})

watch(activePeriod, (index) => {
  if (index !== -1) {
    viewedPeriod.value = index
    return
  }
  saveResult()
})

const submitPeriod = (index: number) => {
  if (index === -1 || submittedPeriods.value[index]) return
  submittedPeriods.value[index] = true
  timer.stop()
  const next = index + 1
  if (next < PERIODS.length) timer.start(getPeriod(next).minutes * 60)
}

const periodScore = (index: number) => {
  const questions = periodQuestions.value[index] ?? []
  const correct = questions.filter((question) => answers.value[question.id] === question.answer)
  return { correct: correct.length, total: questions.length }
}

// Each subject (교시) is worth 100 points regardless of its question count.
const periodScorePoints = computed(() =>
  PERIODS.map((_, index) => {
    const { correct, total } = periodScore(index)
    return total > 0 ? Math.round((correct / total) * 1000) / 10 : 0
  }),
)

const averageScore = computed(() => {
  const scores = periodScorePoints.value
  if (!scores.length) return 0
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
})

// 합격: 과목당(교시당) 40점 이상 + 전과목 평균 60점 이상
const isPassed = computed(() => isExamPassed(periodScorePoints.value, averageScore.value))

// 세부분류(subtitle)별 정답률 — 오름차순(가장 취약한 분야가 먼저)
const subtitleStats = computed(() => {
  const groups = new Map<
    string,
    { subject: string; subtitle: string; correct: number; total: number }
  >()
  for (const question of periodQuestions.value.flat()) {
    const key = `${question.subject}::${question.subtitle}`
    const group = groups.get(key) ?? {
      subject: question.subject,
      subtitle: question.subtitle,
      correct: 0,
      total: 0,
    }
    group.total += 1
    if (answers.value[question.id] === question.answer) group.correct += 1
    groups.set(key, group)
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      accuracy: group.total > 0 ? Math.round((group.correct / group.total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
})

const unansweredCount = computed(
  () => periodQuestions.value.flat().filter((question) => !answers.value[question.id]).length,
)

const weakestPeriodIndex = computed(() => {
  const scores = periodScorePoints.value
  return scores.indexOf(Math.min(...scores))
})

const analysisLines = computed(() => {
  const all = periodQuestions.value.flat()
  const correctCount = all.filter(
    (question) => answers.value[question.id] === question.answer,
  ).length
  const lines: string[] = []

  lines.push(
    `총점: ${correctCount} / ${all.length}문제 정답, 평균 ${averageScore.value}점 — ${isPassed.value ? '합격' : '불합격'}`,
  )
  PERIODS.forEach((period, index) => {
    const { correct, total } = periodScore(index)
    lines.push(
      `${period.label}(${period.count}문항): ${periodScorePoints.value[index]}점 (${correct}/${total})`,
    )
  })
  const weakestPeriod = getPeriod(weakestPeriodIndex.value)
  lines.push(
    `가장 취약한 과목: ${weakestPeriod.label} (${periodScorePoints.value[weakestPeriodIndex.value]}점)`,
  )
  const weakTopics = subtitleStats.value.slice(0, 3)
  weakTopics.forEach((topic) => {
    lines.push(
      `취약 분야 — ${topic.subject} > ${topic.subtitle}: 정답률 ${topic.accuracy}% (${topic.correct}/${topic.total})`,
    )
  })
  if (unansweredCount.value > 0) {
    lines.push(`미응답 문제 ${unansweredCount.value}개 — 시간 배분 점검이 필요합니다.`)
  }
  const weakestTopic = weakTopics[0]
  if (weakestTopic) {
    lines.push(`보강 권장: "${weakestTopic.subtitle}" 영역을 우선적으로 복습하시길 권장합니다.`)
  }
  return lines
})

const saveResult = async () => {
  const profile = useAuthStore().profile
  if (!profile) return

  const [firstClass, secondClass, thirdClass] = periodScorePoints.value
  const { error } = await upsertTestResultQuery({
    username: profile.username,
    round: props.round,
    first_class: firstClass ?? 0,
    second_class: secondClass ?? 0,
    third_class: thirdClass ?? 0,
    average: averageScore.value,
    analysis: analysisLines.value.join('\n'),
  })
  if (error) useErrorStore().setError({ error })
}
</script>

<template>
  <div class="flex flex-col gap-6 text-base">
    <template v-if="test?.length">
      <div v-if="activePeriod === -1" class="rounded-md border p-6">
        <h2 class="mb-4 text-2xl font-bold">
          시험 종료 —
          <span :class="isPassed ? 'text-green-600 dark:text-green-400' : 'text-destructive'">
            {{ isPassed ? '합격' : '불합격' }}
          </span>
        </h2>
        <p class="mb-2 text-lg">평균: {{ averageScore }}점</p>
        <ul class="mb-4 flex flex-col gap-1 text-lg">
          <li v-for="(period, index) in PERIODS" :key="period.label">
            {{ period.label }}: {{ periodScorePoints[index] }}점 ({{ periodScore(index).correct }} /
            {{ periodScore(index).total }})
          </li>
        </ul>
        <div class="flex gap-2">
          <Button variant="outline" @click="toggleResultSheet">
            {{ showResultSheet ? '시험결과 닫기' : '시험결과 보기' }}
          </Button>
          <Button variant="outline" @click="toggleAnalysis">
            {{ showAnalysis ? '시험결과분석 닫기' : '시험결과분석' }}
          </Button>
        </div>

        <div v-if="showAnalysis" class="mt-6 rounded-md border p-4">
          <h3 class="mb-3 text-xl font-bold">시험결과 분석</h3>
          <ul class="flex flex-col gap-1.5">
            <li v-for="(line, index) in analysisLines" :key="index">{{ line }}</li>
          </ul>
        </div>

        <div v-if="showResultSheet" class="mt-6 flex flex-col">
          <template v-for="(period, periodIndex) in PERIODS" :key="period.label">
            <h3 class="mt-4 mb-2 text-xl font-bold">{{ period.label }}</h3>
            <ExamResultQuestion
              v-for="question in periodQuestions[periodIndex]"
              :key="question.id"
              :question="question"
              :selected="answers[question.id]"
            />
          </template>
        </div>
      </div>

      <template v-else>
        <div class="flex items-center gap-2 border-b">
          <button
            v-for="(period, index) in PERIODS"
            :key="period.label"
            type="button"
            class="px-4 py-2 text-base"
            :class="{
              'border-primary border-b-2 font-bold': viewedPeriod === index,
              'text-muted-foreground': index > activePeriod,
            }"
            :disabled="index > activePeriod"
            @click="viewedPeriod = index"
          >
            {{ period.label }} ({{ period.count }}문항)
            <span v-if="submittedPeriods[index]">✓</span>
          </button>
          <button
            v-if="viewedPeriod === activePeriod"
            type="button"
            class="ml-auto cursor-pointer pr-4 font-mono text-xl select-none"
            :class="{ 'text-muted-foreground': !timerIsRunning }"
            @click="timerIsRunning ? timer.stop() : timer.resume()"
          >
            남은시간 {{ timer.formatted }}
            <span v-if="!timerIsRunning">(일시정지)</span>
          </button>
        </div>

        <div
          v-if="viewedPeriod !== null"
          class="flex flex-col rounded-md bg-[#f8f5ec] px-4 dark:bg-transparent"
        >
          <ExamQuestion
            v-for="question in periodQuestions[viewedPeriod]"
            :key="question.id"
            :question="question"
            :model-value="answers[question.id]"
            :submitted="submittedPeriods[viewedPeriod]"
            @update:model-value="(value) => (answers[question.id] = value)"
          />
        </div>
        <p v-else class="text-muted-foreground">교시를 선택하면 문제가 표시됩니다.</p>

        <div v-if="viewedPeriod !== null && viewedPeriod === activePeriod" class="flex justify-end">
          <Button @click="submitPeriod(activePeriod)">
            {{ getPeriod(activePeriod).label }} 제출
          </Button>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped></style>
