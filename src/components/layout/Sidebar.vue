<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { useAuthStore } from '@/stores/auth'
import { useQlStore } from '@/stores/ql'
import { useLocaleStore } from '@/stores/locale'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const ql = useQlStore()
const locale = useLocaleStore()
const router = useRouter()

const links = [
  { to: '/en/profile', labelKey: 'sidebar.corporateProfile', icon: 'user' },
  { to: '/en/employees', labelKey: 'sidebar.employees', icon: 'lock' },
  { to: '/en/profile/ql-overview', labelKey: 'sidebar.qlDashboard', icon: 'briefcase' },
  { to: '/en/journeys', labelKey: 'sidebar.journeys', icon: 'rocket' },
  { to: '/en/subscriptions', labelKey: 'sidebar.subscriptions', icon: 'credit-card' },
  { to: '/en/bookings', labelKey: 'sidebar.bookings', icon: 'briefcase' },
  { to: '/en/payments', labelKey: 'sidebar.payments', icon: 'credit-card' },
]

function logout() {
  auth.logout()
  emit('close')
  router.push('/login')
}
</script>

<template>
  <div>
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-30 bg-black/50" @click="emit('close')" />
    </Transition>
    <Transition :name="locale.dir === 'rtl' ? 'slide-rtl' : 'slide-ltr'">
      <aside
        v-if="open"
        class="fixed inset-y-0 start-0 z-40 w-[280px] bg-ojen-panel border-e border-ojen-border flex flex-col"
      >
        <div class="flex items-center justify-between px-5 py-5 border-b border-ojen-border">
          <span class="font-semibold">{{ ql.companyName }}</span>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full border border-ojen-border hover:border-ojen-gold"
            @click="emit('close')"
          >
            <Icon name="x" class="w-4 h-4" />
          </button>
        </div>

        <nav class="flex-1 px-4 py-4 space-y-1.5">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition"
            :class="
              $route.path === link.to
                ? 'bg-ojen-gold text-ojen-ink'
                : 'text-ojen-text hover:bg-ojen-panel-light'
            "
            @click="emit('close')"
          >
            <Icon :name="link.icon" class="w-4 h-4" />
            {{ locale.t(link.labelKey) }}
          </RouterLink>
        </nav>

        <div class="px-4 pb-6">
          <button
            class="w-full flex items-center justify-center gap-2 rounded-lg border border-ojen-border px-4 py-3 text-sm font-medium hover:border-ojen-gold hover:text-ojen-gold transition"
            @click="logout"
          >
            <Icon name="log-out" class="w-4 h-4" />
            {{ locale.t('sidebar.logout') }}
          </button>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.slide-ltr-enter-active,
.slide-ltr-leave-active,
.slide-rtl-enter-active,
.slide-rtl-leave-active {
  transition: transform 0.2s ease;
}
.slide-ltr-enter-from,
.slide-ltr-leave-to {
  transform: translateX(-100%);
}
.slide-rtl-enter-from,
.slide-rtl-leave-to {
  transform: translateX(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
