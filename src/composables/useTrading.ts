import { computed } from 'vue';
import { useTradingStore } from '@/stores/trading.store';
import { useAccountsStore } from '@/stores/accounts.store';

export function useTrading() {
  const tradingStore = useTradingStore();
  const accountsStore = useAccountsStore();

  const systemStats = computed(() => {
    const accounts = accountsStore.accounts;
    const activeSessions = tradingStore.activeSessions;

    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(acc => acc.isActive).length,
      totalBalance: accountsStore.totalBalance,
      activeSessions: activeSessions.length,
      totalProfit: tradingStore.totalProfit,
      totalTrades: tradingStore.totalActiveTrades
    };
  });

  async function toggleAccountTrading(accountId: string) {
    const account = accountsStore.getAccount(accountId);
    if (!account) return;

    const isTrading = tradingStore.isAccountTrading(accountId);

    if (isTrading) {
      await tradingStore.stopTrading(accountId);
    } else {
      await tradingStore.startTrading(accountId, account.symbols);
    }

    // Update account status
    account.isActive = !isTrading;
  }

  async function startAllAccounts() {
    await tradingStore.startAllAccounts();
    
    // Update all account statuses
    accountsStore.accounts.forEach(account => {
      account.isActive = true;
    });
  }

  async function stopAllAccounts() {
    await tradingStore.stopAllAccounts();
    
    // Update all account statuses
    accountsStore.accounts.forEach(account => {
      account.isActive = false;
    });
  }

  return {
    // Computed
    systemStats,
    
    // Trading state
    activeSessions: tradingStore.activeSessions,
    recentTrades: tradingStore.recentTrades,
    liveTicks: tradingStore.liveTicks,
    loading: tradingStore.loading,
    error: tradingStore.error,
    
    // Actions
    toggleAccountTrading,
    startAllAccounts,
    stopAllAccounts,
    loadActiveSessions: tradingStore.loadActiveSessions,
    loadRecentTrades: tradingStore.loadRecentTrades
  };
}