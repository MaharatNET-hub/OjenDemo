import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { BadgeId, CardStatus, JourneyCardState, JourneyEnrollment } from '@/types'
import { BADGES, JOURNEY_PROGRAMS } from '@/data/journeyContent'

const STORAGE_KEY = 'ojen-journey-demo-v1'
const DAY_MS = 24 * 60 * 60 * 1000

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function daysBetween(fromStr: string, toStr: string): number {
  return Math.floor((new Date(toStr).getTime() - new Date(fromStr).getTime()) / DAY_MS)
}

function loadPersisted(): JourneyEnrollment | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as JourneyEnrollment) : null
  } catch {
    return null
  }
}

export const useJourneyStore = defineStore('journey', () => {
  const enrollment = ref<JourneyEnrollment | null>(loadPersisted())

  watch(
    enrollment,
    (value) => {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      else localStorage.removeItem(STORAGE_KEY)
    },
    { deep: true },
  )

  const cards = computed(() => enrollment.value?.cards ?? [])
  const totalDays = computed(() => enrollment.value?.totalDays ?? 0)

  /** 1-indexed. Day 1 is the start date; advances with real elapsed days plus the demo offset. */
  const currentDayNumber = computed(() => {
    if (!enrollment.value) return 0
    const elapsed = daysBetween(enrollment.value.startDate, todayStr())
    const raw = elapsed + enrollment.value.demoOffsetDays + 1
    return Math.min(Math.max(raw, 1), totalDays.value)
  })

  function statusFor(card: JourneyCardState): CardStatus {
    if (card.completedAt) return 'completed'
    if (card.day > currentDayNumber.value) return 'locked'
    if (card.day === currentDayNumber.value) return 'available'
    return 'expired'
  }

  const completedCount = computed(() => cards.value.filter((c) => c.completedAt).length)
  const expiredCount = computed((): number => cards.value.filter((c) => statusFor(c) === 'expired').length)
  const openedNoResponseCount = computed(
    (): number => cards.value.filter((c) => statusFor(c) === 'expired' && c.opened).length,
  )
  const lockedCount = computed((): number => cards.value.filter((c) => statusFor(c) === 'locked').length)
  const currentCard = computed<JourneyCardState | null>(
    () => cards.value.find((c) => statusFor(c) === 'available') ?? null,
  )
  const nextLockedDay = computed<number | null>(() => {
    const locked = cards.value.filter((c) => statusFor(c) === 'locked')
    return locked.length ? Math.min(...locked.map((c) => c.day)) : null
  })
  const lastCompletedCard = computed<JourneyCardState | null>(() => {
    const completed = cards.value.filter((c) => c.completedAt)
    if (!completed.length) return null
    return completed.reduce((latest, c) => (c.day > latest.day ? c : latest))
  })
  const progressPercent = computed(() =>
    totalDays.value === 0 ? 0 : (completedCount.value / totalDays.value) * 100,
  )
  const completionRate = computed(() => progressPercent.value)

  const streak = computed(() => {
    if (!enrollment.value) return 0
    let count = 0
    let day = currentDayNumber.value
    const today = cards.value.find((c) => c.day === day)
    if (today?.completedAt) {
      count = 1
      day -= 1
    } else {
      day -= 1
    }
    while (day >= 1) {
      const card = cards.value.find((c) => c.day === day)
      if (card?.completedAt) {
        count += 1
        day -= 1
      } else break
    }
    return count
  })

  const badgeUnlocked = computed<Record<BadgeId, boolean>>(() => {
    const fraction = totalDays.value === 0 ? 0 : completedCount.value / totalDays.value
    const result = {} as Record<BadgeId, boolean>
    for (const badge of BADGES) {
      if (badge.id === 'weekWarrior') result[badge.id] = streak.value >= badge.threshold
      else if (badge.id === 'firstStep') result[badge.id] = completedCount.value >= 1
      else result[badge.id] = fraction >= badge.threshold
    }
    return result
  })

  function subscribe(programId: string) {
    const program = JOURNEY_PROGRAMS.find((p) => p.id === programId)
    if (!program) return
    const start = todayStr()
    const journeyCards: JourneyCardState[] = Array.from({ length: program.durationDays }, (_, i) => ({
      day: i + 1,
      opened: false,
      checkedItems: [],
      reflection: '',
      coachMessages: [],
      completedAt: null,
    }))
    enrollment.value = {
      id: `enroll-${Date.now()}`,
      programId: program.id,
      journeyNameKey: program.nameKey,
      startDate: start,
      endDate: addDays(start, program.durationDays),
      totalDays: program.durationDays,
      demoOffsetDays: 0,
      cards: journeyCards,
    }
  }

  function markOpened(day: number) {
    const card = cards.value.find((c) => c.day === day)
    if (card) card.opened = true
  }

  function toggleChecklistItem(day: number, index: number) {
    const card = cards.value.find((c) => c.day === day)
    if (!card) return
    const pos = card.checkedItems.indexOf(index)
    if (pos >= 0) card.checkedItems.splice(pos, 1)
    else card.checkedItems.push(index)
  }

  function setReflection(day: number, text: string) {
    const card = cards.value.find((c) => c.day === day)
    if (card) card.reflection = text
  }

  function sendCoachMessage(day: number, text: string) {
    const card = cards.value.find((c) => c.day === day)
    if (!card || !text.trim()) return
    card.coachMessages.push({ from: 'user', text: text.trim(), at: new Date().toISOString() })
  }

  function addCoachReply(day: number, text: string) {
    const card = cards.value.find((c) => c.day === day)
    if (card) card.coachMessages.push({ from: 'coach', text, at: new Date().toISOString() })
  }

  function completeCard(day: number) {
    const card = cards.value.find((c) => c.day === day)
    if (!card || statusFor(card) !== 'available') return
    card.completedAt = new Date().toISOString()
  }

  function advanceDemoDay() {
    if (enrollment.value) enrollment.value.demoOffsetDays += 1
  }

  function resetJourney() {
    enrollment.value = null
  }

  return {
    enrollment,
    cards,
    totalDays,
    currentDayNumber,
    statusFor,
    completedCount,
    expiredCount,
    openedNoResponseCount,
    lockedCount,
    currentCard,
    nextLockedDay,
    lastCompletedCard,
    progressPercent,
    completionRate,
    streak,
    badgeUnlocked,
    subscribe,
    markOpened,
    toggleChecklistItem,
    setReflection,
    sendCoachMessage,
    addCoachReply,
    completeCard,
    advanceDemoDay,
    resetJourney,
  }
})
