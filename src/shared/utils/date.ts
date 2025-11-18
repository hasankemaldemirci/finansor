import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  isYesterday,
  differenceInDays,
} from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import i18n from '@/shared/lib/i18n';

export function formatDate(
  date: Date,
  formatStr: string = 'dd MMMM yyyy'
): string {
  const locale = i18n.language === 'tr' ? tr : enUS;
  return format(date, formatStr, { locale });
}

export function formatRelativeDate(date: Date): string {
  const locale = i18n.language === 'tr' ? tr : enUS;
  
  if (isToday(date)) {
    return i18n.t('date.today', 'Bugün');
  }
  if (isYesterday(date)) {
    return i18n.t('date.yesterday', 'Dün');
  }

  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff < 7) {
    return format(date, 'EEEE', { locale });
  }

  return formatDate(date, 'dd MMM');
}

export function getDateRange(period: 'today' | 'week' | 'month'): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const locale = i18n.language === 'tr' ? tr : enUS;

  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case 'week':
      return {
        start: startOfWeek(now, { locale }),
        end: endOfWeek(now, { locale }),
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}
