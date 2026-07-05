<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/layout/TopNav.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ChatWidget from '@/components/layout/ChatWidget.vue'

const route = useRoute()
const sidebarOpen = ref(false)
</script>

<template>
  <template v-if="route.meta.standalone">
    <RouterView />
  </template>
  <template v-else>
    <div class="min-h-screen flex flex-col bg-ojen-bg">
      <TopNav @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="flex-1">
        <RouterView />
      </main>
      <SiteFooter />
      <ChatWidget />
    </div>
  </template>
</template>
