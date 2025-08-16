import { BalanceUpdate, LiveTick, SystemHealth, TradeExecuted } from './websocket.types';

// API Types
export type * from './api.types';

// Account Types
export type * from './account.types';

// Trading Types
export type * from './trading.types';

// WebSocket Types
export type * from './websocket.types';

// Common Types
export type * from './common.types';

// Event Types
export type * from './events.types';

// ===== CONSTANTES DE TIPOS =====
export const TRADING_SYMBOLS = [
  'R_10', 'R_25', 'R_50', 'R_75', 'R_100',
  '1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V'
] as const;

export type TradingSymbol = typeof TRADING_SYMBOLS[number];

export const CONTRACT_TYPES = {
  EVEN: 'EVEN',
  ODD: 'ODD',
  RISE: 'RISE',
  FALL: 'FALL'
} as const;

export type ContractType = typeof CONTRACT_TYPES[keyof typeof CONTRACT_TYPES];

export const TRADE_STATUS = {
  PENDING: 'PENDING',
  WON: 'WON',
  LOST: 'LOST'
} as const;

export type TradeStatus = typeof TRADE_STATUS[keyof typeof TRADE_STATUS];

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// ===== GUARDS DE TIPOS =====
export function isLiveTick(data: any): data is LiveTick {
  return (
    typeof data === 'object' &&
    typeof data.symbol === 'string' &&
    typeof data.quote === 'number' &&
    typeof data.epoch === 'number' &&
    typeof data.lastDigit === 'number' &&
    typeof data.timestamp === 'string'
  );
}

export function isTradeExecuted(data: any): data is TradeExecuted {
  return (
    typeof data === 'object' &&
    typeof data.accountId === 'string' &&
    typeof data.symbol === 'string' &&
    typeof data.contractType === 'string' &&
    typeof data.amount === 'number' &&
    typeof data.contractId === 'string'
  );
}

export function isBalanceUpdate(data: any): data is BalanceUpdate {
  return (
    typeof data === 'object' &&
    typeof data.accountId === 'string' &&
    typeof data.balance === 'number' &&
    typeof data.currency === 'string' &&
    typeof data.change === 'number'
  );
}

export function isSystemHealth(data: any): data is SystemHealth {
  return (
    typeof data === 'object' &&
    typeof data.status === 'string' &&
    typeof data.uptime === 'number' &&
    typeof data.connectedAccounts === 'number' &&
    typeof data.activeSessions === 'number'
  );
}

// ===== UTILIDADES DE TIPOS =====
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};