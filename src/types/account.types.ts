export interface Account {
  id: string;
  name: string;
  apiToken: string;
  currency: string;
  balance: number;
  isActive: boolean;
  symbols: string[];
  maxLoss?: number;
  maxTrades?: number;
  stopLossPercentage?: number;
  createdAt: string;
  updatedAt: string;
  
  // Campos calculados
  todayPnL?: number;
  totalPnL?: number;
  activeTrades?: number;
  lastTradeTime?: string;
}

export interface CreateAccountDto {
  name: string;
  apiToken: string;
  symbols?: string[];
  maxLoss?: number;
  maxTrades?: number;
  stopLossPercentage?: number;
}

export interface UpdateAccountDto {
  name?: string;
  symbols?: string[];
  maxLoss?: number;
  maxTrades?: number;
  stopLossPercentage?: number;
  isActive?: boolean;
}

export interface AccountStats {
  totalBalance: number;
  todayPnL: number;
  totalTrades: number;
  winRate: number;
  activeTrades: number;
  lastTradeTime?: string;
  profitToday: number;
  lossToday: number;
  tradesWon: number;
  tradesLost: number;
  averageTradeAmount: number;
  maxDrawdown: number;
}

export interface AccountBalance {
  accountId: string;
  balance: number;
  currency: string;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  timestamp: string;
}