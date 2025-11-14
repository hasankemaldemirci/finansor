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

const incomeCategories = [
  { value: 'salary', label: 'Maaş' },
  { value: 'freelance', label: 'Serbest Çalışma' },
  { value: 'investment', label: 'Yatırım' },
  { value: 'gift', label: 'Hediye' },
  { value: 'other', label: 'Diğer' },
];

const expenseCategories = [
  { value: 'rent', label: 'Kira' },
  { value: 'groceries', label: 'Market' },
  { value: 'transport', label: 'Ulaşım' },
  { value: 'entertainment', label: 'Eğlence' },
  { value: 'bills', label: 'Faturalar' },
  { value: 'health', label: 'Sağlık' },
  { value: 'shopping', label: 'Alışveriş' },
  { value: 'education', label: 'Eğitim' },
  { value: 'other', label: 'Diğer' },
];

export function TransactionFilters({
  filters,
  onFiltersChange,
  onReset,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
              Temizle
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Basit Görünüm' : 'Detaylı Filtre'}
          </Button>
        </div>
      </div>
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Ara</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            id="search"
            placeholder="Açıklama veya kategori ara..."
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
          <Label>Tip</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => updateFilter('type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="income">Gelir</SelectItem>
              <SelectItem value="expense">Gider</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Tarih Aralığı</Label>
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
              <SelectItem value="1year">Son 1 Yıl</SelectItem>
              <SelectItem value="custom">Özel Tarih</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
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
                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
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
              <Label htmlFor="minAmount">Min. Tutar</Label>
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
              <Label htmlFor="maxAmount">Max. Tutar</Label>
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
          <span className="font-medium">Aktif Filtreler: </span>
          {filters.searchTerm && <span className="mr-2">🔍 Arama aktif</span>}
          {filters.type !== 'all' && (
            <span className="mr-2">
              📊 {filters.type === 'income' ? 'Gelir' : 'Gider'}
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="mr-2">🏷️ Kategori seçili</span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="mr-2">📅 Tarih filtresi</span>
          )}
          {(filters.minAmount !== undefined ||
            filters.maxAmount !== undefined) && (
            <span className="mr-2">💰 Tutar aralığı</span>
          )}
        </div>
      )}
    </div>
  );
}
