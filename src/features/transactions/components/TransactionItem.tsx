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

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  salary: 'Maaş',
  freelance: 'Serbest Çalışma',
  investment: 'Yatırım',
  gift: 'Hediye',
  rent: 'Kira',
  groceries: 'Market',
  transport: 'Ulaşım',
  entertainment: 'Eğlence',
  bills: 'Faturalar',
  health: 'Sağlık',
  shopping: 'Alışveriş',
  education: 'Eğitim',
  other: 'Diğer',
};

export function TransactionItem({ transaction, onDelete, onEdit }: TransactionItemProps) {
  const { settings } = useSettingsStore();
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4 hover:bg-muted/50 transition-colors">
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
          <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary">
            {categoryLabels[transaction.category] || transaction.category}
          </span>
        </div>
        {transaction.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {transaction.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeDate(new Date(transaction.date))}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">İşlem menüsü</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onEdit(transaction.id)}
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(transaction.id)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

