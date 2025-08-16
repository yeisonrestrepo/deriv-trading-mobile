<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppNotifications />

    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <AppSidebar v-if="$route.name !== 'Login'" :is-open="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <AppHeader v-if="$route.name !== 'Login'" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppNotifications from '@/components/common/AppNotifications.vue'
import { useWebSocket } from '@/composables/useWebSocket'

const route = useRoute()
const sidebarOpen = ref(true)

// Initialize WebSocket connection
const { isConnected } = useWebSocket()

onMounted(() => {
  console.log('🚀 Deriv Trading Dashboard initialized')
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>