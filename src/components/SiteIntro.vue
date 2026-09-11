<template>
  <article class="site-intro">
    <!-- 머리말 -->
    <header class="si-head">
      <p class="si-page-name">사이트 소개</p>
      <h1 class="si-title">공공조달관리사 필기,<br />실전처럼 풀고 근거로 확인하세요</h1>
      <p class="si-lead">
        제1회 공공조달관리사 필기시험이 한 달 앞으로 다가왔습니다. 처음 치러지는 시험이라 기출문제가 없고,
        무엇이 어떻게 출제될지 가늠하기 어려워 마무리 방향을 잡지 못하고 계신 분들이 많을 것입니다.
        이 사이트는 최종 마무리 단계에 계신 수험생 여러분의 합격에 보탬이 되고자 열었습니다.
      </p>
      <dl class="si-figures">
        <div v-for="f in figures" :key="f.label" class="si-figure">
          <dt>{{ f.label }}</dt>
          <dd><b>{{ f.value }}</b><small>{{ f.unit }}</small></dd>
        </div>
      </dl>
    </header>

    <div class="si-layout">
      <!-- 목차 (넓은 화면에서만 표시) -->
      <nav class="si-toc" aria-label="사이트 소개 목차">
        <a
          v-for="s in toc"
          :key="s.id"
          :href="`#${s.id}`"
          :class="{ 'is-active': activeId === s.id }"
          :aria-current="activeId === s.id ? 'true' : undefined"
          @click.prevent="goTo(s.id)"
        >{{ s.title }}</a>
      </nav>

      <div class="si-body">
        <section id="author" class="si-section">
          <h2>만든 사람</h2>
          <ul class="si-career">
            <li v-for="c in career" :key="c.title">
              <strong>{{ c.title }}</strong>
              <span>{{ c.desc }}</span>
            </li>
          </ul>
          <p>
            법령 조문이 실제 계약 현장에서 어떻게 해석되고, 제도가 시스템으로 어떻게 구현되는지를 가까이에서
            지켜봐 왔습니다. 기출문제가 없는 첫 시험에서 가장 믿을 수 있는 기준은 법령·예규 원문과 그 해석입니다.
            이 사이트의 문제와 자료는 모두 그 기준에서 출발했습니다.
          </p>
        </section>

        <section id="why" class="si-section">
          <h2>왜 문제풀이인가</h2>
          <p>
            공공조달 법령은 법률·시행령·시행규칙·계약예규가 촘촘히 맞물려 있습니다. 개념을 여러 번 읽어도
            금액 기준 하나, 예외 조항 하나만 바뀐 보기 앞에서는 판단이 흔들립니다.
          </p>
          <p class="si-emph">
            시험장에서 점수를 만드는 것은 '알고 있다'는 느낌이 아니라, 네 개의 보기 중 정답을 가려내는
            힘입니다.
          </p>
          <p>
            그 힘은 실전 형식의 문제를 충분히 풀고, 틀린 문제의 근거를 그 자리에서 확인할 때 길러집니다.
            이 사이트가 모의고사를 중심에 두고 학습 보조자료를 곁에 둔 이유입니다.
          </p>
        </section>

        <section id="mock" class="si-section">
          <h2>모의고사</h2>
          <p>
            문제은행을 과목별 출제 문항 수에 맞춰 배분하고 회차 간 중복을 최소화하여 모의고사 10회분, 모두 800문항을
            편성했습니다. 회당 80문항은 {{ subjectText }}으로 구성됩니다.
          </p>
          <p v-for="m in mockFeatures" :key="m.title" class="si-feature">
            <strong>{{ m.title }}</strong>{{ m.desc }}
          </p>
        </section>

        <section id="notes" class="si-section">
          <h2>학습 보조자료</h2>
          <p>
            모의고사를 풀다 막히는 부분을 바로 찾아볼 수 있도록 단원별 핵심정리를 함께 제공합니다.
            출제기준 항목별로 다음 네 가지를 담았습니다.
          </p>
          <ul class="si-parts">
            <li v-for="p in noteParts" :key="p">{{ p }}</li>
          </ul>
          <p>모든 자료는 법령·예규 원문과 공개 자료를 바탕으로 직접 집필했습니다.</p>
        </section>

        <section id="howto" class="si-section">
          <h2>이렇게 활용하세요</h2>
          <ol class="si-steps">
            <li v-for="s in steps" :key="s.title">
              <strong>{{ s.title }}</strong>
              <span>{{ s.desc }}</span>
            </li>
          </ol>
        </section>

        <section id="thanks" class="si-section">
          <h2>감사의 말</h2>
          <p>
            이 사이트를 만드는 과정에서 귀한 자문을 주신
            <span class="si-advisors">{{ advisors.map((n) => `${n} 교수님`).join(', ') }}</span
            >께 깊이 감사드립니다.
          </p>
        </section>

        <footer class="si-closing">
          <p>남은 한 달, 문제로 마무리하십시오.</p>
          <span>수험생 여러분의 합격을 진심으로 응원합니다.</span>
        </footer>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
/* ---------- 내용 데이터 : 문구 수정은 여기서 ---------- */
const figures = [
  { value: '10', unit: '회분', label: '실전 모의고사' },
  { value: '800', unit: '문항', label: '과목별 배분 전체 문항' },
  { value: '80', unit: '문항', label: '회당 CBT 응시와 즉시 채점' },
]

const toc = [
  { id: 'author', title: '만든 사람' },
  { id: 'why', title: '왜 문제풀이인가' },
  { id: 'mock', title: '모의고사' },
  { id: 'notes', title: '학습 보조자료' },
  { id: 'howto', title: '이렇게 활용하세요' },
  { id: 'thanks', title: '감사의 말' },
]

const career = [
  { title: '조달청 법무담당관실 3년여', desc: '공공계약 관련 유권해석 업무 담당' },
  { title: '공공계약 강의', desc: '조달교육원, 국토교통인재개발원, 감사교육원 등' },
  { title: '나라장터 시스템 구축 참여', desc: '제도가 시스템으로 구현되는 과정을 경험' },
]

const subjects = [
  { name: '공공조달과 법제도 이해', count: 30 },
  { name: '공공조달계획 수립 및 분석', count: 20 },
  { name: '공공계약관리', count: 30 },
]

const subjectText = subjects.map((s) => `${s.name} ${s.count}문항`).join(', ')

const mockFeatures = [
  { title: 'CBT 방식 응시', desc: '실제 시험처럼 제한시간 안에 풀고, 제출하면 즉시 채점됩니다.' },
  {
    title: '과목별 점수와 합격 여부',
    desc: '과목별 과락 기준과 전 과목 평균 기준을 함께 적용해 합격 가능성을 바로 확인할 수 있습니다.',
  },
  {
    title: '출제항목별 취약도 분석',
    desc: '틀린 문항이 어느 출제항목(주요항목 > 세부항목 > 세세항목)에 몰려 있는지 보여 드리므로, 남은 기간에 무엇부터 보완해야 할지가 분명해집니다.',
  },
]

const noteParts = ['핵심 개념', '헷갈리기 쉬운 짝 개념', '숫자 암기 카드', '확인문제']

const steps = [
  { title: '실력 확인', desc: '모의고사 1회를 실제 시험처럼 시간을 재며 풀어 지금의 위치를 확인합니다.' },
  { title: '취약 항목 찾기', desc: '채점 후 취약도 분석에서 틀린 문항이 몰린 출제항목을 찾습니다.' },
  { title: '보완과 재점검', desc: '해당 항목을 단원별 핵심정리로 보완하고, 다음 회차로 다시 점검합니다.' },
  { title: '최종 점검', desc: '시험 직전에는 숫자 암기 카드로 금액·기간·비율 기준을 마지막으로 확인합니다.' },
]

const advisors = ['김명규', '류재일', '김병조']

/* ---------- 목차 : 현재 읽는 단원 표시 ---------- */
const activeId = ref(toc[0]!.id)
let ticking = false

function updateActive() {
  const line = window.innerHeight * 0.3
  let current = toc[0]!.id
  for (const s of toc) {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top <= line) current = s.id
  }
  // 페이지 끝에 닿으면 마지막 단원을 표시
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = toc[toc.length - 1]!.id
  }
  activeId.value = current
  ticking = false
}

function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(updateActive)
  }
}

function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateActive()
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.site-intro {
  --si-ink: var(--card-foreground);
  --si-soft: var(--muted-foreground);
  --si-text: var(--card-foreground);
  --si-rule: var(--border);
  --si-accent: var(--primary);
  --si-serif: 'Noto Serif KR', 'Nanum Myeongjo', 'AppleMyungjo', 'Batang', serif;
  --si-sans: 'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  --si-offset: 96px; /* 사이트 공통 헤더 높이 + 여유 */

  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  padding: 64px 32px 96px 56px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  color: var(--si-text);
  font-family: var(--si-sans);
  font-size: 17px;
  line-height: 1.85;
  word-break: keep-all;
}
/* 왼쪽 남색 띠 : PDF 소개서와 같은 시각 요소 */
.site-intro::before {
  content: '';
  position: absolute;
  left: 0;
  top: 64px;
  width: 6px;
  height: 220px;
  background: var(--si-ink);
}
.site-intro p {
  margin: 0 0 1em;
}

/* 머리말 */
.si-head {
  max-width: 760px;
}
.si-page-name {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 24px !important;
  font-size: 15px;
  font-weight: 700;
  color: var(--si-accent);
}
.si-page-name::before {
  content: '';
  width: 44px;
  height: 2px;
  background: var(--si-accent);
}
.si-title {
  margin: 0 0 24px;
  font-family: var(--si-serif);
  font-weight: 700;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.38;
  letter-spacing: -0.01em;
  color: var(--si-ink);
}
.si-lead {
  font-size: 18px;
  color: var(--si-ink);
}

.si-figures {
  display: flex;
  gap: 48px;
  margin: 36px 0 0;
  padding-top: 22px;
  border-top: 2px solid var(--si-ink);
}
.si-figure {
  display: flex;
  flex-direction: column-reverse;
}
.si-figure dt {
  margin-top: 8px;
  font-size: 14px;
  color: var(--si-soft);
}
.si-figure dd {
  margin: 0;
  color: var(--si-ink);
}
.si-figure b {
  font-family: var(--si-serif);
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}
.si-figure small {
  margin-left: 6px;
  font-size: 17px;
  font-weight: 700;
}

/* 본문 + 목차 */
.si-layout {
  display: grid;
  grid-template-columns: 180px minmax(0, 760px);
  gap: 56px;
  margin-top: 72px;
}
.si-toc {
  position: sticky;
  top: var(--si-offset);
  align-self: start;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--si-rule);
}
.si-toc a {
  margin-left: -1px;
  padding: 6px 0 6px 16px;
  border-left: 2px solid transparent;
  font-size: 15px;
  color: var(--si-soft);
  text-decoration: none;
  transition:
    color 0.15s,
    border-color 0.15s;
}
.si-toc a:hover {
  color: var(--si-ink);
}
.si-toc a.is-active {
  color: var(--si-ink);
  font-weight: 700;
  border-left-color: var(--si-ink);
}

.si-section {
  margin-bottom: 56px;
  scroll-margin-top: var(--si-offset);
}
.si-section h2 {
  position: relative;
  margin: 0 0 18px;
  padding-top: 16px;
  border-top: 1px solid var(--si-rule);
  font-family: var(--si-serif);
  font-weight: 700;
  font-size: 23px;
  line-height: 1.4;
  color: var(--si-ink);
}
.si-section h2::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  width: 52px;
  height: 3px;
  background: var(--si-ink);
}
.si-emph {
  font-weight: 600;
  /* var(--si-accent) (= --primary) is nearly the same lightness as body ink in both
     themes here, so it reads as barely-there — use --destructive for real contrast. */
  color: var(--destructive);
}

/* 만든 사람 : 연혁형 목록 */
.si-career {
  list-style: none;
  margin: 20px 0 22px 8px;
  padding: 0 0 0 26px;
  border-left: 2px solid var(--si-rule);
}
.si-career li {
  position: relative;
  margin-bottom: 14px;
}
.si-career li::before {
  content: '';
  position: absolute;
  left: -33px;
  top: 9px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--si-ink);
}
.si-career strong {
  display: block;
  color: var(--si-ink);
  font-size: 17px;
}
.si-career span {
  color: var(--si-soft);
  font-size: 16px;
}

/* 모의고사 기능 */
.si-feature strong {
  margin-right: 10px;
  color: var(--si-ink);
}

/* 학습 보조자료 구성 */
.si-parts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
  list-style: none;
  margin: 4px 0 16px;
  padding: 0;
}
.si-parts li {
  position: relative;
  padding-left: 16px;
  font-weight: 700;
  color: var(--si-ink);
}
.si-parts li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.8em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--si-accent);
}

/* 활용 순서 */
.si-steps {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  counter-reset: si-step;
}
.si-steps li {
  counter-increment: si-step;
  display: grid;
  grid-template-columns: 48px 1fr;
  row-gap: 2px;
  margin-bottom: 16px;
}
.si-steps li::before {
  content: counter(si-step);
  grid-row: span 2;
  font-family: var(--si-serif);
  font-weight: 700;
  font-size: 30px;
  line-height: 1.1;
  color: var(--si-accent);
}
.si-steps strong {
  color: var(--si-ink);
}
.si-steps span {
  color: var(--si-soft);
  font-size: 16px;
}

/* 감사의 말 */
.si-advisors {
  font-family: var(--si-serif);
  font-weight: 700;
  font-size: 18px;
  color: var(--si-ink);
}

/* 맺음 */
.si-closing {
  margin-top: 24px;
  padding-top: 28px;
  border-top: 2px solid var(--si-ink);
}
.si-closing p {
  margin: 0 0 6px;
  font-family: var(--si-serif);
  font-weight: 700;
  font-size: 26px;
  line-height: 1.5;
  color: var(--si-ink);
}
.si-closing span {
  color: var(--si-soft);
}

/* 반응형 */
@media (max-width: 1024px) {
  .si-layout {
    grid-template-columns: minmax(0, 1fr);
    margin-top: 56px;
  }
  .si-toc {
    display: none;
  }
}
@media (max-width: 600px) {
  .site-intro {
    padding: 40px 20px 72px 28px;
    font-size: 16px;
  }
  .site-intro::before {
    top: 40px;
    width: 4px;
    height: 180px;
  }
  .si-lead {
    font-size: 16.5px;
  }
  .si-figures {
    gap: 24px;
  }
  .si-figure b {
    font-size: 30px;
  }
  .si-figure small {
    font-size: 14px;
  }
  .si-figure dt {
    font-size: 12.5px;
  }
  .si-section {
    margin-bottom: 44px;
  }
  .si-section h2 {
    font-size: 20px;
  }
  .si-closing p {
    font-size: 21px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .si-toc a {
    transition: none;
  }
}
</style>
