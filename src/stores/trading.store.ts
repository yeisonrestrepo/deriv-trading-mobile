import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { tradingService } from '@/services/trading.service';
import type { TradingSession, Trade, TradingConfig, TradingStats, LiveTick } from '@/types/trading.types';
import { useNotificationsStore } from './notifications.store';

export const useTradingStore = defineStore('trading', () => {
  // State
  const activeSessions = ref<TradingSession[]>([]);
  const recentTrades = ref<Trade[]>([]);
  const liveTicks = ref<Map<string, LiveTick>>(new Map());
  const tradingConfigs = ref<Map<string, TradingConfig>>(new Map());
  const tradingStats = ref<Map<string, TradingStats>>(new Map());
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeSessionsCount = computed(() => activeSessions.value.length);
  
  const totalActiveTrades = computed(() => 
    activeSessions.value.reduce((total, session) => total + session.totalTrades, 0)
  );

  const totalProfit = computed(() => 
    activeSessions.value.reduce((total, session) => total + session.totalProfit, 0)
  );

  const isAccountTrading = computed(() => (accountId: string) => 
    activeSessions.value.some(session => session.accountId === accountId && session.isActive)
  );

  const getSessionsByAccount = computed(() => (accountId: string) => 
    activeSessions.value.filter(session => session.accountId === accountId)
  );

  // Actions
  async function startTrading(accountId: string, symbols: string[]) {
    try {
      loading.value = true;
      error.value = null;

      const result = await tradingService.startTrading(accountId, symbols);
      
      if (result.success) {
        await loadActiveSessions();
        
        const notifications = useNotificationsStore();
        notifications.addNotification({
          type: 'success',
          title: 'Trading Started',
          message: result.message
        });
      }

      return result;
    } catch (err: any) {
      error.value = err.message || 'Error starting trading';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function stopTrading(accountId: string) {
    try {
      loading.value = true;
      error.value = null;

      const result = await tradingService.stopTrading(accountId);
      
      if (result.success) {
        // Remove sessions for this account
        activeSessions.value = activeSessions.value.filter(
          session => session.accountId !== accountId
        );
        
        const notifications = useNotificationsStore();
        notifications.addNotification({
          type: 'warning',
          title: 'Trading Stopped',
          message: result.message
        });
      }

      return result;
    } catch (err: any) {
      error.value = err.message || 'Error stopping trading';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startAllAccounts() {
    try {
      loading.value = true;
      const result = await tradingService.startAllAccounts();
      
      if (result.success) {
        await loadActiveSessions();
      }

      return result;
    } catch (err: any) {
      error.value = err.message || 'Error starting all accounts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function stopAllAccounts() {
    try {
      loading.value = true;
      const result = await tradingService.stopAllAccounts();
      
      if (result.success) {
        activeSessions.value = [];
      }

      return result;
    } catch (err: any) {
      error.value = err.message || 'Error stopping all accounts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadActiveSessions() {
    try {
      const sessions = await tradingService.getActiveSessions();
      activeSessions.value = sessions;
    } catch (err: any) {
      console.error('Error loading active sessions:', err);
    }
  }

  async function loadRecentTrades(accountId?: string, limit = 50) {
    try {
      const trades = await tradingService.getTrades(accountId, limit);
      recentTrades.value = trades;
    } catch (err: any) {
      console.error('Error loading recent trades:', err);
    }
  }

  async function loadTradingStats(accountId: string, period = '7d') {
    try {
      const stats = await tradingService.getTradingStats(accountId, period);
      tradingStats.value.set(accountId, stats);
    } catch (err: any) {
      console.error(`Error loading trading stats for ${accountId}:`, err);
    }
  }

  function updateLiveTick(tick: LiveTick) {
    liveTicks.value.set(tick.symbol, tick);
  }

  function addTrade(trade: Trade) {
    recentTrades.value.unshift(trade);
    
    // Keep only last 100 trades
    if (recentTrades.value.length > 100) {
      recentTrades.value = recentTrades.value.slice(0, 100);
    }
  }

  function updateSessionProfit(sessionId: string, profit: number) {
    const session = activeSessions.value.find(s => s.id === sessionId);
    if (session) {
      session.totalProfit += profit;
      session.totalTrades += 1;
    }
  }

  return {
    // State
    activeSessions,
    recentTrades,
    liveTicks,
    tradingConfigs,
    tradingStats,
    loading,
    error,

    // Getters
    activeSessionsCount,
    totalActiveTrades,
    totalProfit,
    isAccountTrading,
    getSessionsByAccount,

    // Actions
    startTrading,
    stopTrading,
    startAllAccounts,
    stopAllAccounts,
    loadActiveSessions,
    loadRecentTrades,
    loadTradingStats,
    updateLiveTick,
    addTrade,
    updateSessionProfit
  };
});