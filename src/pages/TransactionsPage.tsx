import { useState } from 'react';
import { Container } from '@/shared/components/layout/Container';
import { TransactionList } from '@/features/transactions/components/TransactionList';
import { FilterOptions } from '@/features/transactions/components/TransactionFilters';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { filterTransactions } from '@/features/transactions/utils/filterTransactions';

const defaultFilters: FilterOptions = {
  searchTerm: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
};

export function TransactionsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Tüm İşlemler</h1>
          <p className="text-muted-foreground">
            Geçmiş işlemlerinizi görüntüleyin ve filtreleyin
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

