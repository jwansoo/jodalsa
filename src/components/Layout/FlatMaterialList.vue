<script setup lang="ts">
import type { FlatMaterialItem } from '@/utils/courseList'
import { courseMaterialSignedUrlQuery } from '@/utils/supaQuerys'

const props = defineProps<{ items: FlatMaterialItem[] }>()

// Lazy-loaded: pdfjs-dist is heavy and should only be fetched once a user actually opens a PDF.
const CoursePdfViewer = defineAsyncComponent(
  () => import('@/components/course/CoursePdfViewer.vue'),
)

const loadingKey = ref<string | null>(null)
const viewerOpen = ref(false)
const viewerUrl = ref<string | null>(null)
const viewerTitle = ref('')

const openMaterial = async (index: number) => {
  if (loadingKey.value) return
  loadingKey.value = String(index)

  const item = props.items[index]
  const { data, error } = item
    ? await courseMaterialSignedUrlQuery(item.storageBucket, item.path)
    : { data: null, error: null }

  if (error || !data) {
    if (error) useErrorStore().setError({ error })
  } else {
    viewerTitle.value = item?.title ?? ''
    viewerUrl.value = data.signedUrl
    viewerOpen.value = true
  }

  loadingKey.value = null
}

watch(viewerOpen, (open) => {
  if (!open) viewerUrl.value = null
})
</script>

<template>
  <div class="flex flex-col gap-0.5 py-1 pl-6 text-sm">
    <button
      v-for="(item, index) in items"
      :key="item.title"
      type="button"
      class="flex w-full items-center gap-1 truncate rounded-sm px-2 py-1 text-left text-muted-foreground hover:bg-muted"
      :disabled="loadingKey === String(index)"
      @click="openMaterial(index)"
    >
      <iconify-icon
        :icon="loadingKey === String(index) ? 'lucide:loader-circle' : 'lucide:file-text'"
        class="shrink-0"
        :class="{ 'animate-spin': loadingKey === String(index) }"
      />
      <span class="truncate">{{ item.title }}</span>
    </button>
  </div>

  <Dialog v-model:open="viewerOpen">
    <DialogContent class="flex h-[95vh] w-[95vw] max-w-[95vw] flex-col sm:max-w-[95vw]">
      <DialogHeader>
        <DialogTitle class="truncate pr-6">{{ viewerTitle }}</DialogTitle>
      </DialogHeader>
      <CoursePdfViewer class="min-h-0 flex-1" :url="viewerUrl" />
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
