export interface TradingEvent {
  id: string;
  type: 'trade_opened' | 'trade_closed' | 'balance_updated' | 'session_started' | 'session_ended';
  accountId: string;
  data: any;
  timestamp: string;
}

export interface EventHandler<T = any> {
  (event: T): void | Promise<void>;
}

export interface EventSubscription {
  id: string;
  event: string;
  handler: EventHandler;
  once?: boolean;
}