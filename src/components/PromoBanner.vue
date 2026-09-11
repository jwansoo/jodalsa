<script setup lang="ts">
/**
 * 회원가입 할인 광고 배너
 *
 * 사용:
 *   <PromoBanner :discount-rate="50" @claim="goCheckout" @trial="goFreeRound" />
 */
defineProps({
  discountRate: { type: Number, default: 50 },
})

defineEmits(['claim', 'trial', 'dismiss-today'])
</script>

<template>
  <section class="promo">
    <div class="promo__copy">
      <span class="kicker">개설 기념 · 회원가입 특별 혜택</span>

      <h2 class="promo__title">
        개설기념으로 신규가입하신 분께<br />
        이용료를 <em>{{ discountRate }}%</em> 할인해 드립니다.
      </h2>

      <p class="promo__lede">
        1,000문항으로 편성한 10회분 실전 모의고사와 핵심요약·공공조달관리사·국가계약법령·MAS 등
        수험교재를 {{ discountRate }}% 할인된 가격에 이용하실 수 있습니다.
      </p>

      <div class="cta">
        <button class="btn btn--solid" @click="$emit('claim')">할인가로 신청하기</button>
        <button class="btn btn--ghost" @click="$emit('trial')">모의고사 1회 무료로 풀기</button>
      </div>

      <button class="dismiss-today" @click="$emit('dismiss-today')">오늘 하루 보지 않기</button>

      <ul class="terms">
        <li>본 할인은 신규 회원가입자 전원에게 적용됩니다.</li>
        <li>1인 1회 적용되며 다른 할인과 중복되지 않습니다.</li>
        <li>수험교재는 온라인 열람 전용으로 제공됩니다.</li>
      </ul>
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

  max-width: 640px;
  margin: 0 auto;
  background: var(--ink-deep);
  color: #eef1f5;
  border-top: 3px solid var(--seal);
  font-family: var(--sans);
}

.promo__copy {
  padding: 36px 40px 38px;
}

.kicker {
  display: inline-block;
  margin-bottom: 16px;
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
  margin: 0 0 24px;
  word-break: keep-all;
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-bottom: 22px;
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
.btn--solid:hover {
  background: var(--seal-lit);
  border-color: var(--seal-lit);
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

.dismiss-today {
  display: block;
  margin: 0 0 18px;
  padding: 0;
  background: none;
  border: none;
  color: #78848f;
  font-size: 12.5px;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
.dismiss-today:hover {
  color: #a9b4c0;
}
.dismiss-today:focus-visible {
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

@media (max-width: 880px) {
  .promo__copy {
    padding: 28px 24px 26px;
  }
  .promo__lede {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .btn {
    width: 100%;
  }
}
</style>
