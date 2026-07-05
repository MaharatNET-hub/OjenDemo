<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { useAuthStore } from '@/stores/auth'
import { useQlStore } from '@/stores/ql'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const ql = useQlStore()
const router = useRouter()

const links = [
  { to: '/en/profile', label: 'Corporate Profile', icon: 'user' },
  { to: '/en/employees', label: 'Employees', icon: 'lock' },
  { to: '/en/profile/ql-overview', label: 'QL Dashboard', icon: 'briefcase' },
  { to: '/en/subscriptions', label: 'Subscriptions', icon: 'credit-card' },
  { to: '/en/bookings', label: 'Bookings', icon: 'briefcase' },
  { to: '/en/payments', label: 'Payments', icon: 'credit-card' },
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
    <Transition name="slide">
      <aside
        v-if="open"
        class="fixed inset-y-0 left-0 z-40 w-[280px] bg-[#0d1526] border-r border-ojen-border flex flex-col"
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
                ? 'bg-ojen-gold text-ojen-bg'
                : 'text-ojen-text hover:bg-ojen-panel-light'
            "
            @click="emit('close')"
          >
            <Icon :name="link.icon" class="w-4 h-4" />
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="px-4 pb-6">
          <button
            class="w-full flex items-center justify-center gap-2 rounded-lg border border-ojen-border px-4 py-3 text-sm font-medium hover:border-ojen-gold hover:text-ojen-gold transition"
            @click="logout"
          >
            <Icon name="log-out" class="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
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
