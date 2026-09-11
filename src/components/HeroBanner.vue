<script setup lang="ts">
/**
 * 메인 배너 (공공조달관리사 모의고사)
 *
 * 사용:
 *   <HeroBanner
 *     :sample="sampleQuestion"
 *     @start-trial="goTrial"
 *     @preview-book="goPreview" />
 *
 * 폰트는 전역에서 한 번만 불러오세요.
 *   Noto Serif KR : https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700
 *   Pretendard    : https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css
 */
import { computed, ref } from 'vue'

const props = defineProps({
  /** 배너에 노출할 예시 문항. 미지정 시 기본 문항 사용 */
  sample: { type: Object, default: null },
  /** 무료 응시 가능한 회차 번호 */
  freeRound: { type: Number, default: 1 },
  /** 총 회차 수 */
  totalRounds: { type: Number, default: 10 },
})

defineEmits(['start-trial', 'preview-book'])

const visible = ref(true)

const defaultSample = {
  round: 3,
  subject: '공공계약관리',
  no: 18,
  total: 80,
  stem:
    '국가기관이 추정가격 2천만원 이하의 물품 제조·구매계약을 체결하려 할 때, ' +
    '법령상 허용되는 계약방법으로 옳은 것은?',
  choices: [
    '일반경쟁계약만 가능하다',
    '제한경쟁계약만 가능하다',
    '지명경쟁계약만 가능하다',
    '수의계약을 체결할 수 있다',
  ],
  answerIndex: 3,
  explanation:
    '소액 물품 제조·구매계약은 경쟁에 부치지 않고 계약을 체결할 수 있는 사유에 해당합니다.',
  source: '근거 · 국가계약법 시행령 제26조',
}

const q = computed(() => props.sample ?? defaultSample)
const rounds = computed(() => Array.from({ length: props.totalRounds }, (_, i) => i + 1))

const books = [
  {
    title: '공공조달관리사 핵심요약',
    desc: '원전 교재를 출제 기준에 맞춰 재편성하고 출제 가능성이 낮은 서술은 덜어냈습니다.',
    tone: 'a',
  },
  {
    title: '국가계약법령 4단 정리',
    desc: '법·시행령·시행규칙·계약예규를 한 면에 나란히 놓아 조문의 흐름을 한눈에 봅니다.',
    tone: 'b',
  },
  {
    title: '다수공급자계약(MAS) 규정',
    desc: '계약 체결부터 2단계 경쟁까지, 출제 비중이 높은 요건과 수치만 추렸습니다.',
    tone: 'c',
  },
]

const facts = [
  { v: '1,000', k: '엄선 문항' },
  { v: '10', k: '회분 실전 모의고사' },
  { v: '3', k: '필기 과목 전 범위' },
  { v: '3', k: '종 수험교재' },
]
</script>

<template>
  <section v-if="visible" class="hero">
    <button type="button" class="close-btn" aria-label="배너 닫기" @click="visible = false">
      <iconify-icon icon="lucide:x" />
    </button>

    <div class="hero__inner">
      <div class="copy">
        <h1 class="headline">
          공공조달관리사 합격,<br />
          <span class="num">1,000문항</span>으로 준비하세요.
        </h1>

        <p class="lede">
          조달교육원 교재를 기준으로 새로 출제한 500문항과 기출 유형을 분석한 500문항. 중복을
          최소화해 10회분 실전 모의고사로 편성했습니다.
        </p>

        <p class="detail">
          모든 문항에 <b>정답 근거 조문</b>이 함께 표시됩니다. 틀린 자리에서 바로 법령을 확인하고,
          같은 실수를 다음 회차로 넘기지 않습니다.
        </p>

        <div class="cta">
          <button class="btn btn--solid" @click="$emit('start-trial')">모의고사 무료 풀기</button>
          <button class="btn btn--ghost" @click="$emit('preview-book')">수험교재 미리보기</button>
        </div>

        <ul class="facts">
          <li v-for="f in facts" :key="f.k">
            <span class="v">{{ f.v }}</span>
            <span class="k">{{ f.k }}</span>
          </li>
        </ul>
      </div>

      <div class="demo">
        <article class="qcard">
          <div class="qcard__head">
            <span>
              <strong>제{{ q.round }}회 모의고사</strong> {{ q.subject }}
            </span>
            <span class="no">{{ q.no }} / {{ q.total }}</span>
          </div>

          <div class="qcard__body">
            <p class="stem">{{ q.stem }}</p>

            <ol class="choices">
              <li
                v-for="(c, i) in q.choices"
                :key="i"
                :class="{ 'is-answer': i === q.answerIndex }"
                :style="{ animationDelay: `${0.3 + Number(i) * 0.1}s` }"
              >
                {{ c }}
              </li>
            </ol>

            <div class="verdict">
              {{ q.explanation }}
              <span class="src">{{ q.source }}</span>
            </div>
          </div>
        </article>

        <div class="rounds">
          <span v-for="r in rounds" :key="r" :class="{ free: r === freeRound }"> {{ r }}회 </span>
        </div>

        <p class="caption">{{ freeRound }}회차는 회원가입 후 무료로 응시하실 수 있습니다.</p>
      </div>
    </div>

    <div class="books">
      <h2>모의고사와 함께 제공되는 수험교재</h2>
      <div v-for="b in books" :key="b.title" class="book" :data-tone="b.tone">
        <h3>{{ b.title }}</h3>
        <p>{{ b.desc }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  --ink: #16202e;
  --ink-soft: #3a4756;
  --muted: #6b7885;
  --paper: #f1f3f6;
  --rule: #d6dbe1;
  --seal: #a33a2e;
  --brass: #b5813a;
  --tier-1: #12355b;
  --tier-2: #1d5b8c;
  --tier-3: #2e86a8;
  --serif: 'Noto Serif KR', 'Nanum Myeongjo', serif;
  --sans: 'Pretendard', -apple-system, 'Malgun Gothic', sans-serif;

  position: relative;
  overflow: hidden;
  padding: 52px 29px 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0 43px,
    rgba(22, 32, 46, 0.045) 43px 44px
  );
  pointer-events: none;
}

.close-btn {
  position: absolute;
  right: 18px;
  bottom: 14px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border: 1px solid var(--rule);
  border-radius: 50%;
  background: #fff;
  color: var(--muted);
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.close-btn:hover {
  background: var(--paper);
  color: var(--ink);
}
.close-btn:focus-visible {
  outline: 2px solid var(--tier-2);
  outline-offset: 2px;
}

.hero__inner {
  position: relative;
  max-width: 1044px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 65px;
  align-items: start;
}

.headline {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(22px, 2.7vw, 34px);
  line-height: 1.26;
  letter-spacing: -0.022em;
  margin: 0 0 16px;
  word-break: keep-all;
}

.num {
  font-feature-settings: 'tnum';
  border-bottom: 3px solid var(--seal);
  padding-bottom: 2px;
}

.lede {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 40ch;
  margin: 0 0 11px;
  word-break: keep-all;
}

.detail {
  font-size: 13px;
  line-height: 1.65;
  color: var(--muted);
  max-width: 42ch;
  margin: 0 0 20px;
  word-break: keep-all;
}
.detail b {
  font-weight: 600;
  color: var(--ink-soft);
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-bottom: 25px;
}

.btn {
  padding: 10px 20px;
  border-radius: 3px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease;
}
.btn--solid {
  background: var(--seal);
  color: #fff;
  border: 1px solid var(--seal);
}
.btn--solid:hover {
  background: #8e3227;
  border-color: #8e3227;
}
.btn--ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--rule);
}
.btn--ghost:hover {
  border-color: var(--ink);
}
.btn:focus-visible {
  outline: 2px solid var(--tier-2);
  outline-offset: 3px;
}

.facts {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 14px 0 0;
  border-top: 1px solid var(--rule);
}
.facts li {
  flex: 1;
  padding-left: 16px;
  border-left: 1px solid var(--rule);
}
.facts li:first-child {
  padding-left: 0;
  border-left: 0;
}
.facts .v {
  display: block;
  font-family: var(--serif);
  font-weight: 700;
  font-size: 19px;
  line-height: 1.1;
  font-feature-settings: 'tnum';
}
.facts .k {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: var(--muted);
  word-break: keep-all;
}

.demo {
  padding-top: 5px;
}

.qcard {
  background: #fff;
  border: 1px solid var(--rule);
  border-top: 3px solid var(--tier-1);
  box-shadow: 0 18px 40px -28px rgba(18, 53, 91, 0.55);
}

.qcard__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 11px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--rule);
  font-size: 11px;
  color: var(--muted);
}
.qcard__head strong {
  color: var(--tier-1);
  font-weight: 600;
}
.qcard__head .no {
  font-feature-settings: 'tnum';
  color: var(--ink-soft);
}

.qcard__body {
  padding: 15px 18px 14px;
}

.stem {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.6;
  word-break: keep-all;
}

.choices {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: c;
}
.choices li {
  counter-increment: c;
  display: flex;
  gap: 9px;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 3px;
  font-size: 13px;
  line-height: 1.4;
  color: var(--ink-soft);
  opacity: 0;
  animation: rise 0.42s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
.choices li::before {
  content: counter(c);
  flex: none;
  width: 19px;
  height: 19px;
  margin-top: 1px;
  border: 1px solid var(--rule);
  border-radius: 50%;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  color: var(--muted);
  font-feature-settings: 'tnum';
}
.choices li.is-answer {
  border-color: rgba(46, 134, 168, 0.5);
  background: rgba(46, 134, 168, 0.07);
  color: var(--ink);
  font-weight: 600;
}
.choices li.is-answer::before {
  border-color: var(--tier-3);
  background: var(--tier-3);
  color: #fff;
}

.verdict {
  margin-top: 11px;
  padding: 9px 13px;
  background: #f7f9fb;
  border-left: 3px solid var(--tier-3);
  font-size: 12px;
  line-height: 1.55;
  color: var(--ink-soft);
  opacity: 0;
  animation: rise 0.42s cubic-bezier(0.22, 0.61, 0.36, 1) 0.82s forwards;
  word-break: keep-all;
}
.verdict .src {
  display: block;
  margin-top: 5px;
  color: var(--brass);
  font-weight: 600;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(9px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.rounds {
  display: flex;
  gap: 5px;
  margin-top: 13px;
}
.rounds span {
  flex: 1;
  padding: 5px 0;
  text-align: center;
  background: #fff;
  border: 1px solid var(--rule);
  font-size: 10px;
  color: var(--muted);
  font-feature-settings: 'tnum';
}
.rounds span.free {
  border-color: var(--seal);
  color: var(--seal);
  font-weight: 600;
}

.caption {
  margin: 9px 0 0;
  font-size: 10px;
  color: var(--muted);
}

.books {
  position: relative;
  max-width: 1044px;
  margin: 43px auto 0;
  padding: 16px 0 52px;
  border-top: 1px solid var(--rule);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
}
.books h2 {
  grid-column: 1 / -1;
  margin: 0 0 4px;
  font-family: var(--serif);
  font-size: 15px;
  font-weight: 500;
}

.book {
  padding-left: 13px;
  border-left: 2px solid var(--tier-2);
}
.book[data-tone='b'] {
  border-left-color: var(--tier-3);
}
.book[data-tone='c'] {
  border-left-color: var(--brass);
}
.book h3 {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
}
.book p {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--muted);
  word-break: keep-all;
}

@media (max-width: 900px) {
  .hero {
    padding: 34px 18px 0;
  }
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .lede,
  .detail {
    max-width: none;
  }
  .facts {
    flex-wrap: wrap;
    gap: 16px 0;
  }
  .facts li {
    flex: 0 0 50%;
  }
  .facts li:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }
  .books {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 32px;
    padding-bottom: 34px;
  }
}

@media (max-width: 560px) {
  .rounds span:nth-child(n + 6) {
    display: none;
  }
  .facts li {
    flex: 0 0 100%;
    padding-left: 0;
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .choices li,
  .verdict {
    animation: none;
    opacity: 1;
  }
}
</style>
