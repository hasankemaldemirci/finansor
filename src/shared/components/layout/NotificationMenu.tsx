import { useState, useEffect, useMemo } from 'react';
import { Bell, Target, Lightbulb, Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { useSettingsStore } from '@/features/settings/stores/settingsStore';
import { formatCurrency } from '@/shared/utils/currency';
import { getSavingsTips } from '@/features/transactions/utils/savingsTips';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

const READ_NOTIFICATIONS_KEY = 'finansor_read_notifications';

function getReadNotifications(): Set<string> {
  try {
    const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore errors
  }
  return new Set();
}

function markAllAsRead(notificationIds: string[]) {
  try {
    const read = getReadNotifications();
    notificationIds.forEach(id => read.add(id));
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(Array.from(read)));
  } catch {
    // Ignore errors
  }
}

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(getReadNotifications());
  const { transactions, getStats } = useTransactions();
  const { settings } = useSettingsStore();
  const stats = getStats();

  // Monthly goal tracking
  const monthlyGoal = settings.monthlyGoal;
  const currentSavings = stats.monthlySavings;
  const goalProgress = monthlyGoal > 0 ? Math.min(100, (currentSavings / monthlyGoal) * 100) : 0;

  // Savings tips
  const savingsTips = getSavingsTips(transactions);

  // Generate notification IDs
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const goalNotificationId = monthlyGoal > 0 ? `goal-${currentMonthKey}` : null;
  
  const tipNotificationIds = useMemo(() => {
    return savingsTips.map((tip, index) => {
      // Create unique ID based on category and message content
      const messageHash = tip.message.substring(0, 50).replace(/\s+/g, '-');
      return `tip-${tip.category}-${messageHash}-${index}`;
    });
  }, [savingsTips]);

  // Mark as read when menu opens
  useEffect(() => {
    if (open) {
      const allNotificationIds = [
        ...(goalNotificationId ? [goalNotificationId] : []),
        ...tipNotificationIds,
      ];
      
      if (allNotificationIds.length > 0) {
        markAllAsRead(allNotificationIds);
        setReadNotifications(prev => new Set([...prev, ...allNotificationIds]));
      }
    }
  }, [open, goalNotificationId, tipNotificationIds]);

  // Count unread notifications
  const unreadCount = useMemo(() => {
    let count = 0;
    if (goalNotificationId && !readNotifications.has(goalNotificationId)) {
      count++;
    }
    tipNotificationIds.forEach(id => {
      if (!readNotifications.has(id)) {
        count++;
      }
    });
    return count;
  }, [goalNotificationId, tipNotificationIds, readNotifications]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Bildirimler</SheetTitle>
          <SheetDescription>
            Tasarruf hedefiniz ve ipuçları
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <ul className="space-y-1">
            {/* Monthly Savings Goal */}
            {monthlyGoal > 0 && (
              <li className="border-b border-border/50 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground truncate">
                        Aylık Hedef: {formatCurrency(currentSavings, settings.currency)} / {formatCurrency(monthlyGoal, settings.currency)}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">
                        {goalProgress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary/20">
                      <div 
                        className={`h-full transition-all ${
                          goalProgress >= 100 ? 'bg-secondary' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, goalProgress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            )}

            {/* Savings Tips */}
            {savingsTips.map((tip, index) => (
              <li 
                key={index} 
                className={`${
                  index < savingsTips.length - 1 ? "border-b border-border/50 pb-3 mb-3" : ""
                } transition-colors hover:bg-muted/30 rounded-md px-2 -mx-2 py-1 cursor-default`}
              >
                  <div className="flex items-start gap-3">
                    <span className="text-sm flex-shrink-0">{tip.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground mb-0.5">
                        {tip.category}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                        {tip.message}
                      </p>
                    </div>
                  </div>
                </li>
            ))}

            {monthlyGoal === 0 && savingsTips.length === 0 && (
              <li>
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-medium mb-2">Henüz bildirim yok</p>
                  <p className="text-xs mb-4">Aylık hedef belirleyin veya işlem ekleyin</p>
                  <Button 
                    asChild 
                    size="sm" 
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    <Link to={ROUTES.SETTINGS} className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Ayarlara Git
                    </Link>
                  </Button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}

