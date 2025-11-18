import { useState } from 'react';
import { Container } from '@/shared/components/layout/Container';
import { TransactionList } from '@/features/transactions/components/TransactionList';
import { FilterOptions } from '@/features/transactions/components/TransactionFilters';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { filterTransactions } from '@/features/transactions/utils/filterTransactions';
import { useTranslation } from 'react-i18next';

const defaultFilters: FilterOptions = {
  searchTerm: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
};

export function TransactionsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const { transactions } = useTransactions();

  const filteredTransactions = filterTransactions(transactions, filters);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{t('transactions.title')}</h1>
          <p className="text-muted-foreground">
            {t('transactions.description')}
          </p>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={handleResetFilters}
          hideCard
        />
      </div>
    </Container>
  );
}
