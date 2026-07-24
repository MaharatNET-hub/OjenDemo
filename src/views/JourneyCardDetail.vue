<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { templateForDay } from '@/data/journeyContent'
import { useJourneyStore } from '@/stores/journey'
import { useLocaleStore } from '@/stores/locale'

const props = defineProps<{ day: number }>()
const journey = useJourneyStore()
const locale = useLocaleStore()
const router = useRouter()

const card = computed(() => journey.cards.find((c) => c.day === props.day) ?? null)
const status = computed(() => (card.value ? journey.statusFor(card.value) : 'locked'))
const template = computed(() => templateForDay(props.day))

onMounted(() => {
  if (card.value && (status.value === 'available' || status.value === 'expired')) {
    journey.markOpened(props.day)
  }
})

const messageInput = ref('')
function send() {
  if (!messageInput.value.trim()) return
  journey.sendCoachMessage(props.day, messageInput.value)
  messageInput.value = ''
  setTimeout(() => {
    journey.addCoachReply(props.day, locale.t('journeyCard.coachAutoReply'))
  }, 900)
}

function complete() {
  journey.completeCard(props.day)
}

function goBack() {
  router.push('/en/profile/active-package')
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-5">
    <button
      class="text-sm text-ojen-muted hover:text-ojen-gold flex items-center gap-1.5 transition"
      @click="goBack"
    >
      <Icon name="chevron" class="w-4 h-4" :class="locale.dir === 'rtl' ? '-rotate-90' : 'rotate-90'" /> {{ locale.t('journeyCard.backToActivePackage') }}
    </button>

    <div v-if="!journey.enrollment || !card" class="rounded-xl border border-ojen-border bg-ojen-panel p-8 text-center">
      <p class="text-ojen-muted">{{ locale.t('activePackage.noEnrollmentMessage') }}</p>
    </div>

    <div v-else-if="status === 'locked'" class="rounded-xl border border-ojen-border bg-ojen-panel p-8 text-center">
      <Icon name="lock" class="w-8 h-8 text-ojen-muted mx-auto mb-3" />
      <p class="text-ojen-muted">{{ locale.t('journeyCard.cardLocked') }}</p>
    </div>

    <template v-else>
      <div class="rounded-xl border border-ojen-gold/50 bg-ojen-panel p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-ojen-gold tracking-[0.2em] font-semibold text-sm">OJEN JOURNEY</span>
          <Icon name="bell" class="w-4 h-4 text-ojen-muted" />
        </div>

        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <p class="text-xs text-ojen-gold font-semibold tracking-widest mb-1">
              {{ locale.t('journeyCard.dayOfTotal', { day, total: journey.totalDays }) }}
            </p>
            <h1 class="text-2xl font-bold mb-2">{{ locale.t(template.titleKey) }}</h1>
            <p class="text-sm text-ojen-muted max-w-[220px]">{{ locale.t(template.descriptionKey) }}</p>
          </div>
          <span
            class="w-16 h-16 rounded-full bg-ojen-gold/10 border border-ojen-gold/40 flex items-center justify-center shrink-0"
          >
            <Icon :name="template.icon" class="w-7 h-7 text-ojen-gold" />
          </span>
        </div>

        <p class="text-xs text-ojen-gold font-semibold tracking-widest mb-2">
          {{ locale.t('journeyCard.todaysPractice') }}
        </p>
        <p class="text-sm mb-3">{{ locale.t(template.practiceKey) }}</p>
        <ul class="space-y-2 mb-6">
          <li v-for="(checkKey, i) in template.checklistKeys" :key="checkKey">
            <button
              type="button"
              class="w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-start transition"
              :class="
                card.checkedItems.includes(i)
                  ? 'border-ojen-gold bg-ojen-gold/10'
                  : 'border-ojen-border hover:border-ojen-gold'
              "
              :disabled="status === 'completed'"
              @click="journey.toggleChecklistItem(day, i)"
            >
              <span
                class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                :class="card.checkedItems.includes(i) ? 'bg-ojen-gold border-ojen-gold' : 'border-ojen-border'"
              >
                <Icon v-if="card.checkedItems.includes(i)" name="check" class="w-3.5 h-3.5 text-ojen-ink" />
              </span>
              {{ locale.t(checkKey) }}
            </button>
          </li>
        </ul>

        <div class="rounded-lg border border-ojen-border bg-ojen-panel-light p-4 mb-6">
          <p class="text-xs text-ojen-gold font-semibold tracking-widest mb-2 flex items-center gap-1.5">
            <Icon name="edit" class="w-3.5 h-3.5" /> {{ locale.t('journeyCard.reflectionTitle') }}
          </p>
          <p class="text-xs text-ojen-muted mb-3">{{ locale.t('journeyCard.reflectionPrompt') }}</p>
          <textarea
            :value="card.reflection"
            :disabled="status === 'completed'"
            rows="3"
            :placeholder="locale.t('journeyCard.reflectionPlaceholder')"
            class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm focus:outline-none focus:border-ojen-gold resize-none disabled:opacity-60"
            @input="journey.setReflection(day, ($event.target as HTMLTextAreaElement).value)"
          />
        </div>

        <p class="text-xs text-ojen-gold font-semibold tracking-widest mb-2">
          {{ locale.t('journeyCard.messageYourCoach') }}
        </p>
        <div class="rounded-lg border border-ojen-border bg-ojen-panel-light p-3 mb-3 max-h-56 overflow-y-auto space-y-2">
          <p v-if="card.coachMessages.length === 0" class="text-xs text-ojen-muted text-center py-3">
            {{ locale.t('journeyCard.messagePlaceholder') }}
          </p>
          <div
            v-for="(msg, i) in card.coachMessages"
            :key="i"
            class="flex"
            :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-lg px-3 py-2 text-sm"
              :class="msg.from === 'user' ? 'bg-ojen-gold text-ojen-ink' : 'bg-ojen-panel border border-ojen-border'"
            >
              <p v-if="msg.from === 'coach'" class="text-[10px] text-ojen-gold font-semibold mb-0.5">
                {{ locale.t('journeyCard.yourCoach') }}
              </p>
              {{ msg.text }}
            </div>
          </div>
        </div>
        <form class="flex items-center gap-2 mb-6" @submit.prevent="send">
          <input
            v-model="messageInput"
            type="text"
            :placeholder="locale.t('journeyCard.messagePlaceholder')"
            class="flex-1 rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm focus:outline-none focus:border-ojen-gold"
          />
          <button
            type="submit"
            class="w-10 h-10 rounded-full bg-ojen-gold text-ojen-ink flex items-center justify-center hover:bg-ojen-gold-light transition shrink-0"
          >
            <Icon name="send" class="w-4 h-4" />
          </button>
        </form>

        <p v-if="status === 'completed'" class="text-sm text-emerald-400 text-center flex items-center justify-center gap-1.5">
          <Icon name="check-circle" class="w-4 h-4" /> {{ locale.t('journeyCard.alreadyCompleted') }}
        </p>
        <button
          v-else-if="status === 'available'"
          class="w-full rounded-md bg-ojen-gold text-ojen-ink font-semibold py-3 text-sm hover:bg-ojen-gold-light transition"
          @click="complete"
        >
          {{ locale.t('journeyCard.markComplete') }}
        </button>
        <p v-else class="text-sm text-amber-400 text-center">{{ locale.t('activePackage.expiredCards') }}</p>
      </div>
    </template>
  </div>
</template>
