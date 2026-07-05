<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'
import { useLocaleStore } from '@/stores/locale'

const emit = defineEmits<{ 'toggle-sidebar': [] }>()
const ql = useQlStore()
const locale = useLocaleStore()

const showNotifications = ref(false)
const pendingCount = computed(() => ql.invitations.filter((i) => i.status === 'pending').length)
</script>

<template>
  <header class="sticky top-0 z-20 bg-ojen-panel/95 backdrop-blur border-b border-ojen-border">
    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
      <RouterLink to="/en/profile/ql-overview" class="shrink-0">
        <div class="border border-ojen-gold/60 rounded px-3 py-1 text-ojen-gold tracking-[0.2em] font-semibold">
          OJEN
        </div>
      </RouterLink>

      <nav class="hidden lg:flex items-center gap-7 text-sm font-medium text-ojen-text/90">
        <a href="#" class="hover:text-ojen-gold transition">{{ locale.t('nav.whoWeAre') }}</a>
        <a href="#" class="hover:text-ojen-gold transition">{{ locale.t('nav.whatWeDo') }}</a>
        <a href="#" class="hover:text-ojen-gold transition">{{ locale.t('nav.blog') }}</a>
        <a href="#" class="hover:text-ojen-gold transition">{{ locale.t('nav.letsConnect') }}</a>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <button
          class="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-ojen-border text-xs font-semibold hover:border-ojen-gold"
          @click="locale.toggleLocale"
        >
          {{ locale.locale === 'ar' ? 'EN' : 'AR' }}
        </button>

        <button
          class="flex items-center gap-2 rounded-full border border-ojen-border ps-1 pe-3 py-1 hover:border-ojen-gold transition"
          @click="emit('toggle-sidebar')"
        >
          <span class="w-7 h-7 rounded-full bg-ojen-gold/20 flex items-center justify-center">
            <Icon name="user" class="w-4 h-4 text-ojen-gold" />
          </span>
          <span class="hidden sm:inline text-sm max-w-[110px] truncate">{{ ql.companyName }}</span>
        </button>

        <div class="relative">
          <button
            class="w-9 h-9 flex items-center justify-center rounded-full border border-ojen-border hover:border-ojen-gold relative"
            @click="showNotifications = !showNotifications"
          >
            <Icon name="bell" class="w-4 h-4" />
            <span
              v-if="pendingCount > 0"
              class="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 text-[10px] leading-4 text-white text-center"
            >
              {{ pendingCount }}
            </span>
          </button>
          <div
            v-if="showNotifications"
            class="absolute end-0 mt-2 w-72 rounded-lg border border-ojen-border bg-ojen-panel shadow-xl p-3 text-sm text-start"
          >
            <p class="font-semibold mb-2">{{ locale.t('nav.notifications') }}</p>
            <p v-if="pendingCount === 0" class="text-ojen-muted">{{ locale.t('nav.noPending') }}</p>
            <ul v-else class="space-y-2">
              <li
                v-for="inv in ql.invitations.filter((i) => i.status === 'pending')"
                :key="inv.id"
                class="text-ojen-muted"
              >
                {{ locale.t('nav.pulseSurveyPendingFrom') }} <span class="text-ojen-text">{{ inv.email }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="hidden md:flex flex-col items-start rounded-full border border-ojen-border px-3 py-1.5 text-xs">
          <span class="text-ojen-muted">{{ locale.t('nav.needHelp') }}</span>
          <span class="font-semibold" dir="ltr">00971553033998</span>
        </div>
      </div>
    </div>
  </header>
</template>
