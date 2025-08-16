import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { websocketService } from '@/services/websocket.service';
import type { 
  LiveTick, 
  TradeExecuted, 
  BalanceUpdate, 
  SystemHealth,
  WebSocketConnection
} from '@/types/websocket.types';
import { useTradingStore } from './trading.store';
import { useAccountsStore } from './accounts.store';
import { useNotificationsStore } from './notifications.store';

export const useWebSocketStore = defineStore('websocket', () => {
  // State
  const isConnected = ref(false);
  const reconnectAttempts = ref(0);
  const lastPingTime = ref<Date | null>(null);
  const systemHealth = ref<SystemHealth | null>(null);
  const subscribedSymbols = ref<Set<string>>(new Set());
  const subscribedSessions = ref<Set<string>>(new Set());
  const connectionError = ref<string | null>(null);

  // Getters
  const connectionStatus = computed((): WebSocketConnection => ({
    connected: isConnected.value,
    reconnectAttempts: reconnectAttempts.value,
    lastPing: lastPingTime.value ?? undefined
  }));

  const isHealthy = computed(() => 
    systemHealth.value?.status === 'healthy'
  );

  // Actions
  function initialize() {
    setupEventListeners();
    connect();
  }

  function connect() {
    try {
      websocketService.connect();
      connectionError.value = null;
    } catch (error: any) {
      connectionError.value = error.message;
    }
  }

  function disconnect() {
    websocketService.disconnect();
    isConnected.value = false;
    subscribedSymbols.value.clear();
    subscribedSessions.value.clear();
  }

  function subscribeToSymbol(symbol: string, accountId?: string) {
    websocketService.subscribeToSymbol(symbol, accountId);
    subscribedSymbols.value.add(symbol);
  }

  function unsubscribeFromSymbol(symbol: string) {
    websocketService.unsubscribeFromSymbol(symbol);
    subscribedSymbols.value.delete(symbol);
  }

  function subscribeToSession(sessionId: string) {
    websocketService.subscribeToSession(sessionId);
    subscribedSessions.value.add(sessionId);
  }

  function unsubscribeFromSession(sessionId: string) {
    websocketService.unsubscribeFromSession(sessionId);
    subscribedSessions.value.delete(sessionId);
  }

  function requestSystemHealth() {
    websocketService.getSystemHealth();
  }

  function setupEventListeners() {
    const tradingStore = useTradingStore();
    const accountsStore = useAccountsStore();
    const notificationsStore = useNotificationsStore();

    // Connection events
    websocketService.on('connection:established', () => {
      isConnected.value = true;
      reconnectAttempts.value = 0;
      lastPingTime.value = new Date();
      connectionError.value = null;
      
      notificationsStore.addNotification({
        type: 'success',
        title: 'Connected',
        message: 'Real-time connection established'
      });
    });

    websocketService.on('connection:lost', () => {
      isConnected.value = false;
      
      notificationsStore.addNotification({
        type: 'warning',
        title: 'Disconnected',
        message: 'Real-time connection lost'
      });
    });

    websocketService.on('connection:failed', (data: any) => {
      isConnected.value = false;
      connectionError.value = data.error || 'Connection failed';
      
      notificationsStore.addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: 'Failed to establish real-time connection'
      });
    });

    // Trading events
    websocketService.on('tick:received', (tick: LiveTick) => {
      tradingStore.updateLiveTick(tick);
    });

    websocketService.on('trade:executed', (trade: TradeExecuted) => {
      tradingStore.addTrade({
        id: trade.contractId,
        accountId: trade.accountId,
        symbol: trade.symbol,
        contractType: trade.contractType as any,
        amount: trade.amount,
        profit: trade.profit || 0,
        status: 'PENDING',
        openTime: trade.timestamp || new Date().toISOString(),
        contractId: trade.contractId,
        transactionId: trade.transactionId
      });

      notificationsStore.addNotification({
        type: 'info',
        title: 'Trade Executed',
        message: `${trade.symbol} ${trade.contractType} - $${trade.amount}`
      });
    });

    websocketService.on('balance:updated', (update: BalanceUpdate) => {
      const account = accountsStore.getAccount(update.accountId);
      if (account) {
        account.balance = update.balance;
        
        if (update.change !== 0) {
          notificationsStore.addNotification({
            type: update.change > 0 ? 'success' : 'error',
            title: 'Balance Update',
            message: `${update.change > 0 ? '+' : ''}$${update.change.toFixed(2)}`
          });
        }
      }
    });

    websocketService.on('system:health', (health: SystemHealth) => {
      systemHealth.value = health;
    });

    websocketService.on('notification', (notification: any) => {
      notificationsStore.addNotification(notification);
    });
  }

  return {
    // State
    isConnected,
    reconnectAttempts,
    lastPingTime,
    systemHealth,
    subscribedSymbols,
    subscribedSessions,
    connectionError,

    // Getters
    connectionStatus,
    isHealthy,

    // Actions
    initialize,
    connect,
    disconnect,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    subscribeToSession,
    unsubscribeFromSession,
    requestSystemHealth
  };
});