<template>
    <aside :class="[
        'bg-gray-900 text-white transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
    ]" class="flex flex-col">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 bg-gray-800">
            <div v-if="isOpen" class="flex items-center space-x-2">
                <i class="fas fa-robot text-blue-400 text-xl"></i>
                <span class="font-bold text-lg">Deriv Bot</span>
            </div>
            <i v-else class="fas fa-robot text-blue-400 text-xl"></i>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-2 py-4 space-y-1">
            <router-link v-for="item in navigationItems" :key="item.name" :to="item.path" :class="[
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                $route.name === item.name
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]">
                <i :class="item.icon" class="mr-3 text-lg w-6"></i>
                <span v-if="isOpen">{{ item.label }}</span>

                <!-- Badge for notifications -->
                <span v-if="item.badge && isOpen"
                    class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {{ item.badge }}
                </span>
            </router-link>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-700">
            <div v-if="isOpen" class="text-xs text-gray-400">
                <div>Version 3.0.0</div>
                <div>{{ new Date().getFullYear() }} Deriv Bot</div>
            </div>
            <div v-else class="text-center">
                <i class="fas fa-info-circle text-gray-400"></i>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts.store'
import { useTradingStore } from '@/stores/trading.store'

defineProps<{
    isOpen: boolean
}>()

const accountsStore = useAccountsStore()
const tradingStore = useTradingStore()

const navigationItems = computed(() => [
    {
        name: 'Dashboard',
        label: 'Dashboard',
        path: '/',
        icon: 'fas fa-tachometer-alt'
    },
    {
        name: 'Accounts',
        label: 'Accounts',
        path: '/accounts',
        icon: 'fas fa-users',
        badge: accountsStore.accountsCount
    },
    {
        name: 'Trading',
        label: 'Live Trading',
        path: '/trading',
        icon: 'fas fa-chart-line',
        badge: tradingStore.activeSessionsCount || undefined
    },
    {
        name: 'Analytics',
        label: 'Analytics',
        path: '/analytics',
        icon: 'fas fa-chart-bar'
    },
    {
        name: 'Settings',
        label: 'Settings',
        path: '/settings',
        icon: 'fas fa-cog'
    }
])
</script>