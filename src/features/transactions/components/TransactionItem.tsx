import { Trash2, Pencil, MoreVertical } from 'lucide-react';
import { Transaction } from '../types/transaction.types';
import { formatCurrency } from '@/shared/utils/currency';
import { formatRelativeDate } from '@/shared/utils/date';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { useTranslation } from 'react-i18next';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function TransactionItem({
  transaction,
  onDelete,
  onEdit,
}: TransactionItemProps) {
  const { t } = useTranslation();
  const { settings } = useSettingsStore();
  const isIncome = transaction.type === 'income';
  
  const getCategoryLabel = (category: string) => {
    return t(`transactions.category.${category}`, category);
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 sm:p-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-lg font-semibold ${
              isIncome ? 'text-primary' : 'text-destructive'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, settings.currency)}
          </span>
          <span className="rounded-full bg-secondary/20 px-2 py-1 text-xs text-secondary">
            {getCategoryLabel(transaction.category)}
          </span>
        </div>
        {transaction.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {transaction.description}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatRelativeDate(new Date(transaction.date))}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">{t('transactions.menuLabel')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onEdit(transaction.id)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(transaction.id)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('common.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
