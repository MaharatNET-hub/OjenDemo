<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useLocaleStore } from '@/stores/locale'

const locale = useLocaleStore()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-ojen-bg text-center px-4">
    <div>
      <p class="text-6xl font-bold text-ojen-gold mb-2">{{ locale.t('notFound.title') }}</p>
      <p class="text-ojen-muted mb-6">{{ locale.t('notFound.message') }}</p>
      <RouterLink
        to="/en/profile/ql-overview"
        class="rounded-md bg-ojen-gold text-ojen-ink font-semibold px-5 py-2.5 hover:bg-ojen-gold-light transition"
      >
        {{ locale.t('notFound.backToDashboard') }}
      </RouterLink>
    </div>
  </div>
</template>
