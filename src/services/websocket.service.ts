import { io, Socket } from 'socket.io-client';
import type { TickData, TradeExecuted, BalanceUpdate, SystemHealth } from '@/types/websocket.types';

class WebSocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private isConnected = false;
    private listeners: Map<string, Function[]> = new Map();

    constructor() {
        this.connect();
    }

    connect(): void {
        if (this.socket?.connected) return;

        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

        this.socket = io(`${wsUrl}/trading`, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log('WebSocket connected');
            this.emit('connection:established', { connected: true });
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            console.log('WebSocket disconnected');
            this.emit('connection:lost', { connected: false });
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                this.emit('connection:failed', { error: 'Max reconnection attempts reached' });
            }
        });

        // Trading events
        this.socket.on('tick:received', (data: TickData) => {
            this.emit('tick:received', data);
        });

        this.socket.on('trade:executed', (data: TradeExecuted) => {
            this.emit('trade:executed', data);
        });

        this.socket.on('balance:updated', (data: BalanceUpdate) => {
            this.emit('balance:updated', data);
        });

        this.socket.on('system:health', (data: SystemHealth) => {
            this.emit('system:health', data);
        });

        this.socket.on('notification', (data: any) => {
            this.emit('notification', data);
        });
    }

    // Subscribe to specific events
    subscribeToSymbol(symbol: string, accountId?: string): void {
        if (!this.socket) return;

        this.socket.emit('subscribe:symbol', { symbol, accountId });
    }

    unsubscribeFromSymbol(symbol: string): void {
        if (!this.socket) return;

        this.socket.emit('unsubscribe:symbol', { symbol });
    }

    subscribeToSession(sessionId: string): void {
        if (!this.socket) return;

        this.socket.emit('subscribe:session', { sessionId });
    }

    unsubscribeFromSession(sessionId: string): void {
        if (!this.socket) return;

        this.socket.emit('unsubscribe:session', { sessionId });
    }

    // Get system health
    getSystemHealth(): void {
        if (!this.socket) return;

        this.socket.emit('get:system:health');
    }

    // Event handling
    on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    off(event: string, callback?: Function): void {
        if (!callback) {
            this.listeners.delete(event);
            return;
        }

        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    private emit(event: string, data: any): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data));
        }
    }

    // Connection status
    getConnectionStatus(): boolean {
        return this.isConnected;
    }

    // Disconnect
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
}

export const websocketService = new WebSocketService();