import { Container } from '@/shared/components/layout/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
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

const COLORS = ['#00D9A3', '#6C5CE7', '#FDCB6E', '#E17055', '#74B9FF', '#A29BFE', '#FD79A8', '#81ECEC'];

export function StatisticsPage() {
  const { transactions, getStats } = useTransactions();
  const { settings } = useSettingsStore();
  const stats = getStats();

  const monthlyData = getMonthlyStats(transactions, 6);
  const topExpenseCategories = getTopCategories(transactions, 'expense', 5);
  const topIncomeCategories = getTopCategories(transactions, 'income', 5);
  const trend = getRecentTrend(transactions, 30);

  const totalIncome = stats.totalIncome;
  const totalExpenses = stats.totalExpenses;

  // Summary cards data
  const summaryCards = [
    {
      title: 'Toplam Gelir',
      value: formatCurrency(totalIncome, settings.currency),
      className: 'text-primary',
    },
    {
      title: 'Toplam Gider',
      value: formatCurrency(totalExpenses, settings.currency),
      className: 'text-destructive',
    },
    {
      title: 'Toplam Net Durum',
      value: formatCurrency(totalIncome - totalExpenses, settings.currency),
      className: (totalIncome - totalExpenses) >= 0 ? 'text-secondary' : 'text-destructive',
    },
    {
      title: 'Ortalama Gelir',
      value: (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(totalIncome / Math.max(1, monthlyData.length), settings.currency)}
          </span>
          <span className="text-sm text-muted-foreground">/ ay</span>
        </div>
      ),
      className: '',
    },
    {
      title: 'Son 30 Gün Trend',
      value: (
        <div className="flex items-center gap-2">
          {trend === 'up' && (
            <>
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">Yükseliş</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown className="h-6 w-6 text-destructive" />
              <span className="text-2xl font-bold text-destructive">Düşüş</span>
            </>
          )}
          {trend === 'stable' && (
            <>
              <Minus className="h-6 w-6 text-muted-foreground" />
              <span className="text-2xl font-bold text-muted-foreground">Sabit</span>
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

  if (transactions.length === 0) {
    return (
      <Container>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">İstatistikler</h1>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">Henüz veri yok</p>
                <p className="text-sm mt-2">
                  İşlem eklemeye başladığınızda istatistikler burada görünecek.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">İstatistikler</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
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
            <CardTitle>Aylık Gelir-Gider Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, settings.currency)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#00D9A3"
                  strokeWidth={2}
                  name="Gelir"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#E17055"
                  strokeWidth={2}
                  name="Gider"
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#6C5CE7"
                  strokeWidth={2}
                  name="Tasarruf"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Aylık Karşılaştırma</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, settings.currency)}
                />
                <Legend />
                <Bar dataKey="income" fill="#00D9A3" name="Gelir" />
                <Bar dataKey="expense" fill="#E17055" name="Gider" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expense Categories */}
          {topExpenseCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>En Çok Harcanan Kategoriler</CardTitle>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, settings.currency)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {topExpenseCategories.map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
                <CardTitle>Gelir Kaynakları</CardTitle>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, settings.currency)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {topIncomeCategories.map((cat, index) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
      </div>
    </Container>
  );
}

