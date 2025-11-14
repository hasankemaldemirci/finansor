import { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { TransactionItem } from './TransactionItem';
import { TransactionEditModal } from './TransactionEditModal';
import { useTransactions } from '../hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/shared/components/ui/sheet';
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 640); // sm breakpoint
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

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
        <Sheet open={showFilterModal} onOpenChange={setShowFilterModal}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
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
          </SheetTrigger>
          <SheetContent 
            side={isDesktop ? "right" : "bottom"} 
            className={`${
              isDesktop 
                ? "w-full sm:max-w-md" 
                : "h-screen"
            } overflow-y-auto ${isDesktop ? "" : "sm:rounded-t-2xl"}`}
          >
            <div className="sticky top-0 z-10 bg-background border-b">
              <SheetHeader className="px-6 pb-4 relative">
                <div className="flex items-center justify-center">
                  <div className="flex-1" />
                  <div className="flex-1 flex flex-col items-center">
                    <SheetTitle className="text-center">Filtrele</SheetTitle>
                    <SheetDescription className="text-center text-sm whitespace-nowrap">
                      İşlemlerinizi filtreleyin
                    </SheetDescription>
                  </div>
                  <div className="flex-1" />
                </div>
              </SheetHeader>
            </div>

            <div className="mt-6 space-y-4">
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
                <Tabs
                  value={filters.type}
                  onValueChange={(value) => updateFilter('type', value)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Tümü</TabsTrigger>
                    <TabsTrigger value="income">💰 Gelir</TabsTrigger>
                    <TabsTrigger value="expense">💸 Gider</TabsTrigger>
                  </TabsList>
                </Tabs>
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
                  <SelectContent>
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

            <SheetFooter className="mt-6 gap-2">
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
            </SheetFooter>
          </SheetContent>
        </Sheet>

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
    </>
  );
}

