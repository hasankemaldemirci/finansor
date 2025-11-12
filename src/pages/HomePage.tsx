import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/shared/components/layout/Container';
import { LevelUpModal } from '@/features/gamification/components/LevelUpModal';
import { AchievementUnlockedModal } from '@/features/gamification/components/AchievementUnlockedModal';
import { TransactionForm } from '@/features/transactions/components/TransactionForm';
import { TransactionItem } from '@/features/transactions/components/TransactionItem';
import { TransactionEditModal } from '@/features/transactions/components/TransactionEditModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { formatCurrency } from '@/shared/utils/currency';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { Achievement } from '@/features/gamification/types/achievement.types';
import { Transaction } from '@/features/transactions/types/transaction.types';
import { ROUTES } from '@/shared/constants/routes';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  const [levelUpModal, setLevelUpModal] = useState<{
    open: boolean;
    level: number;
  }>({ open: false, level: 1 });

  const [achievementModal, setAchievementModal] = useState<{
    open: boolean;
    achievement: Achievement | null;
  }>({ open: false, achievement: null });

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { transactions, getStats, deleteTransaction, editTransaction, getTransactionById } = useTransactions();
  const { settings } = useSettingsStore();
  const stats = getStats();

  // Show only last 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const handleTransactionSuccess = (data: {
    leveledUp: boolean;
    newLevel?: number;
    unlockedAchievements?: Achievement[];
  }) => {
    if (data.leveledUp && data.newLevel) {
      setLevelUpModal({ open: true, level: data.newLevel });
    }

    // Show first achievement if any
    if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
      setTimeout(() => {
        setAchievementModal({
          open: true,
          achievement: data.unlockedAchievements![0],
        });
      }, data.leveledUp ? 2000 : 500); // Delay if level up modal is shown
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

  return (
    <Container>
      <div className="space-y-6">
        {/* Transaction Form - First Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Yeni İşlem Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm onSuccess={handleTransactionSuccess} />
          </CardContent>
        </Card>

        {/* Stats Cards - Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Gelir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(stats.totalIncome, settings.currency)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Gider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(stats.totalExpenses, settings.currency)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasarruf
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-secondary">
                {formatCurrency(stats.savings, settings.currency)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son İşlemler</CardTitle>
            {transactions.length > 5 && (
              <Button variant="ghost" size="sm" asChild>
                <Link to={ROUTES.TRANSACTIONS} className="flex items-center gap-1">
                  Tümü
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz işlem eklenmedi</p>
                <p className="text-sm mt-2">Yukarıdaki formdan ilk işleminizi ekleyin</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={deleteTransaction}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Level Up Modal */}
      <LevelUpModal
        open={levelUpModal.open}
        onClose={() => setLevelUpModal({ ...levelUpModal, open: false })}
        newLevel={levelUpModal.level}
      />

      {/* Achievement Unlocked Modal */}
      <AchievementUnlockedModal
        open={achievementModal.open}
        onClose={() => setAchievementModal({ open: false, achievement: null })}
        achievement={achievementModal.achievement}
        hideOverlay={levelUpModal.open}
      />

      {/* Transaction Edit Modal */}
      {editingTransaction && (
        <TransactionEditModal
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={handleSaveEdit}
        />
      )}
    </Container>
  );
}

