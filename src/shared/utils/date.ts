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
import { tr } from 'date-fns/locale';

export function formatDate(
  date: Date,
  formatStr: string = 'dd MMMM yyyy'
): string {
  return format(date, formatStr, { locale: tr });
}

export function formatRelativeDate(date: Date): string {
  if (isToday(date)) {
    return 'Bugün';
  }
  if (isYesterday(date)) {
    return 'Dün';
  }

  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff < 7) {
    return format(date, 'EEEE', { locale: tr });
  }

  return formatDate(date, 'dd MMM');
}

export function getDateRange(period: 'today' | 'week' | 'month'): {
  start: Date;
  end: Date;
} {
  const now = new Date();

  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case 'week':
      return {
        start: startOfWeek(now, { locale: tr }),
        end: endOfWeek(now, { locale: tr }),
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
}
