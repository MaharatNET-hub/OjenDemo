<script setup lang="ts">
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { JOURNEY_PROGRAMS } from '@/data/journeyContent'
import { useJourneyStore } from '@/stores/journey'
import { useLocaleStore } from '@/stores/locale'

const journey = useJourneyStore()
const locale = useLocaleStore()
const router = useRouter()

function subscribe(programId: string) {
  journey.subscribe(programId)
  router.push('/en/profile/active-package')
}
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">{{ locale.t('journeysCatalog.title') }}</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">{{ locale.t('journeysCatalog.breadcrumb') }}</p>
      <p class="text-ojen-muted max-w-2xl">{{ locale.t('journeysCatalog.subtitle') }}</p>

      <div
        v-if="journey.enrollment"
        class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4 flex items-center justify-between gap-4 flex-wrap"
      >
        <p class="text-sm">
          {{ locale.t('journeysCatalog.enrolledNotice', { journey: locale.t(journey.enrollment.journeyNameKey) }) }}
        </p>
        <RouterLink
          to="/en/profile/active-package"
          class="rounded-md bg-ojen-gold text-ojen-ink font-semibold px-4 py-2 text-sm hover:bg-ojen-gold-light transition shrink-0"
        >
          {{ locale.t('journeysCatalog.viewMyCards') }}
        </RouterLink>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="program in JOURNEY_PROGRAMS"
          :key="program.id"
          class="rounded-xl border border-ojen-border bg-ojen-panel p-5 flex flex-col"
        >
          <span class="w-10 h-10 rounded-lg bg-ojen-gold/20 flex items-center justify-center mb-4">
            <Icon :name="program.icon" class="w-5 h-5 text-ojen-gold" />
          </span>
          <h2 class="font-semibold mb-1">{{ locale.t(program.nameKey) }}</h2>
          <p class="text-xs text-ojen-gold font-medium mb-2">
            {{ locale.t('journeysCatalog.days', { n: program.durationDays }) }}
          </p>
          <p class="text-sm text-ojen-muted mb-4 flex-1">{{ locale.t(program.descriptionKey) }}</p>
          <p class="text-xs text-ojen-muted mb-3">
            {{ locale.t('journeysCatalog.startingFrom') }}
            <span class="text-ojen-text font-semibold" dir="ltr">${{ program.priceLabel }}</span>
          </p>
          <button
            class="w-full rounded-md bg-ojen-gold text-ojen-ink font-semibold py-2.5 text-sm hover:bg-ojen-gold-light transition"
            @click="subscribe(program.id)"
          >
            {{ locale.t('journeysCatalog.subscribe') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
