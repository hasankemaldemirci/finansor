import { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { TransactionItem } from './TransactionItem';
import { TransactionEditModal } from './TransactionEditModal';
import { useTransactions } from '../hooks/useTransactions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const {
    transactions: allTransactions,
    deleteTransaction,
    editTransaction,
    getTransactionById,
  } = useTransactions();
  const { settings } = useSettingsStore();
  const [showAll, setShowAll] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions | null>(null);
  const [minAmountValue, setMinAmountValue] = useState<string>(
    filters?.minAmount?.toString() || ''
  );

  // Currency configuration
  const currencyConfig = {
    TRY: { prefix: '₺', decimalSeparator: ',', groupSeparator: '.' },
    USD: { prefix: '$', decimalSeparator: '.', groupSeparator: ',' },
    EUR: { prefix: '€', decimalSeparator: ',', groupSeparator: '.' },
  };

  const config = currencyConfig[settings.currency] || currencyConfig.TRY;

  // Initialize local filters when modal opens
  useEffect(() => {
    if (showFilterModal && filters) {
      // Copy current filters to local state when modal opens
      setLocalFilters({ ...filters });
      setMinAmountValue(filters.minAmount?.toString() || '');
    } else if (!showFilterModal) {
      // Clear local filters when modal closes
      setLocalFilters(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilterModal]);

  // Sync minAmountValue with local filters
  useEffect(() => {
    if (localFilters?.minAmount !== undefined) {
      setMinAmountValue(localFilters.minAmount.toString());
    } else {
      setMinAmountValue('');
    }
  }, [localFilters?.minAmount]);

  // Use filtered transactions if provided, otherwise use all transactions
  const transactions = propTransactions || allTransactions;
  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 10);

  const hasActiveFilters =
    filters &&
    (filters.searchTerm !== '' ||
      filters.type !== 'all' ||
      filters.category !== 'all' ||
      filters.dateRange !== 'all' ||
      filters.minAmount !== undefined ||
      filters.maxAmount !== undefined);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    if (localFilters) {
      setLocalFilters({ ...localFilters, [key]: value });
    }
  };

  const handleApplyFilters = () => {
    if (localFilters && onFiltersChange) {
      onFiltersChange(localFilters);
      setShowFilterModal(false);
    }
  };

  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
      setShowFilterModal(false);
    }
  };

  // Count active filters in local state
  const countActiveFilters = (filterState: FilterOptions | null): number => {
    if (!filterState) return 0;
    let count = 0;
    if (filterState.searchTerm.trim() !== '') count++;
    if (filterState.type !== 'all') count++;
    if (filterState.category !== 'all') count++;
    if (filterState.dateRange !== 'all') count++;
    if (filterState.minAmount !== undefined) count++;
    if (filterState.maxAmount !== undefined) count++;
    return count;
  };

  const activeFilterCount = countActiveFilters(localFilters);

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
      <div className="py-8 text-center text-muted-foreground">
        <p>{t('transactions.noTransactionsYet')}</p>
        <p className="mt-2 text-sm">
          {t('transactions.startEarningXP')}
        </p>
      </div>
    );

    if (hideCard) {
      return emptyContent;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('transactions.recentTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>{emptyContent}</CardContent>
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
          className="mt-4 w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? t('transactions.showLess')
            : `${t('transactions.showAll')} (${transactions.length})`}
        </Button>
      )}
    </div>
  );

  const filterButton = filters && onFiltersChange && (
    <div className="fixed bottom-16 left-0 right-0 z-40 border-t bg-background/95 p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] backdrop-blur-lg">
      <div className="container mx-auto max-w-3xl space-y-2">
        <Sheet open={showFilterModal} onOpenChange={setShowFilterModal}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t('transactions.filter')}
              {hasActiveFilters && (
                <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {countActiveFilters(filters)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-full flex-col sm:max-w-md"
          >
            <div className="sticky top-0 z-10 border-b bg-background">
              <SheetHeader className="relative px-6 pb-4 pt-6">
                <div className="flex items-center justify-center">
                  <div className="flex-1" />
                  <div className="flex flex-1 flex-col items-center">
                    <SheetTitle className="text-center">{t('transactions.filter')}</SheetTitle>
                    <SheetDescription className="whitespace-nowrap text-center text-sm">
                      {t('transactions.filterDescription')}
                    </SheetDescription>
                  </div>
                  <div className="flex-1" />
                </div>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-clip px-4 py-4">
              {localFilters && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="-mx-2 space-y-2 px-2">
                    <label className="text-sm font-medium">{t('transactions.search')}</label>
                    <Input
                      placeholder={t('transactions.searchPlaceholder')}
                      value={localFilters.searchTerm}
                      onChange={(e) => updateFilter('searchTerm', e.target.value)}
                    />
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('transactions.form.type')}</label>
                    <Tabs
                      value={localFilters.type}
                      onValueChange={(value) => updateFilter('type', value)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">{t('transactions.type.all')}</TabsTrigger>
                        <TabsTrigger value="income">💰 {t('transactions.type.income')}</TabsTrigger>
                        <TabsTrigger value="expense">💸 {t('transactions.type.expense')}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('transactions.dateRange')}</label>
                    <Select
                      value={localFilters.dateRange}
                      onValueChange={(value) => updateFilter('dateRange', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('transactions.allTime')}</SelectItem>
                        <SelectItem value="7days">{t('transactions.last7Days')}</SelectItem>
                        <SelectItem value="30days">{t('transactions.last30Days')}</SelectItem>
                        <SelectItem value="90days">{t('transactions.last90Days')}</SelectItem>
                        <SelectItem value="1year">{t('transactions.lastYear')}</SelectItem>
                        <SelectItem value="custom">{t('transactions.customDate')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Date Range */}
                  {localFilters.dateRange === 'custom' && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('transactions.startDate')}</label>
                        <Input
                          type="date"
                          value={localFilters.startDate || ''}
                          onChange={(e) => updateFilter('startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('transactions.endDate')}</label>
                        <Input
                          type="date"
                          value={localFilters.endDate || ''}
                          onChange={(e) => updateFilter('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('transactions.categoryLabel')}</label>
                    <Select
                      value={localFilters.category}
                      onValueChange={(value) => updateFilter('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('transactions.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('transactions.category.all')}</SelectItem>
                        {localFilters.type === 'income' || localFilters.type === 'all' ? (
                          <>
                            <SelectItem value="salary">{t('transactions.category.salary')}</SelectItem>
                            <SelectItem value="freelance">{t('transactions.category.freelance')}</SelectItem>
                            <SelectItem value="investment">{t('transactions.category.investment')}</SelectItem>
                            <SelectItem value="gift">{t('transactions.category.gift')}</SelectItem>
                          </>
                        ) : null}
                        {localFilters.type === 'expense' || localFilters.type === 'all' ? (
                          <>
                            <SelectItem value="rent">{t('transactions.category.rent')}</SelectItem>
                            <SelectItem value="groceries">{t('transactions.category.groceries')}</SelectItem>
                            <SelectItem value="transport">{t('transactions.category.transport')}</SelectItem>
                            <SelectItem value="entertainment">{t('transactions.category.entertainment')}</SelectItem>
                            <SelectItem value="bills">{t('transactions.category.bills')}</SelectItem>
                            <SelectItem value="health">{t('transactions.category.health')}</SelectItem>
                            <SelectItem value="shopping">{t('transactions.category.shopping')}</SelectItem>
                            <SelectItem value="education">{t('transactions.category.education')}</SelectItem>
                          </>
                        ) : null}
                        <SelectItem value="other">{t('transactions.category.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Range */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('transactions.minAmount')}</label>
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
                          updateFilter(
                            'minAmount',
                            value ? parseFloat(value) : undefined
                          );
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('transactions.maxAmount')}</label>
                      <CurrencyInput
                        placeholder={`0${config.decimalSeparator}00 ${config.prefix}`}
                        value={localFilters.maxAmount?.toString() || ''}
                        decimalsLimit={2}
                        suffix={' ' + config.prefix}
                        decimalSeparator={config.decimalSeparator}
                        groupSeparator={config.groupSeparator}
                        autoComplete="off"
                        onValueChange={(value) => {
                          updateFilter(
                            'maxAmount',
                            value ? parseFloat(value) : undefined
                          );
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <SheetFooter className="sticky bottom-0 z-10 mt-0 gap-2 border-t bg-background p-4">
              <Button
                onClick={handleApplyFilters}
                className="w-full"
                disabled={!localFilters}
              >
                {t('transactions.apply')}
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-xs font-bold text-primary">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

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
            <CardTitle>{t('transactions.title')}</CardTitle>
          </CardHeader>
          <CardContent>{listContent}</CardContent>
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
