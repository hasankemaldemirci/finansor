import { useState } from 'react';
import { TransactionItem } from './TransactionItem';
import { TransactionEditModal } from './TransactionEditModal';
import { useTransactions } from '../hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Transaction } from '../types/transaction.types';
import { FilterOptions } from './TransactionFilters';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface TransactionListProps {
  transactions?: Transaction[];
  filters?: FilterOptions;
  onFiltersChange?: (filters: FilterOptions) => void;
  onResetFilters?: () => void;
}

export function TransactionList({ 
  transactions: propTransactions,
  filters,
  onFiltersChange,
  onResetFilters,
}: TransactionListProps) {
  const { transactions: allTransactions, deleteTransaction, editTransaction, getTransactionById } = useTransactions();
  const [showAll, setShowAll] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Use filtered transactions if provided, otherwise use all transactions
  const transactions = propTransactions || allTransactions;
  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 10);

  const hasActiveFilters = filters && (
    filters.searchTerm !== '' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateRange !== 'all'
  );

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    if (filters && onFiltersChange) {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  const handleEdit = (id: string) => {
    const transaction = getTransactionById(id);
    if (transaction) {
      setEditingTransaction(transaction);
    }
  };

  const handleSaveEdit = (id: string, data: any) => {
    editTransaction(id, data);
    setEditingTransaction(null);
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Son İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Henüz işlem eklemediniz.</p>
            <p className="text-sm mt-2">
              İlk işleminizi ekleyerek XP kazanmaya başlayın!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Compact Inline Filters */}
          {filters && onFiltersChange && (
            <div className="mb-4 space-y-3">
              {/* Quick Search & Type Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ara (açıklama, kategori)..."
                    value={filters.searchTerm}
                    onChange={(e) => updateFilter('searchTerm', e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Type Filter */}
                <Select
                  value={filters.type}
                  onValueChange={(value) => updateFilter('type', value)}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="income">Gelir</SelectItem>
                    <SelectItem value="expense">Gider</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range */}
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => updateFilter('dateRange', value)}
                >
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Zamanlar</SelectItem>
                    <SelectItem value="7days">Son 7 Gün</SelectItem>
                    <SelectItem value="30days">Son 30 Gün</SelectItem>
                    <SelectItem value="90days">Son 90 Gün</SelectItem>
                  </SelectContent>
                </Select>

                {/* Advanced Filters Toggle */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={showAdvancedFilters ? 'bg-primary/10 text-primary' : ''}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>

                {/* Clear Filters */}
                {hasActiveFilters && onResetFilters && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onResetFilters}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Advanced Filters (Collapsible) */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t">
                  {/* Category Filter */}
                  <Select
                    value={filters.category}
                    onValueChange={(value) => updateFilter('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kategoriler</SelectItem>
                      <SelectItem value="salary">Maaş</SelectItem>
                      <SelectItem value="freelance">Serbest Çalışma</SelectItem>
                      <SelectItem value="investment">Yatırım</SelectItem>
                      <SelectItem value="rent">Kira</SelectItem>
                      <SelectItem value="groceries">Market</SelectItem>
                      <SelectItem value="transport">Ulaşım</SelectItem>
                      <SelectItem value="entertainment">Eğlence</SelectItem>
                      <SelectItem value="bills">Faturalar</SelectItem>
                      <SelectItem value="health">Sağlık</SelectItem>
                      <SelectItem value="shopping">Alışveriş</SelectItem>
                      <SelectItem value="education">Eğitim</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Min Amount */}
                  <Input
                    type="number"
                    placeholder="Min. Tutar"
                    value={filters.minAmount || ''}
                    onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              )}

              {/* Active Filters Info */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{transactions.length} sonuç bulundu</span>
                  {filters.searchTerm && <span>• Arama aktif</span>}
                  {filters.type !== 'all' && <span>• {filters.type === 'income' ? 'Gelir' : 'Gider'}</span>}
                  {filters.dateRange !== 'all' && <span>• {filters.dateRange === '7days' ? 'Son 7 gün' : filters.dateRange === '30days' ? 'Son 30 gün' : 'Son 90 gün'}</span>}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
          {displayedTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={deleteTransaction}
              onEdit={handleEdit}
            />
          ))}
        </div>
        {transactions.length > 10 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Daha Az Göster' : `Tümünü Göster (${transactions.length})`}
          </Button>
        )}
        {transactions.length > 0 && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            {transactions.length} işlem bulundu
          </p>
        )}
        </CardContent>
      </Card>

      {editingTransaction && (
        <TransactionEditModal
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}

