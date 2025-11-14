import { Transaction } from '../types/transaction.types';
import { getCategoryLabel } from './statisticsCalculations';

export interface SavingsTip {
  category: string;
  message: string;
  icon: string;
  priority: number;
}

const TIPS: Record<string, string[]> = {
  groceries: [
    'Market harcamalarınız yüksek. Toplu alışveriş yaparak ve indirimleri takip ederek tasarruf edebilirsiniz.',
    'Haftalık menü planlaması yaparak gereksiz alışverişlerden kaçınabilirsiniz.',
    'Markette liste yapmadan gitmeyin. Bu, gereksiz harcamaları önler.',
  ],
  transport: [
    'Ulaşım maliyetlerinizi azaltmak için toplu taşıma kullanmayı düşünebilirsiniz.',
    'Yakın mesafeler için yürüyüş veya bisiklet kullanarak hem sağlık hem de para tasarrufu yapabilirsiniz.',
    'Araç paylaşımı veya ortak yolculuk yaparak ulaşım maliyetlerini düşürebilirsiniz.',
  ],
  entertainment: [
    'Eğlence harcamalarınızı azaltmak için evde aktiviteler planlayabilirsiniz.',
    'Ücretsiz etkinlikleri ve promosyonları takip edebilirsiniz.',
    'Aylık eğlence bütçesi belirleyerek kontrol altına alabilirsiniz.',
  ],
  shopping: [
    'Alışveriş yapmadan önce gerçekten ihtiyacınız olup olmadığını düşünün.',
    'İndirim dönemlerini bekleyerek daha uygun fiyatlara alabilirsiniz.',
    'İkinci el alışverişi değerlendirebilirsiniz.',
  ],
  bills: [
    'Faturalarınızı zamanında ödeyerek gecikme ücretlerinden kaçınabilirsiniz.',
    'Enerji tasarruflu cihazlar kullanarak elektrik faturalarınızı düşürebilirsiniz.',
    'Farklı sağlayıcıları karşılaştırarak daha uygun paketler bulabilirsiniz.',
  ],
  health: [
    'Düzenli sağlık kontrolleri yaparak büyük sağlık harcamalarından kaçınabilirsiniz.',
    'Sağlıklı yaşam tarzı benimseyerek uzun vadede sağlık maliyetlerini azaltabilirsiniz.',
    'Sağlık sigortası seçeneklerini değerlendirebilirsiniz.',
  ],
  rent: [
    'Kira maliyetlerinizi düşürmek için daha uygun bölgeleri araştırabilirsiniz.',
    'Ev arkadaşı ile yaşayarak kira maliyetlerini paylaşabilirsiniz.',
    'Kira sözleşmesi yenileme zamanında pazarlık yapabilirsiniz.',
  ],
  education: [
    'Ücretsiz online kursları değerlendirebilirsiniz.',
    'Kütüphane kaynaklarını kullanarak kitap maliyetlerini azaltabilirsiniz.',
    'Burs ve eğitim desteklerini araştırabilirsiniz.',
  ],
};

const GENERAL_TIPS = [
  {
    condition: (expenses: number, income: number) => expenses > income * 0.8,
    message:
      "Harcamalarınız gelirinizin %80'inden fazla. Tasarruf yapmak için harcamalarınızı gözden geçirin.",
    icon: '⚠️',
  },
  {
    condition: (expenses: number, income: number) => expenses > income * 0.6,
    message:
      "Harcamalarınız gelirinizin %60'ından fazla. Bütçe planlaması yaparak kontrol altına alabilirsiniz.",
    icon: '💡',
  },
];

export function getSavingsTips(transactions: Transaction[]): SavingsTip[] {
  const tips: SavingsTip[] = [];
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

  // Get current month transactions
  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date) >= currentMonth && new Date(t.date) <= endOfMonth
  );

  // Calculate total income and expenses
  const totalIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Category-based tips
  const categoryExpenses = new Map<string, number>();
  monthlyTransactions
    .filter((t) => t.type === 'expense')
    .forEach((transaction) => {
      const current = categoryExpenses.get(transaction.category) || 0;
      categoryExpenses.set(transaction.category, current + transaction.amount);
    });

  // Find categories with high spending (more than 20% of total expenses)
  const threshold = totalExpenses * 0.2;
  categoryExpenses.forEach((amount, category) => {
    if (amount > threshold && TIPS[category]) {
      const categoryLabel = getCategoryLabel(category);
      const randomTip =
        TIPS[category][Math.floor(Math.random() * TIPS[category].length)];
      tips.push({
        category: categoryLabel,
        message: randomTip,
        icon: '💡',
        priority: amount / totalExpenses, // Higher spending = higher priority
      });
    }
  });

  // General tips
  GENERAL_TIPS.forEach((tip) => {
    if (tip.condition(totalExpenses, totalIncome)) {
      tips.push({
        category: 'Genel',
        message: tip.message,
        icon: tip.icon,
        priority: 0.5,
      });
    }
  });

  // Sort by priority (highest first)
  return tips.sort((a, b) => b.priority - a.priority).slice(0, 3); // Return top 3 tips
}
