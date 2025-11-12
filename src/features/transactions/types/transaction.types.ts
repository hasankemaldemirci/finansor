import { TransactionType } from '@/shared/types/common.types';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'other';

export type ExpenseCategory =
  | 'rent'
  | 'groceries'
  | 'transport'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'shopping'
  | 'education'
  | 'other';

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  category: IncomeCategory | ExpenseCategory;
  description?: string;
  date?: Date;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
}

