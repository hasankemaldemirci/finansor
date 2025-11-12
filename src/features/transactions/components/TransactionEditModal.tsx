import { useEffect, useState } from 'react';
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
import { Transaction, IncomeCategory, ExpenseCategory } from '../types/transaction.types';
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
  onSave: (id: string, data: {
    type: TransactionType;
    amount: number;
    category: string;
    description?: string;
    date: Date;
  }) => void;
}

export function TransactionEditModal({ open, onClose, transaction, onSave }: TransactionEditModalProps) {
  const { settings } = useSettingsStore();
  const [formData, setFormData] = useState({
    type: transaction.type,
    amount: transaction.amount.toString(),
    category: transaction.category,
    description: transaction.description || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description || '',
      });
    }
  }, [open, transaction]);

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    onSave(transaction.id, {
      type: formData.type,
      amount,
      category: formData.category,
      description: formData.description,
      date: transaction.date,
    });
    
    onClose();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      // Reset category to first available in new type
      category: newType === 'income' ? 'salary' : 'rent',
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="edit-amount" className="text-sm text-muted-foreground">
                Miktar
              </Label>
              <div className="relative w-full">
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  className={`text-4xl font-bold text-center h-20 ${
                    formData.type === 'income' 
                      ? 'text-primary' 
                      : 'text-destructive'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                  {settings.currency === 'TRY' ? '₺' : settings.currency === 'USD' ? '$' : '€'}
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
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

