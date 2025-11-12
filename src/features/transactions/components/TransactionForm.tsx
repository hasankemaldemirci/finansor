import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useTransactionForm } from '../hooks/useTransactionForm';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionType } from '@/shared/types/common.types';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';

interface TransactionFormProps {
  onSuccess?: (data: { leveledUp: boolean; newLevel?: number }) => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { handleSubmit, formState, watch, setValue, reset } =
    useTransactionForm();
  const { createTransaction } = useTransactions();
  const { settings } = useSettingsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountValue, setAmountValue] = useState<string>('');

  const transactionType = watch('type') as TransactionType;

  // Currency configuration based on settings
  const currencyConfig = {
    TRY: { prefix: '₺ ', decimalSeparator: ',', groupSeparator: '.' },
    USD: { prefix: '$ ', decimalSeparator: '.', groupSeparator: ',' },
    EUR: { prefix: '€ ', decimalSeparator: ',', groupSeparator: '.' },
  };

  const config = currencyConfig[settings.currency] || currencyConfig.TRY;

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      // Set default category if not provided
      const category =
        data.category || (data.type === 'income' ? 'other' : 'other');
      const result = createTransaction({ 
        ...data, 
        category,
        date: new Date()
      });
      reset();
      setAmountValue('');
      onSuccess?.(result);
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Transaction Type Tabs */}
      <Tabs
        value={transactionType}
        onValueChange={(value) => setValue('type', value as TransactionType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="income" className="text-base">
            💰 Gelir
          </TabsTrigger>
          <TabsTrigger value="expense" className="text-base">
            💸 Gider
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Amount - Large and Centered */}
      <div className="space-y-3">
        <CurrencyInput
          id="amount"
          name="amount"
          placeholder={`0${config.decimalSeparator}00 ${config.prefix.trim()}`}
          value={amountValue}
          decimalsLimit={2}
          suffix={' ' + config.prefix.trim()}
          decimalSeparator={config.decimalSeparator}
          groupSeparator={config.groupSeparator}
          autoComplete="off"
          onValueChange={(value) => {
            setAmountValue(value || '');
            setValue('amount', value ? parseFloat(value) : 0);
          }}
          className={`flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-4xl font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            transactionType === 'income' ? 'text-primary' : 'text-destructive'
          }`}
        />
        {formState.errors.amount && (
          <p className="text-center text-sm text-destructive">
            {formState.errors.amount.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-12 w-full text-base font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Ekleniyor...' : 'İşlem Ekle'}
      </Button>
    </form>
  );
}
