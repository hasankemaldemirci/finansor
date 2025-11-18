import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Search, X } from 'lucide-react';
import { TransactionType } from '@/shared/types/common.types';
import { useTranslation } from 'react-i18next';

export interface FilterOptions {
  searchTerm: string;
  type: 'all' | TransactionType;
  category: string;
  dateRange: 'all' | '7days' | '30days' | '90days' | '1year' | 'custom';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface TransactionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onReset,
}: TransactionFiltersProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const incomeCategories = [
    { value: 'salary', label: t('transactions.category.salary') },
    { value: 'freelance', label: t('transactions.category.freelance') },
    { value: 'investment', label: t('transactions.category.investment') },
    { value: 'gift', label: t('transactions.category.gift') },
    { value: 'other', label: t('transactions.category.other') },
  ];

  const expenseCategories = [
    { value: 'rent', label: t('transactions.category.rent') },
    { value: 'groceries', label: t('transactions.category.groceries') },
    { value: 'transport', label: t('transactions.category.transport') },
    { value: 'entertainment', label: t('transactions.category.entertainment') },
    { value: 'bills', label: t('transactions.category.bills') },
    { value: 'health', label: t('transactions.category.health') },
    { value: 'shopping', label: t('transactions.category.shopping') },
    { value: 'education', label: t('transactions.category.education') },
    { value: 'other', label: t('transactions.category.other') },
  ];

  const categories =
    filters.type === 'income'
      ? incomeCategories
      : filters.type === 'expense'
        ? expenseCategories
        : [...incomeCategories, ...expenseCategories];

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.minAmount !== undefined ||
    filters.maxAmount !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              {t('transactions.clear')}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('transactions.simpleView') : t('transactions.detailedFilter')}
          </Button>
        </div>
      </div>
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">{t('transactions.search')}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            id="search"
            placeholder={t('transactions.searchPlaceholder')}
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Type Filter */}
        <div className="space-y-2">
          <Label>{t('transactions.typeLabel')}</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => updateFilter('type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transactions.type.all')}</SelectItem>
              <SelectItem value="income">{t('transactions.type.income')}</SelectItem>
              <SelectItem value="expense">{t('transactions.type.expense')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>{t('transactions.dateRange')}</Label>
          <Select
            value={filters.dateRange}
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

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>{t('transactions.categoryLabel')}</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transactions.category.all')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('transactions.startDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">{t('transactions.endDate')}</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Amount Range */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minAmount">{t('transactions.minAmount')}</Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.minAmount || ''}
                onChange={(e) =>
                  updateFilter(
                    'minAmount',
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">{t('transactions.maxAmount')}</Label>
              <Input
                id="maxAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.maxAmount || ''}
                onChange={(e) =>
                  updateFilter(
                    'maxAmount',
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-2 text-sm text-muted-foreground">
          <span className="font-medium">{t('transactions.activeFilters')}: </span>
          {filters.searchTerm && <span className="mr-2">🔍 {t('transactions.searchActive')}</span>}
          {filters.type !== 'all' && (
            <span className="mr-2">
              📊 {filters.type === 'income' ? t('transactions.type.income') : t('transactions.type.expense')}
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="mr-2">🏷️ {t('transactions.categorySelected')}</span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="mr-2">📅 {t('transactions.dateFilter')}</span>
          )}
          {(filters.minAmount !== undefined ||
            filters.maxAmount !== undefined) && (
            <span className="mr-2">💰 {t('transactions.amountRange')}</span>
          )}
        </div>
      )}
    </div>
  );
}
