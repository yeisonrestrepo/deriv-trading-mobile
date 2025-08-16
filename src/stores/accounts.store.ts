import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { accountsService } from '@/services/accounts.service';
import type { Account, CreateAccountDto, UpdateAccountDto, AccountStats } from '@/types/account.types';
import { useNotificationsStore } from './notifications.store';

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const accounts = ref<Account[]>([]);
  const currentAccount = ref<Account | null>(null);
  const accountStats = ref<Map<string, AccountStats>>(new Map());
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeAccounts = computed(() => 
    accounts.value.filter(account => account.isActive)
  );

  const inactiveAccounts = computed(() => 
    accounts.value.filter(account => !account.isActive)
  );

  const totalBalance = computed(() => 
    accounts.value.reduce((total, account) => total + account.balance, 0)
  );

  const accountsCount = computed(() => accounts.value.length);

  // Actions
  async function loadAccounts() {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await accountsService.getAllAccounts();
      accounts.value = data;
      
      // Load stats for each account
      await Promise.all(
        data.map(account => loadAccountStats(account.id))
      );
      
    } catch (err: any) {
      error.value = err.message || 'Error loading accounts';
      const notifications = useNotificationsStore();
      notifications.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load accounts'
      });
    } finally {
      loading.value = false;
    }
  }

  async function loadAccountStats(accountId: string) {
    try {
      const stats = await accountsService.getAccountStats(accountId);
      accountStats.value.set(accountId, stats);
    } catch (err: any) {
      console.error(`Error loading stats for account ${accountId}:`, err);
    }
  }

  async function createAccount(data: CreateAccountDto) {
    try {
      loading.value = true;
      
      const newAccount = await accountsService.createAccount(data);
      accounts.value.push(newAccount);
      
      const notifications = useNotificationsStore();
      notifications.addNotification({
        type: 'success',
        title: 'Success',
        message: `Account "${newAccount.name}" created successfully`
      });
      
      return newAccount;
    } catch (err: any) {
      error.value = err.message || 'Error creating account';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateAccount(id: string, data: UpdateAccountDto) {
    try {
      loading.value = true;
      
      const updatedAccount = await accountsService.updateAccount(id, data);
      const index = accounts.value.findIndex(acc => acc.id === id);
      
      if (index > -1) {
        accounts.value[index] = updatedAccount;
      }
      
      const notifications = useNotificationsStore();
      notifications.addNotification({
        type: 'success',
        title: 'Success',
        message: `Account "${updatedAccount.name}" updated successfully`
      });
      
      return updatedAccount;
    } catch (err: any) {
      error.value = err.message || 'Error updating account';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteAccount(id: string) {
    try {
      await accountsService.deleteAccount(id);
      accounts.value = accounts.value.filter(acc => acc.id !== id);
      accountStats.value.delete(id);
      
      const notifications = useNotificationsStore();
      notifications.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Account deleted successfully'
      });
    } catch (err: any) {
      error.value = err.message || 'Error deleting account';
      throw err;
    }
  }

  function getAccount(id: string): Account | undefined {
    return accounts.value.find(account => account.id === id);
  }

  function getAccountStats(id: string): AccountStats | undefined {
    return accountStats.value.get(id);
  }

  return {
    // State
    accounts,
    currentAccount,
    accountStats,
    loading,
    error,
    
    // Getters
    activeAccounts,
    inactiveAccounts,
    totalBalance,
    accountsCount,
    
    // Actions
    loadAccounts,
    loadAccountStats,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    getAccountStats
  };
});