<script setup lang="ts">
import Icon from '@/components/Icon.vue'
</script>

<template>
  <footer class="border-t border-ojen-gold/40 mt-10">
    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="border border-ojen-gold/60 rounded px-4 py-2 text-ojen-gold tracking-[0.2em] font-semibold">
        OJEN
      </div>

      <div class="text-center">
        <p class="text-ojen-gold text-xs tracking-widest mb-2">LEGAL</p>
        <div class="flex items-center gap-3 text-sm text-ojen-muted">
          <a href="#" class="hover:text-ojen-text">Privacy Policy</a>
          <span>·</span>
          <a href="#" class="hover:text-ojen-text">Terms of Use</a>
        </div>
      </div>

      <div class="text-sm space-y-2">
        <p class="flex items-center gap-2"><Icon name="phone" class="w-4 h-4 text-ojen-gold" /> 00971553033998</p>
        <p class="flex items-center gap-2"><Icon name="mail" class="w-4 h-4 text-ojen-gold" /> Info@theojen.com</p>
      </div>
    </div>
    <p class="text-center text-xs text-ojen-muted pb-6">
      Copyright © 2026 <span class="text-ojen-gold">Ojen</span>
    </p>
  </footer>
</template>
