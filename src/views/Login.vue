<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'
import Icon from '@/components/Icon.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const locale = useLocaleStore()
const theme = useThemeStore()

function continueDemo() {
  auth.login()
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/en/profile/ql-overview'
  router.push(redirect)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-ojen-bg px-4 relative">
    <div class="absolute top-4 end-4 flex items-center gap-2">
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full border border-ojen-border hover:border-ojen-gold"
        @click="theme.toggleTheme"
      >
        <Icon :name="theme.theme === 'dark' ? 'sun' : 'moon'" class="w-4 h-4" />
      </button>
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full border border-ojen-border text-xs font-semibold hover:border-ojen-gold"
        @click="locale.toggleLocale"
      >
        {{ locale.locale === 'ar' ? 'EN' : 'AR' }}
      </button>
    </div>
    <div class="w-full max-w-sm rounded-xl border border-ojen-border bg-ojen-panel p-8 text-center">
      <div class="mx-auto mb-6 w-40 border border-ojen-gold/60 rounded px-4 py-2 text-ojen-gold tracking-widest text-2xl">
        OJEN
      </div>
      <h1 class="text-lg font-semibold mb-1">{{ locale.t('login.title') }}</h1>
      <p class="text-sm text-ojen-muted mb-6">{{ locale.t('login.subtitle') }}</p>
      <button
        class="w-full rounded-md bg-ojen-gold text-ojen-ink font-semibold py-2.5 hover:bg-ojen-gold-light transition"
        @click="continueDemo"
      >
        {{ locale.t('login.continueDemo') }}
      </button>
      <p class="mt-4 text-xs text-ojen-muted">{{ locale.t('login.noPassword') }}</p>
    </div>
  </div>
</template>
