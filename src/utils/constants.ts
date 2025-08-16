export const API_ENDPOINTS = {
  ACCOUNTS: '/accounts',
  TRADING: '/trading',
  ANALYTICS: '/analytics',
  HEALTH: '/health'
} as const;

export const WEBSOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION_ESTABLISHED: 'connection:established',
  CONNECTION_LOST: 'connection:lost',
  
  // Trading
  TICK_RECEIVED: 'tick:received',
  TRADE_EXECUTED: 'trade:executed',
  BALANCE_UPDATED: 'balance:updated',
  
  // Subscriptions
  SUBSCRIBE_SYMBOL: 'subscribe:symbol',
  UNSUBSCRIBE_SYMBOL: 'unsubscribe:symbol',
  SUBSCRIBE_SESSION: 'subscribe:session',
  UNSUBSCRIBE_SESSION: 'unsubscribe:session',
  
  // System
  SYSTEM_HEALTH: 'system:health',
  NOTIFICATION: 'notification'
} as const;

export const TRADING_SYMBOLS = [
  'R_10', 'R_25', 'R_50', 'R_75', 'R_100',
  '1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V'
] as const;

export const CONTRACT_TYPES = {
  EVEN: 'EVEN',
  ODD: 'ODD',
  RISE: 'RISE',
  FALL: 'FALL'
} as const;

export const TRADE_STATUS = {
  PENDING: 'PENDING',
  WON: 'WON',
  LOST: 'LOST'
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;