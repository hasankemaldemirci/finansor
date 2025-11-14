import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/shared/components/layout/Container';
import { LevelUpModal } from '@/features/gamification/components/LevelUpModal';
import { AchievementUnlockedModal } from '@/features/gamification/components/AchievementUnlockedModal';
import { TransactionForm } from '@/features/transactions/components/TransactionForm';
import { TransactionItem } from '@/features/transactions/components/TransactionItem';
import { TransactionEditModal } from '@/features/transactions/components/TransactionEditModal';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { formatCurrency } from '@/shared/utils/currency';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { Achievement } from '@/features/gamification/types/achievement.types';
import { Transaction } from '@/features/transactions/types/transaction.types';
import { ROUTES } from '@/shared/constants/routes';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { getCategoryLabel } from '@/features/transactions/utils/statisticsCalculations';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export function HomePage() {
  const [levelUpModal, setLevelUpModal] = useState<{
    open: boolean;
    level: number;
  }>({ open: false, level: 1 });

  const [achievementModal, setAchievementModal] = useState<{
    open: boolean;
    achievement: Achievement | null;
  }>({ open: false, achievement: null });

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const {
    transactions,
    getStats,
    deleteTransaction,
    editTransaction,
    getTransactionById,
  } = useTransactions();
  const { settings } = useSettingsStore();
  const stats = getStats();

  // Show only last 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  // Monthly goal tracking for celebration
  const monthlyGoal = settings.monthlyGoal;
  const currentSavings = stats.monthlySavings;
  const goalProgress =
    monthlyGoal > 0 ? Math.min(100, (currentSavings / monthlyGoal) * 100) : 0;

  const previousGoalProgress = useRef(goalProgress);
  const goalReachedRef = useRef(false);

  // Budget warnings
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date) >= currentMonth && new Date(t.date) <= endOfMonth
  );

  const budgetWarnings = (settings.categoryBudgets || [])
    .map((budget) => {
      const categorySpending = monthlyTransactions
        .filter((t) => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage =
        budget.limit > 0 ? (categorySpending / budget.limit) * 100 : 0;

      if (percentage >= 100) {
        return {
          category: getCategoryLabel(budget.category),
          spent: categorySpending,
          limit: budget.limit,
          exceeded: categorySpending - budget.limit,
          percentage: 100,
        };
      } else if (percentage >= 80) {
        return {
          category: getCategoryLabel(budget.category),
          spent: categorySpending,
          limit: budget.limit,
          exceeded: 0,
          percentage,
        };
      }
      return null;
    })
    .filter((w) => w !== null);

  // Goal celebration effect
  useEffect(() => {
    if (
      goalProgress >= 100 &&
      previousGoalProgress.current < 100 &&
      !goalReachedRef.current
    ) {
      goalReachedRef.current = true;

      // Confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const intervalId = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(intervalId);
          return;
        }

        // Burst from center
        confetti({
          particleCount: 10,
          angle: 60,
          spread: 55,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#00D9A3', '#6C5CE7', '#FDCB6E'],
          useWorker: false,
        });
      }, 200);

      return () => clearInterval(intervalId);
    }

    previousGoalProgress.current = goalProgress;

    // Reset when goal progress drops below 100
    if (goalProgress < 100) {
      goalReachedRef.current = false;
    }
  }, [goalProgress]);

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
      setTimeout(
        () => {
          setAchievementModal({
            open: true,
            achievement: data.unlockedAchievements![0],
          });
        },
        data.leveledUp ? 2000 : 500
      ); // Delay if level up modal is shown
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

        {/* Budget Warnings */}
        {budgetWarnings.length > 0 && (
          <Card className="border-2 border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Bütçe Uyarıları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetWarnings.map((warning, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-semibold text-foreground">
                        {warning.category}
                      </p>
                      <span className="text-sm font-medium text-destructive">
                        {warning.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Harcanan</span>
                        <span className="font-medium">
                          {formatCurrency(warning.spent, settings.currency)} /{' '}
                          {formatCurrency(warning.limit, settings.currency)}
                        </span>
                      </div>
                      {warning.exceeded > 0 && (
                        <p className="text-sm font-medium text-destructive">
                          ⚠️ Bütçe aşıldı:{' '}
                          {formatCurrency(warning.exceeded, settings.currency)}
                        </p>
                      )}
                      {warning.exceeded === 0 && warning.percentage >= 80 && (
                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          ⚠️ Bütçenizin %80'ine ulaştınız
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son İşlemler</CardTitle>
            {transactions.length > 5 && (
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to={ROUTES.TRANSACTIONS}
                  className="flex items-center gap-1"
                >
                  Tümü
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>Henüz işlem eklenmedi</p>
                <p className="mt-2 text-sm">
                  Yukarıdaki formdan ilk işleminizi ekleyin
                </p>
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
