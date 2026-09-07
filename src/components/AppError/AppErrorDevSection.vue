<template>
  <div>
    <iconify-icon icon="lucide:triangle-alert" class="error-icon" />
    <h1 class="error-code">{{ customCode || code }}</h1>
    <p class="error-code" v-if="statusCode">Status Code: {{ statusCode }}</p>
    <p class="error-msg">{{ message }}</p>
    <p v-if="hint">{{ hint }}</p>
    <p v-if="details">{{ details }}</p>
    <div class="error-footer">
      <p class="error-footer-text">홈페이지에서 많은 것을 탐색해보세요.</p>
      <RouterLink to="/">
        <Button class="max-w-36"> 홈페이지로 가기 </Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  customCode?: number
  code: string
  statusCode?: number
  hint: string | null
  details: string
}>()
</script>

<style scoped></style>
