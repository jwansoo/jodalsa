<script setup lang="ts">
import { courseList, courseMaterialPath } from '@/utils/courseList'
import { courseMaterialSignedUrlQuery } from '@/utils/supaQuerys'

// Lazy-loaded: pdfjs-dist is heavy and should only be fetched once a user actually opens a PDF.
const CoursePdfViewer = defineAsyncComponent(
  () => import('@/components/course/CoursePdfViewer.vue'),
)

const openChapters = ref<Record<number, boolean>>({})
const loadingKey = ref<string | null>(null)
const viewerOpen = ref(false)
const viewerUrl = ref<string | null>(null)
const viewerTitle = ref('')

const toggleChapter = (index: number) => {
  openChapters.value[index] = !openChapters.value[index]
}

const openMaterial = async (subjectIndex: number, subtitleIndex: number) => {
  const key = `${subjectIndex}-${subtitleIndex}`
  if (loadingKey.value) return
  loadingKey.value = key

  const chapter = courseList[subjectIndex]
  const path = courseMaterialPath(subtitleIndex)
  const { data, error } = chapter
    ? await courseMaterialSignedUrlQuery(chapter.storageBucket, path)
    : { data: null, error: null }

  if (error || !data) {
    if (error) useErrorStore().setError({ error })
  } else {
    viewerTitle.value = chapter?.children[subtitleIndex] ?? ''
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
  <div class="flex flex-col gap-1 px-2 py-1 text-sm">
    <div v-for="(chapter, index) in courseList" :key="chapter.title">
      <button
        type="button"
        class="flex w-full items-center gap-1 rounded-sm px-2 py-1.5 text-left hover:bg-muted"
        @click="toggleChapter(index)"
      >
        <iconify-icon
          :icon="openChapters[index] ? 'lucide:chevron-down' : 'lucide:chevron-right'"
          class="shrink-0"
        />
        <span class="truncate">{{ chapter.title }}</span>
      </button>
      <ul v-if="openChapters[index]" class="flex flex-col gap-0.5 py-1 pl-6">
        <li v-for="(item, itemIndex) in chapter.children" :key="item">
          <button
            type="button"
            class="flex w-full items-center gap-1 truncate rounded-sm px-2 py-1 text-left text-muted-foreground hover:bg-muted"
            :disabled="loadingKey === `${index}-${itemIndex}`"
            @click="openMaterial(index, itemIndex)"
          >
            <iconify-icon
              :icon="
                loadingKey === `${index}-${itemIndex}` ? 'lucide:loader-circle' : 'lucide:file-text'
              "
              class="shrink-0"
              :class="{ 'animate-spin': loadingKey === `${index}-${itemIndex}` }"
            />
            <span class="truncate">{{ item }}</span>
          </button>
        </li>
      </ul>
    </div>
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
