<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'

const emit = defineEmits<{ 'toggle-sidebar': [] }>()
const ql = useQlStore()

const isRtl = ref(document.documentElement.dir === 'rtl')
function toggleLang() {
  isRtl.value = !isRtl.value
  document.documentElement.dir = isRtl.value ? 'rtl' : 'ltr'
}

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
        <a href="#" class="hover:text-ojen-gold transition">WHO WE ARE</a>
        <a href="#" class="hover:text-ojen-gold transition">WHAT WE DO</a>
        <a href="#" class="hover:text-ojen-gold transition">BLOG</a>
        <a href="#" class="hover:text-ojen-gold transition">LET'S CONNECT</a>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <button
          class="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-ojen-border text-xs font-semibold hover:border-ojen-gold"
          @click="toggleLang"
        >
          {{ isRtl ? 'EN' : 'AR' }}
        </button>

        <button
          class="flex items-center gap-2 rounded-full border border-ojen-border pl-1 pr-3 py-1 hover:border-ojen-gold transition"
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
              class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] leading-4 text-white text-center"
            >
              {{ pendingCount }}
            </span>
          </button>
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-72 rounded-lg border border-ojen-border bg-ojen-panel shadow-xl p-3 text-sm"
          >
            <p class="font-semibold mb-2">Notifications</p>
            <p v-if="pendingCount === 0" class="text-ojen-muted">No pending items.</p>
            <ul v-else class="space-y-2">
              <li
                v-for="inv in ql.invitations.filter((i) => i.status === 'pending')"
                :key="inv.id"
                class="text-ojen-muted"
              >
                Pulse survey pending from <span class="text-ojen-text">{{ inv.email }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="hidden md:flex flex-col items-start rounded-full border border-ojen-border px-3 py-1.5 text-xs">
          <span class="text-ojen-muted">Need help? Call us:</span>
          <span class="font-semibold">00971553033998</span>
        </div>
      </div>
    </div>
  </header>
</template>
