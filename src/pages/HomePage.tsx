import { useState } from 'react';
import { Container } from '@/shared/components/layout/Container';
import { LevelBar } from '@/features/gamification/components/LevelBar';
import { LevelUpModal } from '@/features/gamification/components/LevelUpModal';
import { AchievementUnlockedModal } from '@/features/gamification/components/AchievementUnlockedModal';
import { TransactionForm } from '@/features/transactions/components/TransactionForm';
import { TransactionList } from '@/features/transactions/components/TransactionList';
import { FilterOptions } from '@/features/transactions/components/TransactionFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { formatCurrency } from '@/shared/utils/currency';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { Achievement } from '@/features/gamification/types/achievement.types';
import { filterTransactions } from '@/features/transactions/utils/filterTransactions';

const defaultFilters: FilterOptions = {
  searchTerm: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
};

export function HomePage() {
  const [levelUpModal, setLevelUpModal] = useState<{
    open: boolean;
    level: number;
  }>({ open: false, level: 1 });

  const [achievementModal, setAchievementModal] = useState<{
    open: boolean;
    achievement: Achievement | null;
  }>({ open: false, achievement: null });

  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const { transactions, getStats } = useTransactions();
  const { settings } = useSettingsStore();
  const stats = getStats();

  const filteredTransactions = filterTransactions(transactions, filters);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

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

  return (
    <Container>
      <div className="space-y-6">
        {/* Level Bar */}
        <LevelBar />

        {/* Stats Cards */}
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

        {/* Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Yeni İşlem Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm onSuccess={handleTransactionSuccess} />
          </CardContent>
        </Card>

        {/* Transaction List with Inline Filters */}
        <TransactionList 
          transactions={filteredTransactions}
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={handleResetFilters}
        />
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
      />
    </Container>
  );
}

