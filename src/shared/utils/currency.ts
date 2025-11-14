import { Currency } from '@/shared/types/common.types';

const currencySymbols: Record<Currency, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
};

export function formatCurrency(amount: number, currency?: Currency): string {
  // Fallback to TRY if currency is undefined or invalid
  const validCurrency: Currency =
    currency && currencySymbols[currency] ? currency : 'TRY';

  const symbol = currencySymbols[validCurrency];
  const formatted = amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formatted} ${symbol}`;
}

export function parseCurrencyInput(input: string): number {
  const cleaned = input.replace(/[^0-9.,]/g, '');
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
}
