import type { CurrencyRate } from '../types';

export const formatCurrency = (amount: number, currencyCode: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(amount);
};

export const formatRate = (rate: number): string => {
  if (rate >= 1) {
    return rate.toFixed(4);
  } else if (rate >= 0.01) {
    return rate.toFixed(6);
  } else {
    return rate.toFixed(8);
  }
};

export const filterCurrencies = (
  rates: Record<string, number> | null,
  searchQuery: string
): CurrencyRate[] => {
  if (!rates) return [];
  
  return Object.entries(rates)
    .map(([code, rate]) => ({ code, rate }))
    .filter(({ code }) => 
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.toUpperCase().includes(searchQuery.toUpperCase())
    )
    .sort((a, b) => a.code.localeCompare(b.code));
};

export const getCommonCurrencies = (): string[] => {
  return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'SGD', 'HKD', 'KRW'];
};