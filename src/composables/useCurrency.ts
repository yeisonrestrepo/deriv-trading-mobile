export function useCurrency() {
  function formatCurrency(
    amount: number,
    currency = 'USD',
    options: Intl.NumberFormatOptions = {}
  ): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }).format(amount);
  }

  function formatNumber(
    value: number,
    options: Intl.NumberFormatOptions = {}
  ): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }).format(value);
  }

  function formatPercentage(value: number, decimals = 2): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  }

  function formatCompactCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  }

  return {
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatCompactCurrency
  };
}