<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-ojen-bg text-center px-4">
    <div>
      <p class="text-6xl font-bold text-ojen-gold mb-2">404</p>
      <p class="text-ojen-muted mb-6">This page doesn't exist.</p>
      <RouterLink
        to="/en/profile/ql-overview"
        class="rounded-md bg-ojen-gold text-ojen-bg font-semibold px-5 py-2.5 hover:bg-ojen-gold-light transition"
      >
        Back to Dashboard
      </RouterLink>
    </div>
  </div>
</template>
