<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'

const open = ref(false)
</script>

<template>
  <div class="fixed bottom-6 right-6 z-30 flex items-center gap-3">
    <button
      class="hidden sm:flex items-center gap-2 rounded-full bg-white text-ojen-bg text-sm font-medium px-4 py-2.5 shadow-lg hover:shadow-xl transition"
      @click="open = !open"
    >
      Chat with us 👋
    </button>
    <button
      class="w-12 h-12 rounded-full bg-ojen-gold text-ojen-bg flex items-center justify-center shadow-lg hover:bg-ojen-gold-light transition"
      @click="open = !open"
    >
      <Icon name="chat" class="w-5 h-5" />
    </button>

    <div
      v-if="open"
      class="absolute bottom-16 right-0 w-72 rounded-xl border border-ojen-border bg-ojen-panel p-4 text-sm shadow-2xl"
    >
      <p class="font-semibold mb-1">Ojen Support</p>
      <p class="text-ojen-muted mb-3">This is a demo widget — live chat isn't connected in this build.</p>
      <a href="mailto:Info@theojen.com" class="text-ojen-gold hover:underline">Info@theojen.com</a>
    </div>
  </div>
</template>
