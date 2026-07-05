import { type Ref, ref, watch } from 'vue'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/** Tweens a displayed number toward `source` like a speedometer needle sweeping to its reading. */
export function useAnimatedNumber(source: Ref<number>, durationMs = 1100): Ref<number> {
  const display = ref(0)
  let frame = 0

  function animate(from: number, to: number) {
    cancelAnimationFrame(frame)
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / durationMs)
      display.value = from + (to - from) * easeOutCubic(progress)
      if (progress < 1) frame = requestAnimationFrame(step)
      else display.value = to
    }
    frame = requestAnimationFrame(step)
  }

  watch(
    source,
    (value, oldValue) => {
      animate(oldValue ?? 0, value)
    },
    { immediate: true },
  )

  return display
}
