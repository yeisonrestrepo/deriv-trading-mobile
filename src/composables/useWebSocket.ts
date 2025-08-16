import { onMounted, onUnmounted, ref } from 'vue';
import { useWebSocketStore } from '@/stores/websocket.store';

export function useWebSocket() {
  const webSocketStore = useWebSocketStore();
  const isInitialized = ref(false);

  onMounted(() => {
    if (!isInitialized.value) {
      webSocketStore.initialize();
      isInitialized.value = true;
    }
  });

  onUnmounted(() => {
    // Don't disconnect here as other components might be using it
    // The store handles the lifecycle
  });

  return {
    isConnected: webSocketStore.isConnected,
    connectionStatus: webSocketStore.connectionStatus,
    systemHealth: webSocketStore.systemHealth,
    subscribeToSymbol: webSocketStore.subscribeToSymbol,
    unsubscribeFromSymbol: webSocketStore.unsubscribeFromSymbol,
    subscribeToSession: webSocketStore.subscribeToSession,
    unsubscribeFromSession: webSocketStore.unsubscribeFromSession,
    requestSystemHealth: webSocketStore.requestSystemHealth
  };
}