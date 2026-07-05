<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

function continueDemo() {
  auth.login()
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/en/profile/ql-overview'
  router.push(redirect)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-ojen-bg px-4">
    <div class="w-full max-w-sm rounded-xl border border-ojen-border bg-ojen-panel p-8 text-center">
      <div class="mx-auto mb-6 w-40 border border-ojen-gold/60 rounded px-4 py-2 text-ojen-gold tracking-widest text-2xl">
        OJEN
      </div>
      <h1 class="text-lg font-semibold mb-1">Corporate Portal</h1>
      <p class="text-sm text-ojen-muted mb-6">Sign in to view your Quality of Life dashboard.</p>
      <button
        class="w-full rounded-md bg-ojen-gold text-ojen-bg font-semibold py-2.5 hover:bg-ojen-gold-light transition"
        @click="continueDemo"
      >
        Continue as HrCompany (Demo)
      </button>
      <p class="mt-4 text-xs text-ojen-muted">No password needed — this is a self-contained demo.</p>
    </div>
  </div>
</template>
