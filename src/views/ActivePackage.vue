<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import CardStackPreview from '@/components/journey/CardStackPreview.vue'
import { BADGES, templateForDay } from '@/data/journeyContent'
import { useJourneyStore } from '@/stores/journey'
import { useLocaleStore } from '@/stores/locale'
import { downloadTextFile, toCsvRow } from '@/utils/downloadFile'

const journey = useJourneyStore()
const locale = useLocaleStore()

const showAchievements = ref(false)
const toastMessage = ref<string | null>(null)

function showToast(message: string) {
  toastMessage.value = message
  setTimeout(() => (toastMessage.value = null), 2500)
}

const completedCardLink = computed(() =>
  journey.completedCount > 0 && journey.lastCompletedCard
    ? `/en/profile/active-package/card/${journey.lastCompletedCard.day}`
    : undefined,
)

function exportSurveyAnswers() {
  const withReflection = journey.cards.filter((c) => c.reflection.trim())
  if (!withReflection.length) {
    showToast(locale.t('activePackage.nothingToExport'))
    return
  }
  const rows = [toCsvRow(['Day', 'Exercise', 'Reflection'])]
  withReflection.forEach((c) => {
    rows.push(toCsvRow([c.day, locale.t(templateForDay(c.day).titleKey), c.reflection]))
  })
  downloadTextFile(`ojen-journey-reflections-${journey.enrollment?.id ?? 'demo'}.csv`, rows.join(''))
  showToast(locale.t('activePackage.exportedToast'))
}

function exportCardAnswers() {
  const withAnswers = journey.cards.filter((c) => c.opened || c.completedAt)
  if (!withAnswers.length) {
    showToast(locale.t('activePackage.nothingToExport'))
    return
  }
  const rows = [toCsvRow(['Day', 'Status', 'Exercise', 'Checklist', 'Reflection', 'Coach Messages', 'Completed At'])]
  withAnswers.forEach((c) => {
    const tpl = templateForDay(c.day)
    const checklist = tpl.checklistKeys
      .map((key, i) => `${c.checkedItems.includes(i) ? '[x]' : '[ ]'} ${locale.t(key)}`)
      .join(' | ')
    const coach = c.coachMessages.map((m) => `${m.from}: ${m.text}`).join(' | ')
    rows.push(toCsvRow([c.day, journey.statusFor(c), locale.t(tpl.titleKey), checklist, c.reflection, coach, c.completedAt ?? '']))
  })
  downloadTextFile(`ojen-journey-card-answers-${journey.enrollment?.id ?? 'demo'}.csv`, rows.join(''))
  showToast(locale.t('activePackage.exportedToast'))
}

const currentCardTemplate = computed(() =>
  journey.currentCard ? templateForDay(journey.currentCard.day) : null,
)

const streakMotivationKey = computed(() =>
  journey.streak > 0 ? 'activePackage.streakMotivationActive' : 'activePackage.streakMotivationZero',
)
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">{{ locale.t('activePackage.title') }}</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">{{ locale.t('activePackage.breadcrumb') }}</p>

      <div
        v-if="toastMessage"
        class="rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-sm px-4 py-3"
      >
        {{ toastMessage }}
      </div>

      <div v-if="!journey.enrollment" class="rounded-xl border border-ojen-border bg-ojen-panel p-10 text-center">
        <Icon name="briefcase" class="w-8 h-8 text-ojen-gold mx-auto mb-3" />
        <p class="font-semibold mb-1">{{ locale.t('activePackage.noEnrollmentTitle') }}</p>
        <p class="text-sm text-ojen-muted mb-4">{{ locale.t('activePackage.noEnrollmentMessage') }}</p>
        <RouterLink
          to="/en/journeys"
          class="inline-block rounded-md bg-ojen-gold text-ojen-ink font-semibold px-5 py-2.5 text-sm hover:bg-ojen-gold-light transition"
        >
          {{ locale.t('activePackage.browseJourneys') }}
        </RouterLink>
      </div>

      <template v-else>
        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-md border border-ojen-border px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:border-ojen-gold hover:text-ojen-gold transition"
            @click="exportSurveyAnswers"
          >
            <Icon name="send" class="w-4 h-4" /> {{ locale.t('activePackage.exportSurveyAnswers') }}
          </button>
          <button
            class="rounded-md bg-ojen-gold text-ojen-ink px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-ojen-gold-light transition"
            @click="exportCardAnswers"
          >
            <Icon name="credit-card" class="w-4 h-4" /> {{ locale.t('activePackage.exportCardAnswers') }}
          </button>
        </div>

        <!-- Progress / Streak / Badges -->
        <div class="grid lg:grid-cols-3 gap-4">
          <div class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
            <p class="font-semibold flex items-center gap-2 mb-4">
              <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('activePackage.progressInProgram') }}
            </p>
            <div class="h-2 rounded-full bg-ojen-panel-light relative mb-3">
              <div
                class="h-2 rounded-full bg-ojen-gold"
                :style="{ width: Math.max(2, journey.progressPercent) + '%' }"
              />
            </div>
            <div class="flex items-center justify-between text-xs text-ojen-muted">
              <span>{{ Math.round(journey.progressPercent * 10) / 10 }}%</span>
              <span>{{ locale.t('activePackage.daysComplete', { completed: journey.completedCount, total: journey.totalDays }) }}</span>
            </div>
          </div>

          <div class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
            <p class="font-semibold flex items-center gap-2 mb-4">
              <Icon name="zap" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('activePackage.dailyStreak') }}
            </p>
            <p class="text-4xl font-bold text-center mb-1">{{ journey.streak }}</p>
            <p class="text-xs text-ojen-muted text-center mb-3">{{ locale.t('activePackage.consecutiveDays') }}</p>
            <p class="text-xs text-ojen-gold text-center">{{ locale.t(streakMotivationKey) }}</p>
          </div>

          <div class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="font-semibold flex items-center gap-2">
                <Icon name="crown" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('activePackage.achievementBadges') }}
              </p>
              <button class="text-xs text-ojen-gold hover:underline" @click="showAchievements = true">
                {{ locale.t('activePackage.myAchievements') }}
              </button>
            </div>
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="badge in BADGES"
                :key="badge.id"
                class="rounded-lg border p-2 flex flex-col items-center justify-center gap-1 text-center"
                :class="
                  journey.badgeUnlocked[badge.id]
                    ? 'border-ojen-gold bg-ojen-gold/10'
                    : 'border-ojen-border opacity-40'
                "
              >
                <Icon :name="badge.icon" class="w-4 h-4" :class="journey.badgeUnlocked[badge.id] ? 'text-ojen-gold' : 'text-ojen-muted'" />
                <span class="text-[9px] leading-tight">{{ locale.t(badge.labelKey) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card stacks -->
        <div class="rounded-xl border border-ojen-border bg-ojen-panel p-6">
          <div class="grid sm:grid-cols-3 gap-8 justify-items-center">
            <div class="text-center">
              <p class="text-xs tracking-widest text-ojen-muted mb-3 flex items-center justify-center gap-1.5">
                <Icon name="credit-card" class="w-3.5 h-3.5" /> {{ locale.t('activePackage.remainingCards').toUpperCase() }}
              </p>
              <CardStackPreview
                variant="locked"
                :count="journey.lockedCount"
                :top-day="journey.nextLockedDay"
                :day-label="locale.t('activePackage.dayLabel')"
                :status-label="locale.t('activePackage.locked').toUpperCase()"
                :empty-text="locale.t('activePackage.completedCardsWillStack')"
              />
            </div>

            <div class="text-center">
              <p class="text-xs tracking-widest text-ojen-muted mb-3 flex items-center justify-center gap-1.5">
                <Icon name="check-circle" class="w-3.5 h-3.5" /> {{ locale.t('activePackage.completedStack').toUpperCase() }}
              </p>
              <CardStackPreview
                variant="completed"
                :count="journey.completedCount"
                :top-day="journey.lastCompletedCard?.day ?? null"
                :day-label="locale.t('activePackage.dayLabel')"
                :status-label="locale.t('activePackage.complete').toUpperCase()"
                :empty-text="locale.t('activePackage.completedCardsWillStack')"
                :to="completedCardLink"
              />
              <p class="text-[11px] text-ojen-muted mt-3">
                {{ locale.t('activePackage.daysComplete', { completed: journey.completedCount, total: journey.totalDays }) }}
              </p>
              <RouterLink
                v-if="completedCardLink"
                :to="completedCardLink"
                class="block text-[11px] text-ojen-gold mt-1 hover:underline"
              >
                {{ locale.t('activePackage.tapToViewAnswers') }}
              </RouterLink>
            </div>

            <div class="text-center flex flex-col items-center">
              <div class="h-[220px] w-[170px] flex items-center justify-center">
                <RouterLink
                  v-if="journey.currentCard && currentCardTemplate"
                  :to="`/en/profile/active-package/card/${journey.currentCard.day}`"
                  class="h-full w-full rounded-xl border-2 border-ojen-gold flex flex-col items-center justify-center gap-2 hover:bg-ojen-gold/10 transition"
                >
                  <span class="text-ojen-gold tracking-[0.2em] font-semibold text-xs">OJEN</span>
                  <Icon :name="currentCardTemplate.icon" class="w-6 h-6 text-ojen-gold" />
                  <span class="rounded-full border border-ojen-gold px-3 py-1 text-xs font-semibold">
                    {{ locale.t('activePackage.dayLabel') }} {{ journey.currentCard.day }}
                  </span>
                  <span class="text-[10px] tracking-widest text-ojen-gold">{{ locale.t('activePackage.tapToOpen').toUpperCase() }}</span>
                </RouterLink>
                <div v-else class="flex flex-col items-center gap-2 text-ojen-muted">
                  <Icon name="building" class="w-8 h-8" />
                  <span class="text-xs tracking-widest">{{ locale.t('activePackage.noCurrentCard').toUpperCase() }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-ojen-border flex items-center justify-between flex-wrap gap-3">
            <p class="text-xs text-ojen-muted">
              {{ locale.t('journeyCard.dayOfTotal', { day: journey.currentDayNumber, total: journey.totalDays }) }}
            </p>
            <button
              class="text-xs rounded-md border border-ojen-border px-3 py-2 flex items-center gap-1.5 hover:border-ojen-gold hover:text-ojen-gold transition"
              @click="journey.advanceDemoDay()"
            >
              <Icon name="zap" class="w-3.5 h-3.5" /> {{ locale.t('activePackage.demoAdvanceDay') }}
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div>
          <h2 class="font-semibold flex items-center gap-2 mb-4">
            <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('activePackage.subscriptionStatistics') }}
          </h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="briefcase" class="w-5 h-5 text-ojen-gold" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.journeyName').toUpperCase() }}</p>
                <p class="text-sm font-semibold">{{ locale.t(journey.enrollment.journeyNameKey) }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="calendar" class="w-5 h-5 text-ojen-gold" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.startDate').toUpperCase() }}</p>
                <p class="text-sm font-semibold" dir="ltr">{{ journey.enrollment.startDate }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="calendar" class="w-5 h-5 text-ojen-gold" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.endDate').toUpperCase() }}</p>
                <p class="text-sm font-semibold" dir="ltr">{{ journey.enrollment.endDate }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="gauge" class="w-5 h-5 text-ojen-gold" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.completionRate').toUpperCase() }}</p>
                <p class="text-sm font-semibold">{{ Math.round(journey.completionRate * 10) / 10 }}%</p>
              </div>
            </div>
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="credit-card" class="w-5 h-5 text-ojen-gold" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.totalCards').toUpperCase() }}</p>
                <p class="text-sm font-semibold">{{ journey.totalDays }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="check-circle" class="w-5 h-5 text-emerald-400" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.completedCards').toUpperCase() }}</p>
                <p class="text-sm font-semibold">{{ journey.completedCount }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="clock" class="w-5 h-5 text-amber-400" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.expiredCards').toUpperCase() }}</p>
                <p class="text-sm font-semibold">{{ journey.expiredCount }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="eye" class="w-5 h-5 text-sky-400" />
              <div>
                <p class="text-[10px] tracking-widest text-ojen-muted mb-0.5">{{ locale.t('activePackage.openedWithoutResponse').toUpperCase() }}</p>
                <p class="text-sm font-semibold">{{ journey.openedNoResponseCount }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- My Achievements drawer -->
    <Transition name="fade">
      <div v-if="showAchievements" class="fixed inset-0 z-40 bg-black/50" @click="showAchievements = false" />
    </Transition>
    <Transition :name="locale.dir === 'rtl' ? 'slide-rtl' : 'slide-ltr'">
      <aside
        v-if="showAchievements"
        class="fixed inset-y-0 end-0 z-50 w-full max-w-sm bg-ojen-panel border-s border-ojen-border flex flex-col p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-semibold text-lg">{{ locale.t('activePackage.myAchievements') }}</h2>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full border border-ojen-border hover:border-ojen-gold"
            @click="showAchievements = false"
          >
            <Icon name="x" class="w-4 h-4" />
          </button>
        </div>

        <p class="text-sm text-ojen-muted mb-2">
          {{ locale.t('activePackage.daysComplete', { completed: journey.completedCount, total: journey.totalDays }) }}
        </p>
        <div class="h-1.5 rounded-full bg-ojen-panel-light mb-6">
          <div class="h-1.5 rounded-full bg-ojen-gold" :style="{ width: Math.max(2, journey.progressPercent) + '%' }" />
        </div>

        <div class="grid grid-cols-3 gap-3 mb-8">
          <div
            v-for="badge in BADGES"
            :key="badge.id"
            class="rounded-lg border p-3 flex flex-col items-center justify-center gap-1 text-center"
            :class="
              journey.badgeUnlocked[badge.id] ? 'border-ojen-gold bg-ojen-gold/10' : 'border-ojen-border opacity-40'
            "
          >
            <Icon :name="badge.icon" class="w-5 h-5" :class="journey.badgeUnlocked[badge.id] ? 'text-ojen-gold' : 'text-ojen-muted'" />
            <span class="text-[10px] leading-tight">{{ locale.t(badge.labelKey) }}</span>
          </div>
        </div>

        <p class="text-xs tracking-widest text-ojen-muted mb-3 flex items-center gap-1.5">
          <Icon name="check-circle" class="w-3.5 h-3.5" /> {{ locale.t('activePackage.completedStack').toUpperCase() }}
        </p>
        <div class="flex justify-center">
          <CardStackPreview
            variant="completed"
            :count="journey.completedCount"
            :top-day="journey.lastCompletedCard?.day ?? null"
            :day-label="locale.t('activePackage.dayLabel')"
            :status-label="locale.t('activePackage.complete').toUpperCase()"
            :empty-text="locale.t('activePackage.completedCardsWillStack')"
            :to="completedCardLink"
            @click="showAchievements = false"
          />
        </div>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.slide-ltr-enter-active,
.slide-ltr-leave-active,
.slide-rtl-enter-active,
.slide-rtl-leave-active {
  transition: transform 0.2s ease;
}
.slide-ltr-enter-from,
.slide-ltr-leave-to {
  transform: translateX(100%);
}
.slide-rtl-enter-from,
.slide-rtl-leave-to {
  transform: translateX(-100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
