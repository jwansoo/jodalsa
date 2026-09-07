<script setup lang="ts">
import { marked } from 'marked'
import userGuideMarkdown from '../../docs/user-guide.md?raw'

usePageStore().pageData.title = '사용설명서'

const html = marked.parse(userGuideMarkdown, { async: false })

useMeta({
  title: '사용설명서',
  meta: [
    {
      name: 'description',
      content: '조달컨설팅 서비스 이용 안내',
    },
  ],
})
</script>

<template>
  <div class="mx-auto max-w-3xl p-6">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="manual-content" v-html="html"></div>
  </div>
</template>

<style scoped>
.manual-content :deep(h1) {
  margin: 0 0 1rem;
  font-size: 1.875rem;
  font-weight: 700;
}
.manual-content :deep(h2) {
  width: 100%;
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  font-size: 1.5rem;
  font-weight: 700;
}
.manual-content :deep(h3) {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}
.manual-content :deep(p) {
  margin: 0.75rem 0;
  line-height: 1.7;
}
.manual-content :deep(ul) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  list-style: disc;
}
.manual-content :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  list-style: decimal;
}
.manual-content :deep(li) {
  margin: 0.25rem 0;
}
.manual-content :deep(strong) {
  font-weight: 600;
}
.manual-content :deep(code) {
  border-radius: 0.25rem;
  background-color: var(--muted);
  padding: 0.1rem 0.4rem;
  font-size: 0.875em;
}
.manual-content :deep(blockquote) {
  margin: 0.75rem 0;
  border-left: 3px solid var(--border);
  padding-left: 1rem;
  color: var(--muted-foreground);
}
.manual-content :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}
.manual-content :deep(hr) {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid var(--border);
}
</style>
