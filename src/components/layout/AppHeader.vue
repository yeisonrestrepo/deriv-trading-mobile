<template>
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
            <!-- Left Section -->
            <div class="flex items-center space-x-4">
                <button @click="$emit('toggle-sidebar')"
                    class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <i class="fas fa-bars text-lg"></i>
                </button>

                <div class="flex items-center space-x-2">
                    <h1 class="text-xl font-semibold text-gray-900">
                        {{ $route.meta.title }}
                    </h1>
                    <div v-if="isConnected"
                        class="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live</span>
                    </div>
                </div>
            </div>

            <!-- Right Section -->
            <div class="flex items-center space-x-4">
                <!-- System Stats -->
                <div class="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                    <div class="flex items-center space-x-1">
                        <i class="fas fa-wallet text-green-500"></i>
                        <span>{{ formatCurrency(systemStats.totalBalance) }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <i class="fas fa-chart-line"
                            :class="systemStats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'"></i>
                        <span :class="systemStats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ systemStats.totalProfit >= 0 ? '+' : '' }}{{ formatCurrency(systemStats.totalProfit) }}
                        </span>
                    </div>
                    <div class="flex items-center space-x-1">
                        <i class="fas fa-users text-blue-500"></i>
                        <span>{{ systemStats.activeAccounts }}/{{ systemStats.totalAccounts }}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2">
                    <button @click="refreshData" :disabled="loading"
                        class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50">
                        <i class="fas fa-sync-alt text-sm" :class="{ 'animate-spin': loading }"></i>
                    </button>

                    <button @click="toggleSystemTrading"
                        :class="hasActiveAccounts ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
                        class="px-3 py-2 text-white rounded-md text-sm font-medium transition-colors">
                        <i :class="hasActiveAccounts ? 'fas fa-stop' : 'fas fa-play'" class="mr-1"></i>
                        {{ hasActiveAccounts ? 'Stop All' : 'Start All' }}
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { useTrading } from '@/composables/useTrading'
import { useCurrency } from '@/composables/useCurrency'
import { useAccountsStore } from '@/stores/accounts.store'

defineEmits<{
    'toggle-sidebar': []
}>()

const { isConnected } = useWebSocket()
const { systemStats, startAllAccounts, stopAllAccounts, loading } = useTrading()
const { formatCurrency } = useCurrency()
const accountsStore = useAccountsStore()

const hasActiveAccounts = computed(() =>
    accountsStore.activeAccounts.length > 0
)

async function toggleSystemTrading() {
    if (hasActiveAccounts.value) {
        await stopAllAccounts()
    } else {
        await startAllAccounts()
    }
}

async function refreshData() {
    await accountsStore.loadAccounts()
}
</script>