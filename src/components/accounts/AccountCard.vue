<template>
  <div
    :class="[
      'bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md',
      account.isActive ? 'border-green-300 bg-green-50' : 'border-gray-200'
    ]"
  >
    <!-- Card Header -->
    <div class="p-6 pb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
              account.isActive ? 'bg-green-500' : 'bg-gray-400'
            ]"
          >
            {{ account.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ account.name }}</h3>
            <p class="text-sm text-gray-500">{{ account.currency }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <!-- Status Indicator -->
          <div
            :class="[
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
              account.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            ]"
          >
            <div
              :class="[
                'w-2 h-2 rounded-full',
                account.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              ]"
            ></div>
            <span>{{ account.isActive ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="px-6 pb-4">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-gray-900">
            {{ formatCurrency(account.balance) }}
          </div>
          <div class="text-xs text-gray-500 mt-1">Balance</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div
            :class="[
              'text-2xl font-bold',
              (stats?.todayPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ (stats?.todayPnL || 0) >= 0 ? '+' : '' }}{{ formatCurrency(stats?.todayPnL || 0) }}
          </div>
          <div class="text-xs text-gray-500 mt-1">Today P&L</div>
        </div>
      </div>

      <!-- Trading Symbols -->
      <div class="mb-4">
        <div class="text-sm font-medium text-gray-700 mb-2">Trading Symbols:</div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="symbol in account.symbols"
            :key="symbol"
            class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
          >
            {{ symbol }}
          </span>
        </div>
      </div>

      <!-- Trading Stats -->
      <div v-if="stats" class="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 mb-4">
        <div>
          <div class="font-medium text-gray-900">{{ stats.totalTrades }}</div>
          <div>Total Trades</div>
        </div>
        <div>
          <div class="font-medium text-green-600">{{ stats.winRate.toFixed(1) }}%</div>
          <div>Win Rate</div>
        </div>
        <div>
          <div class="font-medium text-blue-600">{{ stats.activeTrades }}</div>
          <div>Active</div>
        </div>
      </div>
    </div>

    <!-- Card Actions -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div class="flex justify-between items-center">
        <div class="flex space-x-2">
          <button
            @click="toggleTrading"
            :disabled="loading"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50',
              account.isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            ]"
          >
            <i :class="account.isActive ? 'fas fa-stop' : 'fas fa-play'" class="mr-1"></i>
            {{ account.isActive ? 'Stop' : 'Start' }}
          </button>
          
          <button
            @click="$emit('edit', account)"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <i class="fas fa-edit mr-1"></i>
            Edit
          </button>
        </div>
        
        <div class="flex space-x-1">
          <button
            @click="testConnection"
            :disabled="connectionTesting"
            class="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            title="Test Connection"
          >
            <i :class="connectionTesting ? 'fas fa-spinner animate-spin' : 'fas fa-plug'" class="text-sm"></i>
          </button>
          
          <button
            @click="$emit('delete', account)"
            class="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Account"
          >
            <i class="fas fa-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Account, AccountStats } from '@/types/account.types'
import { useTrading } from '@/composables/useTrading'
import { useCurrency } from '@/composables/useCurrency'
import { useAccountsStore } from '@/stores/accounts.store'
import { accountsService } from '@/services/accounts.service'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps<{
  account: Account
}>()

defineEmits<{
  edit: [account: Account]
  delete: [account: Account]
}>()

const { toggleAccountTrading } = useTrading()
const { formatCurrency } = useCurrency()
const accountsStore = useAccountsStore()
const { showSuccess, showError } = useNotifications()

const loading = ref(false)
const connectionTesting = ref(false)

const stats = computed(() => accountsStore.getAccountStats(props.account.id))

async function toggleTrading() {
  try {
    loading.value = true
    await toggleAccountTrading(props.account.id)
  } catch (error: any) {
    showError('Trading Error', error.message || 'Failed to toggle trading')
  } finally {
    loading.value = false
  }
}

async function testConnection() {
  try {
    connectionTesting.value = true
    const result = await accountsService.testConnection(props.account.id)
    
    if (result.connected) {
      showSuccess('Connection Test', 'Connection successful')
    } else {
      showError('Connection Test', result.message)
    }
  } catch (error: any) {
    showError('Connection Test', 'Failed to test connection')
  } finally {
    connectionTesting.value = false
  }
}

onMounted(() => {
  // Load stats for this account
  accountsStore.loadAccountStats(props.account.id)
})
</script>