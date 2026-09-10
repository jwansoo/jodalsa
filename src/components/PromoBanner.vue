<script setup lang="ts">
/**
 * 선착순 할인 광고 배너
 *
 * 사용:
 *   <PromoBanner
 *     :taken="claimedCount"
 *     :total="50"
 *     :list-price="99000"
 *     :sale-price="49500"
 *     @claim="goCheckout"
 *     @trial="goFreeRound" />
 *
 * taken 값은 반드시 서버(결제 완료 건수)에서 내려주세요.
 * 화면에 임의로 채워 넣은 수치는 표시광고법상 문제가 될 수 있습니다.
 */
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, default: 50 },
  taken: { type: Number, default: 0 },
  listPrice: { type: Number, default: 99000 },
  salePrice: { type: Number, default: 49500 },
  periodLabel: { type: String, default: '6개월 이용권' },
})

defineEmits(['claim', 'trial'])

const takenSafe = computed(() => Math.max(0, Math.min(props.taken, props.total)))
const left = computed(() => props.total - takenSafe.value)
const soldOut = computed(() => left.value === 0)
const pct = computed(() => (takenSafe.value / props.total) * 100)
const discountRate = computed(() => Math.round((1 - props.salePrice / props.listPrice) * 100))

const won = (n: number) => n.toLocaleString('ko-KR')

const cells = computed(() =>
  Array.from({ length: props.total }, (_, i) => ({
    id: i,
    taken: i < takenSafe.value,
    delay: `${0.25 + i * 0.028}s`,
  })),
)
</script>

<template>
  <section class="promo">
    <div class="promo__copy">
      <span class="kicker">
        {{ soldOut ? '선착순 할인 마감' : '개설 기념 · 선착순 한정' }}
      </span>

      <h2 class="promo__title">
        먼저 신청한 <em>{{ total }}명</em>에게<br />
        이용료를 <em>{{ discountRate }}%</em> 할인해 드립니다.
      </h2>

      <p class="promo__lede">
        1,000문항으로 편성한 10회분 실전 모의고사와 수험교재 3종을 절반 가격에 이용하실 수 있습니다.
      </p>

      <div class="price">
        <span class="price__was">{{ won(listPrice) }}원</span>
        <span class="price__now"> {{ won(salePrice) }}<span class="price__unit">원</span> </span>
        <span class="price__note">{{ periodLabel }}<br />부가세 포함</span>
      </div>

      <div class="cta">
        <button class="btn btn--solid" :disabled="soldOut" @click="$emit('claim')">
          {{ soldOut ? '할인 인원이 마감되었습니다' : '할인가로 신청하기' }}
        </button>
        <button class="btn btn--ghost" @click="$emit('trial')">모의고사 1회 무료로 풀기</button>
      </div>

      <ul class="terms">
        <li>할인은 선착순 {{ total }}명에 한하며, 인원이 채워지면 자동 종료됩니다.</li>
        <li>잔여 인원은 결제 완료 기준으로 갱신됩니다.</li>
        <li>1인 1회 적용되며 다른 할인과 중복되지 않습니다.</li>
        <li>수험교재는 온라인 열람 전용으로 제공됩니다.</li>
      </ul>
    </div>

    <div class="seats">
      <div class="seats__head">
        <span class="seats__label">신청 현황</span>
        <span class="seats__left">
          <b>{{ left }}</b
          >자리 남음
        </span>
      </div>

      <div class="grid" role="img" :aria-label="`${total}자리 중 ${takenSafe}자리 신청 완료`">
        <div
          v-for="c in cells"
          :key="c.id"
          class="cell"
          :class="{ taken: c.taken }"
          :style="c.taken ? { animationDelay: c.delay } : null"
        />
      </div>

      <div class="bar"><span :style="{ '--pct': pct + '%' }" /></div>
      <p class="seats__note">{{ total }}자리 중 {{ takenSafe }}자리가 신청되었습니다.</p>

      <dl class="seats__meta">
        <div class="meta-row">
          <dt>모의고사</dt>
          <dd>10회분 · 1,000문항</dd>
        </div>
        <div class="meta-row">
          <dt>수험교재</dt>
          <dd>핵심요약 · 국가계약법령 · MAS</dd>
        </div>
        <div class="meta-row">
          <dt>이용기간</dt>
          <dd>결제일부터 6개월</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.promo {
  --ink-deep: #101a26;
  --seal: #a33a2e;
  --seal-lit: #c9503f;
  --serif: 'Noto Serif KR', 'Nanum Myeongjo', serif;
  --sans: 'Pretendard', -apple-system, 'Malgun Gothic', sans-serif;

  max-width: 1060px;
  margin: 0 auto;
  background: var(--ink-deep);
  color: #eef1f5;
  border-top: 3px solid var(--seal);
  font-family: var(--sans);
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
}

.promo__copy {
  padding: 48px 44px 44px;
}

.kicker {
  display: inline-block;
  margin-bottom: 20px;
  padding: 6px 12px;
  border: 1px solid rgba(201, 80, 63, 0.55);
  border-radius: 2px;
  font-size: 13px;
  font-weight: 600;
  color: #e6897a;
}

.promo__title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(30px, 3.6vw, 44px);
  line-height: 1.32;
  letter-spacing: -0.022em;
  margin: 0 0 20px;
  word-break: keep-all;
}
.promo__title em {
  font-style: normal;
  font-feature-settings: 'tnum';
  color: #f3b7ac;
}

.promo__lede {
  font-size: 16px;
  line-height: 1.76;
  color: #a9b4c0;
  max-width: 38ch;
  margin: 0 0 32px;
  word-break: keep-all;
}

.price {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 22px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.13);
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  margin-bottom: 28px;
}
.price__was {
  font-size: 17px;
  color: #7e8b99;
  text-decoration: line-through;
  text-decoration-color: var(--seal-lit);
  text-decoration-thickness: 2px;
  padding-bottom: 6px;
  font-feature-settings: 'tnum';
}
.price__now {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 40px;
  line-height: 1;
  letter-spacing: -0.02em;
  font-feature-settings: 'tnum';
}
.price__unit {
  font-family: var(--sans);
  font-size: 17px;
  font-weight: 500;
  margin-left: 3px;
}
.price__note {
  margin-left: auto;
  padding-bottom: 7px;
  font-size: 13px;
  color: #7e8b99;
  text-align: right;
  line-height: 1.5;
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-bottom: 26px;
}

.btn {
  padding: 15px 26px;
  border: 1px solid transparent;
  border-radius: 3px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease;
}
.btn--solid {
  background: var(--seal);
  border-color: var(--seal);
  color: #fff;
}
.btn--solid:hover:not(:disabled) {
  background: var(--seal-lit);
  border-color: var(--seal-lit);
}
.btn--solid:disabled {
  background: #3a4756;
  border-color: #3a4756;
  color: #8d99a6;
  cursor: not-allowed;
}
.btn--ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.24);
  color: #dce2e9;
}
.btn--ghost:hover {
  border-color: rgba(255, 255, 255, 0.55);
}
.btn:focus-visible {
  outline: 2px solid #7fb4ce;
  outline-offset: 3px;
}

.terms {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 12.5px;
  line-height: 1.85;
  color: #78848f;
}
.terms li {
  padding-left: 11px;
  position: relative;
  word-break: keep-all;
}
.terms li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 3px;
  height: 3px;
  background: #566270;
}

.seats {
  padding: 48px 44px 44px;
  background: #16212f;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.seats__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 18px;
}
.seats__label {
  font-size: 13.5px;
  color: #8d99a6;
}
.seats__left {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 15px;
  color: #f3b7ac;
  font-feature-settings: 'tnum';
}
.seats__left b {
  font-size: 30px;
  margin-right: 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.cell {
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 2px;
}
.cell.taken {
  background: var(--seal);
  border-color: var(--seal);
  opacity: 0;
  animation: mark 0.26s ease forwards;
}
@keyframes mark {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 10px;
}
.bar span {
  display: block;
  height: 100%;
  background: var(--seal);
  width: 0;
  animation: fill 1.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
@keyframes fill {
  to {
    width: var(--pct);
  }
}

.seats__note {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: #78848f;
  word-break: keep-all;
}

.seats__meta {
  margin: 26px 0 0;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  gap: 12px;
}
.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  font-size: 13.5px;
}
.meta-row dt {
  color: #8d99a6;
}
.meta-row dd {
  margin: 0;
  color: #dce2e9;
  font-weight: 600;
  text-align: right;
  word-break: keep-all;
}

@media (max-width: 880px) {
  .promo {
    grid-template-columns: 1fr;
  }
  .promo__copy {
    padding: 36px 24px 30px;
  }
  .promo__lede {
    max-width: none;
  }
  .seats {
    padding: 32px 24px 36px;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .price {
    flex-wrap: wrap;
    gap: 10px;
  }
  .price__note {
    margin-left: 0;
    width: 100%;
    text-align: left;
    padding-bottom: 0;
  }
}

@media (max-width: 480px) {
  .grid {
    gap: 4px;
  }
  .btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cell.taken {
    animation: none;
    opacity: 1;
  }
  .bar span {
    animation: none;
    width: var(--pct);
  }
}
</style>
