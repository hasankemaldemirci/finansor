import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Transaction,
  CreateTransactionDto,
  TransactionStats,
} from '../types/transaction.types';
import { TransactionType } from '@/shared/types/common.types';
import { generateId } from '@/shared/lib/utils';
import { secureStorageAdapter } from '@/shared/utils/secureStorageAdapter';
import { InputSanitizer } from '@/shared/utils/sanitizer';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (dto: CreateTransactionDto) => Transaction;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, dto: CreateTransactionDto) => Transaction;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByDateRange: (start: Date, end: Date) => Transaction[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getSavings: () => number;
  getMonthlySavings: () => number;
  getStats: () => TransactionStats;
  clearAllTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (dto) => {
        // Input sanitization
        const sanitized = InputSanitizer.sanitizeTransactionData(dto);
        if (!sanitized) {
          throw new Error('Invalid transaction data');
        }

        const transaction: Transaction = {
          id: generateId(),
          ...sanitized,
          createdAt: new Date(),
        };

        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));

        return transaction;
      },

      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      updateTransaction: (id, dto) => {
        const existingTransaction = get().transactions.find((t) => t.id === id);
        if (!existingTransaction) {
          throw new Error('Transaction not found');
        }

        // Input sanitization
        const sanitized = InputSanitizer.sanitizeTransactionData({
          ...dto,
          date: dto.date || existingTransaction.date,
        });
        if (!sanitized) {
          throw new Error('Invalid transaction data');
        }

        const updatedTransaction: Transaction = {
          ...existingTransaction,
          ...sanitized,
          id, // Keep the same ID
          createdAt: existingTransaction.createdAt, // Keep original creation date
        };

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? updatedTransaction : t
          ),
        }));

        return updatedTransaction;
      },

      getTransactionById: (id) => {
        return get().transactions.find((t) => t.id === id);
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter((t) => t.type === type);
      },

      getTransactionsByDateRange: (start, end) => {
        return get().transactions.filter(
          (t) => new Date(t.date) >= start && new Date(t.date) <= end
        );
      },

      getTotalIncome: () => {
        return get()
          .transactions.filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpenses: () => {
        return get()
          .transactions.filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getSavings: () => {
        return get().getTotalIncome() - get().getTotalExpenses();
      },

      getMonthlySavings: () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        const monthlyTransactions = get().getTransactionsByDateRange(startOfMonth, endOfMonth);
        const monthlyIncome = monthlyTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = monthlyTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        return monthlyIncome - monthlyExpenses;
      },

      getStats: () => {
        const totalIncome = get().getTotalIncome();
        const totalExpenses = get().getTotalExpenses();
        const savings = totalIncome - totalExpenses;
        const savingsRate =
          totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
        const monthlySavings = get().getMonthlySavings();

        return {
          totalIncome,
          totalExpenses,
          savings,
          savingsRate,
          monthlySavings,
        };
      },

      clearAllTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: 'transactions-storage',
      storage: secureStorageAdapter<TransactionState>(),
    }
  )
);

