export function useCountdown(onExpire: () => void) {
  const remainingSeconds = ref(0)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | undefined
  // Deadline-based rather than decrement-per-tick, so a throttled/backgrounded
  // tab's delayed setInterval firings still resolve to the correct elapsed time
  // instead of granting extra time during an exam period.
  let deadline = 0

  const update = () => {
    const secondsLeft = Math.ceil((deadline - Date.now()) / 1000)
    if (secondsLeft <= 0) {
      remainingSeconds.value = 0
      stop()
      onExpire()
    } else {
      remainingSeconds.value = secondsLeft
    }
  }

  const tick = () => {
    intervalId = setInterval(update, 1000)
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
    deadline = Date.now() + durationSeconds * 1000
    remainingSeconds.value = durationSeconds
    isRunning.value = true
    tick()
  }

  const resume = () => {
    if (isRunning.value || remainingSeconds.value <= 0) return
    deadline = Date.now() + remainingSeconds.value * 1000
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
