<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

const props = defineProps<{ url: string | null }>()

const pageCanvases = ref<(HTMLCanvasElement | null)[]>([])
const pageCount = ref(0)
const scale = ref(1.4)
const isLoading = ref(false)

let loadingTask: PDFDocumentLoadingTask | null = null
let pdfDoc: PDFDocumentProxy | null = null
let renderTasks: (RenderTask | null)[] = []

const setPageCanvas = (el: Element | null, index: number) => {
  pageCanvases.value[index] = el as HTMLCanvasElement | null
}

const destroyDoc = () => {
  renderTasks.forEach((task) => task?.cancel())
  renderTasks = []
  loadingTask?.destroy()
  loadingTask = null
  pdfDoc = null
  pageCount.value = 0
  pageCanvases.value = []
}

// Some malformed pages (bad content streams from certain PDF producers) never
// settle their render task's promise, which would otherwise stall every page after it.
const PAGE_RENDER_TIMEOUT_MS = 15000

const renderAllPages = async () => {
  if (!pdfDoc) return
  await nextTick()

  for (let index = 0; index < pdfDoc.numPages; index++) {
    const canvas = pageCanvases.value[index]
    if (!canvas) continue

    const page = await pdfDoc.getPage(index + 1)
    const viewport = page.getViewport({ scale: scale.value })
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext('2d')
    if (!context) continue

    renderTasks[index]?.cancel()
    const task = page.render({ canvasContext: context, viewport, canvas })
    renderTasks[index] = task
    try {
      await Promise.race([
        task.promise,
        new Promise((_resolve, reject) =>
          setTimeout(() => reject(new Error('PageRenderTimeout')), PAGE_RENDER_TIMEOUT_MS),
        ),
      ])
    } catch (error) {
      if (error instanceof Error && error.message === 'PageRenderTimeout') {
        task.cancel()
        continue
      }
      if (!(error instanceof Error) || error.name !== 'RenderingCancelledException') throw error
    }
  }
}

const loadDocument = async (url: string) => {
  destroyDoc()
  isLoading.value = true
  try {
    loadingTask = pdfjsLib.getDocument({ url })
    pdfDoc = await loadingTask.promise
    pageCount.value = pdfDoc.numPages
    renderTasks = Array.from({ length: pdfDoc.numPages }, () => null)
    pageCanvases.value = Array.from({ length: pdfDoc.numPages }, () => null)
    isLoading.value = false
    await renderAllPages()
  } catch (error) {
    useErrorStore().setError({ error: error instanceof Error ? error : String(error) })
    isLoading.value = false
  }
}

watch(
  () => props.url,
  (url) => {
    if (url) loadDocument(url)
    else destroyDoc()
  },
  { immediate: true },
)

onUnmounted(destroyDoc)

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.6)
  renderAllPages()
}
const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 3)
  renderAllPages()
}
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <div class="flex items-center justify-center gap-2 border-b pb-2">
      <span class="text-muted-foreground text-sm">전체 {{ pageCount || '-' }}쪽</span>
      <span class="mx-2 h-5 w-px bg-border" />
      <Button variant="outline" size="icon" @click="zoomOut">
        <iconify-icon icon="lucide:zoom-out" />
      </Button>
      <Button variant="outline" size="icon" @click="zoomIn">
        <iconify-icon icon="lucide:zoom-in" />
      </Button>
    </div>
    <div
      class="bg-muted/30 relative flex flex-1 flex-col items-center gap-4 overflow-auto rounded-md p-4"
    >
      <p v-if="isLoading" class="text-muted-foreground">불러오는 중...</p>
      <canvas
        v-for="index in pageCount"
        v-show="!isLoading"
        :key="index"
        :ref="(el) => setPageCanvas(el as Element | null, index - 1)"
        class="select-none shadow"
        @contextmenu.prevent
      />
    </div>
  </div>
</template>

<style scoped></style>
