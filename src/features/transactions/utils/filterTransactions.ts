import { Transaction } from '../types/transaction.types';
import { FilterOptions } from '../components/TransactionFilters';

export const filterTransactions = (
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] => {
  let filtered = [...transactions];

  // Search filter
  if (filters.searchTerm.trim() !== '') {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description?.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
    );
  }

  // Type filter
  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  // Category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  // Date range filter
  if (filters.dateRange !== 'all') {
    const now = new Date();
    const ranges: Record<string, number> = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365,
    };

    if (filters.dateRange === 'custom') {
      if (filters.startDate || filters.endDate) {
        const start = filters.startDate
          ? new Date(filters.startDate)
          : new Date(0);
        const end = filters.endDate ? new Date(filters.endDate) : now;

        filtered = filtered.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= start && transactionDate <= end;
        });
      }
    } else if (ranges[filters.dateRange]) {
      const daysAgo = ranges[filters.dateRange];
      const cutoffDate = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000
      );

      filtered = filtered.filter((t) => new Date(t.date) >= cutoffDate);
    }
  }

  // Amount range filter
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter((t) => t.amount >= filters.minAmount!);
  }

  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter((t) => t.amount <= filters.maxAmount!);
  }

  // Sort by date (newest first)
  filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return filtered;
};
