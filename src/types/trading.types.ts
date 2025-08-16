export interface TradingSession {
  id: string;
  accountId: string;
  symbol: string;
  isActive: boolean;
  startTime: string;
  endTime?: string;
  totalTrades: number;
  totalProfit: number;
  currentStreak: number;
  maxStreak: number;
  stopLossTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  contractType: 'EVEN' | 'ODD' | 'RISE' | 'FALL';
  amount: number;
  profit: number;
  status: 'PENDING' | 'WON' | 'LOST';
  openTime: string;
  closeTime?: string;
  contractId?: string;
  transactionId?: string;
  entrySpot?: number;
  exitSpot?: number;
  lastDigit?: number;
}

export interface TradingConfig {
  symbol: string;
  maxTicks: number;
  initialStake: number;
  martingaleMultiplier: number;
  maxMartingaleStep: number;
  stopLossAmount: number;
  takeProfitAmount: number;
  strategy: 'EVEN_ODD' | 'RISE_FALL';
  enabled: boolean;
}

export interface TradingStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  maxDrawdown: number;
  profitFactor: number;
  sharpeRatio?: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  averageWinAmount: number;
  averageLossAmount: number;
}

export interface TradingSignal {
  symbol: string;
  type: 'EVEN' | 'ODD';
  confidence: number;
  timestamp: string;
  reason: string;
}

export interface MartingaleStep {
  step: number;
  amount: number;
  totalInvested: number;
  potentialReturn: number;
}