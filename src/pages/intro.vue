<script setup lang="ts">
usePageStore().pageData.title = '사이트 소개'

useMeta({
  title: '사이트 소개',
  meta: [
    {
      name: 'description',
      content: '공공조달관리사 필기, 실전처럼 풀고 근거로 확인하세요.',
    },
  ],
})
</script>

<template>
  <div>
    <SiteIntro />
    <div class="mx-auto max-w-3xl px-6 pb-6">
      <BackHomeLink />
    </div>
  </div>
</template>
