import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Transaction,
  IncomeCategory,
  ExpenseCategory,
} from '../types/transaction.types';
import { TransactionType } from '@/shared/types/common.types';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';

const incomeCategories: { value: IncomeCategory; label: string }[] = [
  { value: 'salary', label: 'Maaş' },
  { value: 'freelance', label: 'Serbest Çalışma' },
  { value: 'investment', label: 'Yatırım' },
  { value: 'gift', label: 'Hediye' },
  { value: 'other', label: 'Diğer' },
];

const expenseCategories: { value: ExpenseCategory; label: string }[] = [
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

interface TransactionEditModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
  onSave: (
    id: string,
    data: {
      type: TransactionType;
      amount: number;
      category: string;
      description?: string;
      date: Date;
    }
  ) => void;
}

export function TransactionEditModal({
  open,
  onClose,
  transaction,
  onSave,
}: TransactionEditModalProps) {
  const { settings } = useSettingsStore();
  const [formData, setFormData] = useState({
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description || '',
  });
  const [amountValue, setAmountValue] = useState<string>(
    transaction.amount.toString()
  );

  // Currency configuration based on settings
  const currencyConfig = {
    TRY: { prefix: '₺ ', decimalSeparator: ',', groupSeparator: '.' },
    USD: { prefix: '$ ', decimalSeparator: '.', groupSeparator: ',' },
    EUR: { prefix: '€ ', decimalSeparator: ',', groupSeparator: '.' },
  };

  const config = currencyConfig[settings.currency] || currencyConfig.TRY;

  useEffect(() => {
    if (open) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || '',
      });
      setAmountValue(transaction.amount.toString());
    }
  }, [open, transaction]);

  const categories =
    formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(formData.amount) || formData.amount <= 0) {
      return;
    }

    onSave(transaction.id, {
      type: formData.type,
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: transaction.date,
    });

    onClose();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      // Reset category to first available in new type
      category: newType === 'income' ? 'salary' : 'rent',
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>İşlemi Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Tabs */}
          <Tabs
            value={formData.type}
            onValueChange={handleTypeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income" className="text-base">
                💰 Gelir
              </TabsTrigger>
              <TabsTrigger value="expense" className="text-base">
                💸 Gider
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Amount - Large and Centered */}
          <div className="space-y-3">
            <CurrencyInput
              id="edit-amount"
              name="edit-amount"
              placeholder={`0${config.decimalSeparator}00 ${config.prefix.trim()}`}
              value={amountValue}
              decimalsLimit={2}
              suffix={' ' + config.prefix.trim()}
              decimalSeparator={config.decimalSeparator}
              groupSeparator={config.groupSeparator}
              autoComplete="off"
              onValueChange={(value) => {
                setAmountValue(value || '');
                setFormData((prev) => ({
                  ...prev,
                  amount: value ? parseFloat(value) : 0,
                }));
              }}
              className={`flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-4xl font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                formData.type === 'income' ? 'text-primary' : 'text-destructive'
              }`}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Açıklama (Opsiyonel)</Label>
            <Input
              id="edit-description"
              placeholder="Açıklama giriniz..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" className="font-semibold">
              💾 Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
