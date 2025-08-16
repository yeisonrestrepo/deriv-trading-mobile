export interface WebSocketMessage {
  event: string;
  data: any;
  timestamp: string;
}

export interface LiveTick {
  symbol: string;
  quote: number;
  epoch: number;
  lastDigit: number;
  timestamp: string;
}

export interface TickData {
  symbol: string;
  quote: number;
  epoch: number;
  lastDigit: number;
}

export interface TradeExecuted {
  accountId: string;
  symbol: string;
  contractType: string;
  amount: number;
  contractId: string;
  transactionId?: string;
  profit?: number;
  timestamp: string;
}

export interface BalanceUpdate {
  accountId: string;
  balance: number;
  currency: string;
  change: number;
  timestamp: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  connectedAccounts: number;
  activeSessions: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: string;
}

export interface WebSocketConnection {
  connected: boolean;
  reconnectAttempts: number;
  lastPing?: Date;
  connectionId?: string;
}

export interface WebSocketSubscription {
  id: string;
  type: 'symbol' | 'session' | 'account';
  target: string;
  active: boolean;
}

export interface WebSocketError {
  code: number;
  message: string;
  details?: any;
  timestamp: string;
}