import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormValues } from '../schemas/transaction.schema';

export const useTransactionForm = () => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      category: undefined,
      description: '',
    },
  });

  return form;
};

