import { apiService } from './api.service';
import type { TradingSession, Trade, TradingConfig, TradingStats } from '@/types/trading.types';

class TradingService {
  private readonly basePath = '/trading';

  // Trading control
  async startTrading(accountId: string, symbols: string[]): Promise<{ success: boolean; message: string }> {
    return apiService.post(`${this.basePath}/start`, { accountId, symbols });
  }

  async stopTrading(accountId: string): Promise<{ success: boolean; message: string }> {
    return apiService.post(`${this.basePath}/stop`, { accountId });
  }

  async startAllAccounts(): Promise<{ success: boolean; message: string }> {
    return apiService.post(`${this.basePath}/start-all`);
  }

  async stopAllAccounts(): Promise<{ success: boolean; message: string }> {
    return apiService.post(`${this.basePath}/stop-all`);
  }

  // Sessions
  async getActiveSessions(): Promise<TradingSession[]> {
    return apiService.get<TradingSession[]>(`${this.basePath}/sessions/active`);
  }

  async getSessionHistory(accountId?: string): Promise<TradingSession[]> {
    const params = accountId ? { accountId } : undefined;
    return apiService.get<TradingSession[]>(`${this.basePath}/sessions/history`, params);
  }

  // Trades
  async getTrades(accountId?: string, limit = 50): Promise<Trade[]> {
    const params = { accountId, limit };
    return apiService.get<Trade[]>(`${this.basePath}/trades`, params);
  }

  async getTradeHistory(accountId: string, startDate?: string, endDate?: string): Promise<Trade[]> {
    const params = { startDate, endDate };
    return apiService.get<Trade[]>(`${this.basePath}/accounts/${accountId}/trades`, params);
  }

  // Configuration
  async getTradingConfig(accountId: string, symbol: string): Promise<TradingConfig> {
    return apiService.get<TradingConfig>(`${this.basePath}/config/${accountId}/${symbol}`);
  }

  async updateTradingConfig(accountId: string, symbol: string, config: Partial<TradingConfig>): Promise<TradingConfig> {
    return apiService.patch<TradingConfig>(`${this.basePath}/config/${accountId}/${symbol}`, config);
  }

  // Statistics
  async getTradingStats(accountId: string, period = '7d'): Promise<TradingStats> {
    return apiService.get<TradingStats>(`${this.basePath}/stats/${accountId}`, { period });
  }

  async getSystemStats(): Promise<any> {
    return apiService.get(`${this.basePath}/stats/system`);
  }
}

export const tradingService = new TradingService();