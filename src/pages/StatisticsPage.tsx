import { useState } from 'react';
import { Container } from '@/shared/components/layout/Container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Progress } from '@/shared/components/ui/progress';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { formatCurrency } from '@/shared/utils/currency';
import {
  getMonthlyStats,
  getTopCategories,
  getRecentTrend,
} from '@/features/transactions/utils/statisticsCalculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAchievements } from '@/features/gamification/hooks/useAchievements';
import { AchievementCard } from '@/features/gamification/components/AchievementCard';
import { AchievementType } from '@/features/gamification/types/achievement.types';
import { ACHIEVEMENT_CATEGORIES } from '@/features/gamification/constants/achievements';
import { useLevel } from '@/features/gamification/hooks/useLevel';
import { ShareButton } from '@/shared/components/ShareButton';
import { generateStatsShareText } from '@/shared/utils/socialShare';
import { useTranslation } from 'react-i18next';

const COLORS = [
  '#00D9A3',
  '#6C5CE7',
  '#FDCB6E',
  '#E17055',
  '#74B9FF',
  '#A29BFE',
  '#FD79A8',
  '#81ECEC',
];

export function StatisticsPage() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<AchievementType | 'all'>(
    'all'
  );
  const { transactions, getStats } = useTransactions();
  const { settings } = useSettingsStore();
  const stats = getStats();
  
  // Dark mode detection
  const isDark = settings.theme === 'dark' || 
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Chart colors optimized for dark mode
  const chartColors = {
    grid: isDark ? 'hsl(var(--border) / 0.3)' : 'hsl(var(--border) / 0.2)',
    text: isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground) / 0.8)',
    income: isDark ? '#4DD4B8' : '#00D9A3', // Lighter in dark mode
    expense: isDark ? '#FF8A6B' : '#E17055', // Lighter in dark mode
    savings: isDark ? '#8B7DFF' : '#6C5CE7', // Lighter in dark mode
  };
  const {
    achievements,
    unlockedAchievements,
    completionPercentage,
    achievementsByType,
  } = useAchievements();
  const { level } = useLevel();

  const filteredAchievements =
    selectedType === 'all' ? achievements : achievementsByType[selectedType];

  const monthlyData = getMonthlyStats(transactions, 6);
  const topExpenseCategories = getTopCategories(transactions, 'expense', 5);
  const topIncomeCategories = getTopCategories(transactions, 'income', 5);
  const trend = getRecentTrend(transactions, 30);

  const totalIncome = stats.totalIncome;
  const totalExpenses = stats.totalExpenses;

  // Summary cards data
  const summaryCards = [
    {
      title: t('statistics.totalIncome'),
      value: formatCurrency(totalIncome, settings.currency),
      className: 'text-primary',
    },
    {
      title: t('statistics.totalExpense'),
      value: formatCurrency(totalExpenses, settings.currency),
      className: 'text-destructive',
    },
    {
      title: t('statistics.totalNet'),
      value: formatCurrency(totalIncome - totalExpenses, settings.currency),
      className:
        totalIncome - totalExpenses >= 0
          ? 'text-secondary'
          : 'text-destructive',
    },
    {
      title: t('statistics.averageIncome'),
      value: (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(
              totalIncome / Math.max(1, monthlyData.length),
              settings.currency
            )}
          </span>
          <span className="text-sm text-muted-foreground">/ {t('common.month')}</span>
        </div>
      ),
      className: '',
    },
    {
      title: t('statistics.recentTrend'),
      value: (
        <div className="flex items-center gap-2">
          {trend === 'up' && (
            <>
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">{t('statistics.trend.up')}</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown className="h-6 w-6 text-destructive" />
              <span className="text-2xl font-bold text-destructive">{t('statistics.trend.down')}</span>
            </>
          )}
          {trend === 'stable' && (
            <>
              <Minus className="h-6 w-6 text-muted-foreground" />
              <span className="text-2xl font-bold text-muted-foreground">
                {t('statistics.trend.stable')}
              </span>
            </>
          )}
        </div>
      ),
      className: '',
    },
  ];

  const getCardSpanClass = (index: number) => {
    const totalCards = summaryCards.length;
    // İlk 3 kart her zaman 2 sütun
    if (index < 3) {
      return 'md:col-span-2';
    }
    // Son 2 kart: 5 kart varsa 3 sütun, 6 kart varsa 2 sütun
    if (totalCards === 5 && index >= 3) {
      return 'md:col-span-3';
    }
    // 6 kart varsa hepsi 2 sütun
    return 'md:col-span-2';
  };

  const hasTransactions = transactions.length > 0;

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('statistics.title')}</h1>
          {hasTransactions && (
            <ShareButton
              title={t('statistics.shareTitle')}
              text={generateStatsShareText(
                stats.monthlySavings,
                settings.currency,
                level
              )}
              variant="outline"
              size="sm"
            />
          )}
        </div>

        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="statistics">{t('statistics.general')}</TabsTrigger>
            <TabsTrigger value="achievements">{t('statistics.achievements')}</TabsTrigger>
          </TabsList>

          <TabsContent value="statistics" className="mt-6 space-y-6">
            {!hasTransactions ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="text-lg">{t('statistics.noData')}</p>
                    <p className="mt-2 text-sm">
                      {t('statistics.noDataDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6">
                  {summaryCards.map((card, index) => (
                    <Card key={index} className={getCardSpanClass(index)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {card.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {typeof card.value === 'string' ? (
                          <p className={`text-2xl font-bold ${card.className}`}>
                            {card.value}
                          </p>
                        ) : (
                          card.value
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Monthly Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('statistics.monthlyTrend')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={chartColors.grid}
                        />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: chartColors.text }}
                          axisLine={{ stroke: chartColors.grid }}
                        />
                        <YAxis 
                          tick={{ fill: chartColors.text }}
                          axisLine={{ stroke: chartColors.grid }}
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            formatCurrency(value, settings.currency)
                          }
                          contentStyle={{
                            backgroundColor: isDark ? 'hsl(var(--card))' : 'white',
                            border: `1px solid ${chartColors.grid}`,
                            borderRadius: '8px',
                            color: chartColors.text,
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ color: chartColors.text }}
                        />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke={chartColors.income}
                          strokeWidth={2}
                          name={t('transactions.type.income')}
                        />
                        <Line
                          type="monotone"
                          dataKey="expense"
                          stroke={chartColors.expense}
                          strokeWidth={2}
                          name={t('transactions.type.expense')}
                        />
                        <Line
                          type="monotone"
                          dataKey="savings"
                          stroke={chartColors.savings}
                          strokeWidth={2}
                          name={t('statistics.savingsRate')}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Monthly Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('statistics.monthlyTrend')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={chartColors.grid}
                        />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: chartColors.text }}
                          axisLine={{ stroke: chartColors.grid }}
                        />
                        <YAxis 
                          tick={{ fill: chartColors.text }}
                          axisLine={{ stroke: chartColors.grid }}
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            formatCurrency(value, settings.currency)
                          }
                          contentStyle={{
                            backgroundColor: isDark ? 'hsl(var(--card))' : 'white',
                            border: `1px solid ${chartColors.grid}`,
                            borderRadius: '8px',
                            color: chartColors.text,
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ color: chartColors.text }}
                        />
                        <Bar dataKey="income" fill={chartColors.income} name={t('transactions.type.income')} />
                        <Bar dataKey="expense" fill={chartColors.expense} name={t('transactions.type.expense')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Expense Categories */}
                  {topExpenseCategories.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('statistics.topExpenseCategories')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={topExpenseCategories}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ category, percentage }) =>
                                `${category} (${percentage.toFixed(0)}%)`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="amount"
                            >
                              {topExpenseCategories.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) =>
                                formatCurrency(value, settings.currency)
                              }
                              contentStyle={{
                                backgroundColor: isDark ? 'hsl(var(--card))' : 'white',
                                border: `1px solid ${chartColors.grid}`,
                                borderRadius: '8px',
                                color: chartColors.text,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                          {topExpenseCategories.map((cat, index) => (
                            <div
                              key={cat.category}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                />
                                <span className="text-sm">{cat.category}</span>
                              </div>
                              <span className="text-sm font-semibold">
                                {formatCurrency(cat.amount, settings.currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Income Categories */}
                  {topIncomeCategories.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('statistics.topIncomeCategories')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={topIncomeCategories}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ category, percentage }) =>
                                `${category} (${percentage.toFixed(0)}%)`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="amount"
                            >
                              {topIncomeCategories.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) =>
                                formatCurrency(value, settings.currency)
                              }
                              contentStyle={{
                                backgroundColor: isDark ? 'hsl(var(--card))' : 'white',
                                border: `1px solid ${chartColors.grid}`,
                                borderRadius: '8px',
                                color: chartColors.text,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                          {topIncomeCategories.map((cat, index) => (
                            <div
                              key={cat.category}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                />
                                <span className="text-sm">{cat.category}</span>
                              </div>
                              <span className="text-sm font-semibold">
                                {formatCurrency(cat.amount, settings.currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="mt-6 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('achievements.progress')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('achievements.unlocked')}</span>
                  <span className="font-semibold">
                    {unlockedAchievements.length} / {achievements.length}
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <div className="text-center text-sm text-muted-foreground">
                  %{completionPercentage.toFixed(0)} {t('achievements.completed')}
                </div>
              </CardContent>
            </Card>

            {/* Filter Tabs */}
            <Tabs
              value={selectedType}
              onValueChange={(value) =>
                setSelectedType(value as AchievementType | 'all')
              }
              className="w-full"
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t('common.all')} ({achievements.length})
                </TabsTrigger>
                {Object.entries(ACHIEVEMENT_CATEGORIES).map(
                  ([type, category]) => {
                    const count =
                      achievementsByType[type as AchievementType]?.length || 0;
                    const label = t(category.labelKey);
                    return (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="data-[state=active]:bg-primary data-[state=active]:text-white"
                      >
                        {label} ({count})
                      </TabsTrigger>
                    );
                  }
                )}
              </TabsList>
            </Tabs>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                {t('achievements.empty', 'Bu kategoride başarı bulunamadı.')}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
