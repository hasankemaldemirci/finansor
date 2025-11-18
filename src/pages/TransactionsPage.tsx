import { useState } from 'react';
import { Container } from '@/shared/components/layout/Container';
import { TransactionList } from '@/features/transactions/components/TransactionList';
import { FilterOptions } from '@/features/transactions/components/TransactionFilters';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { filterTransactions } from '@/features/transactions/utils/filterTransactions';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

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

  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.minAmount !== undefined ||
    filters.maxAmount !== undefined;

  return (
    <Container className="pb-32 sm:pb-36">
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{t('transactions.title')}</h1>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {t('transactions.description')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <X className="h-4 w-4" />
                {t('transactions.clearFilters')}
              </button>
            )}
          </div>
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
