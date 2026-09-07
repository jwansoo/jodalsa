export function useCountdown(onExpire: () => void) {
  const remainingSeconds = ref(0)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | undefined

  const tick = () => {
    intervalId = setInterval(() => {
      remainingSeconds.value -= 1
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0
        stop()
        onExpire()
      }
    }, 1000)
  }

  const stop = () => {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }
    isRunning.value = false
  }

  const start = (durationSeconds: number) => {
    stop()
    remainingSeconds.value = durationSeconds
    isRunning.value = true
    tick()
  }

  const resume = () => {
    if (isRunning.value || remainingSeconds.value <= 0) return
    isRunning.value = true
    tick()
  }

  onUnmounted(stop)

  const formatted = computed(() => {
    const total = Math.max(remainingSeconds.value, 0)
    const minutes = Math.floor(total / 60)
    const seconds = total % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })

  return { remainingSeconds, formatted, isRunning, start, stop, resume }
}
