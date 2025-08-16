import { apiService } from './api.service';
import type { Account, CreateAccountDto, UpdateAccountDto, AccountStats } from '@/types/account.types';

class AccountsService {
  private readonly basePath = '/accounts';

  async getAllAccounts(): Promise<Account[]> {
    return apiService.get<Account[]>(this.basePath);
  }

  async getAccount(id: string): Promise<Account> {
    return apiService.get<Account>(`${this.basePath}/${id}`);
  }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    return apiService.post<Account>(this.basePath, data);
  }

  async updateAccount(id: string, data: UpdateAccountDto): Promise<Account> {
    return apiService.patch<Account>(`${this.basePath}/${id}`, data);
  }

  async deleteAccount(id: string): Promise<void> {
    return apiService.delete(`${this.basePath}/${id}`);
  }

  async getAccountStats(id: string): Promise<AccountStats> {
    return apiService.get<AccountStats>(`${this.basePath}/${id}/stats`);
  }

  async testConnection(id: string): Promise<{ connected: boolean; message: string }> {
    return apiService.post(`${this.basePath}/${id}/test-connection`);
  }
}

export const accountsService = new AccountsService();