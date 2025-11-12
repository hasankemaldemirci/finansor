import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencyInput from 'react-currency-input-field';
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
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Transaction } from '../types/transaction.types';
import { FilterOptions } from './TransactionFilters';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { SlidersHorizontal, X } from 'lucide-react';

interface TransactionListProps {
  transactions?: Transaction[];
  filters?: FilterOptions;
  onFiltersChange?: (filters: FilterOptions) => void;
  onResetFilters?: () => void;
  hideCard?: boolean;
}

export function TransactionList({ 
  transactions: propTransactions,
  filters,
  onFiltersChange,
  onResetFilters,
  hideCard = false,
}: TransactionListProps) {
  const { transactions: allTransactions, deleteTransaction, editTransaction, getTransactionById } = useTransactions();
  const { settings } = useSettingsStore();
  const [showAll, setShowAll] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minAmountValue, setMinAmountValue] = useState<string>('');

  // Currency configuration
  const currencyConfig = {
    TRY: { prefix: '₺', decimalSeparator: ',', groupSeparator: '.' },
    USD: { prefix: '$', decimalSeparator: '.', groupSeparator: ',' },
    EUR: { prefix: '€', decimalSeparator: ',', groupSeparator: '.' },
  };

  const config = currencyConfig[settings.currency] || currencyConfig.TRY;

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
    const emptyContent = (
      <div className="text-center py-8 text-muted-foreground">
        <p>Henüz işlem eklemediniz.</p>
        <p className="text-sm mt-2">
          İlk işleminizi ekleyerek XP kazanmaya başlayın!
        </p>
      </div>
    );

    if (hideCard) {
      return emptyContent;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Son İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          {emptyContent}
        </CardContent>
      </Card>
    );
  }

  const listContent = (
    <div className="space-y-3">
      {displayedTransactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={deleteTransaction}
          onEdit={handleEdit}
        />
      ))}
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
    </div>
  );

  const filterButton = filters && onFiltersChange && (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-3">
      <div className="container mx-auto max-w-3xl space-y-2">
        <Button
          variant="outline"
          onClick={() => setShowFilterModal(true)}
          className="w-full gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrele
          {hasActiveFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
              •
            </span>
          )}
        </Button>

        {/* Active Filters Info */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {transactions.length} sonuç bulundu
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Temizle
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {hideCard ? (
        <>
          {listContent}
          {filterButton}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            {listContent}
          </CardContent>
        </Card>
      )}

      {editingTransaction && (
        <TransactionEditModal
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={handleSaveEdit}
        />
      )}

      {/* Filter Modal */}
      {createPortal(
        <AnimatePresence>
          {filters && onFiltersChange && showFilterModal && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/80"
                onClick={() => setShowFilterModal(false)}
              />
              
              {/* Modal Content */}
              <motion.div
                initial={{ transform: 'translateY(100%)' }}
                animate={{ transform: 'translateY(0%)' }}
                exit={{ transform: 'translateY(100%)' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                className="fixed left-0 right-0 top-0 bottom-0 z-[60] bg-background flex flex-col"
              >
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold">Filtrele</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilterModal(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ara</label>
                <Input
                  placeholder="Açıklama veya kategori..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">İşlem Tipi</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => updateFilter('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[70]">
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="income">Gelir</SelectItem>
                    <SelectItem value="expense">Gider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tarih Aralığı</label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => updateFilter('dateRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[70]">
                    <SelectItem value="all">Tüm Zamanlar</SelectItem>
                    <SelectItem value="7days">Son 7 Gün</SelectItem>
                    <SelectItem value="30days">Son 30 Gün</SelectItem>
                    <SelectItem value="90days">Son 90 Gün</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => updateFilter('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="z-[70]">
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
              </div>

              {/* Min Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Tutar</label>
                <CurrencyInput
                  placeholder={`0${config.decimalSeparator}00 ${config.prefix}`}
                  value={minAmountValue}
                  decimalsLimit={2}
                  suffix={' ' + config.prefix}
                  decimalSeparator={config.decimalSeparator}
                  groupSeparator={config.groupSeparator}
                  autoComplete="off"
                  onValueChange={(value) => {
                    setMinAmountValue(value || '');
                    updateFilter('minAmount', value ? parseFloat(value) : undefined);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              </div>

              <div className="px-6 py-4 border-t flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onResetFilters?.();
                    setShowFilterModal(false);
                  }}
                  className="flex-1"
                >
                  Temizle
                </Button>
                <Button onClick={() => setShowFilterModal(false)} className="flex-1">
                  Uygula
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}

