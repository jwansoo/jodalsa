<script setup lang="ts">
const props = defineProps<{
  title: string
  column: {
    getFilterValue: () => unknown
    setFilterValue: (value: unknown) => void
  }
}>()

const search = computed({
  get: () => (props.column.getFilterValue() as string | undefined) ?? '',
  set: (value: string) => props.column.setFilterValue(value || undefined),
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="shrink-0">{{ title }}</span>
    <Input v-model="search" placeholder="검색..." class="h-7 w-64 text-sm font-normal" />
  </div>
</template>
