import { useState, useMemo, useEffect } from 'react';
import { Bell, Target, Lightbulb, Settings, Check } from 'lucide-react';
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
const STORED_TIPS_KEY = 'finansor_stored_tips';

interface StoredTip {
  id: string;
  category: string;
  message: string;
  icon: string;
  timestamp: number;
}

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

function getStoredTips(): StoredTip[] {
  try {
    const stored = localStorage.getItem(STORED_TIPS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }
  return [];
}

function saveStoredTips(tips: StoredTip[]) {
  try {
    localStorage.setItem(STORED_TIPS_KEY, JSON.stringify(tips));
  } catch {
    // Ignore errors
  }
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
  const [storedTips, setStoredTips] = useState<StoredTip[]>(getStoredTips());
  const { transactions, getStats } = useTransactions();
  const { settings } = useSettingsStore();
  const stats = getStats();

  // Monthly goal tracking
  const monthlyGoal = settings.monthlyGoal;
  const currentSavings = stats.monthlySavings;
  const goalProgress = monthlyGoal > 0 ? Math.min(100, (currentSavings / monthlyGoal) * 100) : 0;

  // Only show goal notification if user has transactions (meaningful progress tracking)
  const hasTransactions = transactions.length > 0;
  
  // Check if we're at the end of the month (last 3 days) for goal notification
  // This aligns with achievement logic - goal should be checked at month end
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const isEndOfMonth = dayOfMonth >= daysInMonth - 2;
  
  // Show notification only at end of month (when achievement can be unlocked)
  const shouldShowGoalNotification = monthlyGoal > 0 && hasTransactions && isEndOfMonth;

  // Get current tips and merge with stored tips
  const currentTips = getSavingsTips(transactions);
  
  // Create ID for a tip
  const createTipId = (tip: { category: string; message: string }, timestamp?: number): string => {
    const categoryHash = tip.category.toLowerCase().replace(/\s+/g, '-');
    const messageHash = tip.message.replace(/\s+/g, '-');
    let hash = 0;
    const fullContent = `${categoryHash}-${messageHash}`;
    for (let i = 0; i < fullContent.length; i++) {
      const char = fullContent.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const uniqueSuffix = timestamp || Date.now();
    return `tip-${categoryHash}-${Math.abs(hash)}-${uniqueSuffix}`;
  };

  // Merge current tips with stored tips (add new ones, keep old ones)
  useEffect(() => {
    const now = Date.now();
    const newTips: StoredTip[] = [];
    const existingTipIds = new Set(storedTips.map(t => t.id));
    
    // Add new tips that don't exist in stored tips
    currentTips.forEach(tip => {
      const id = createTipId(tip, now);
      if (!existingTipIds.has(id)) {
        // Check if same message already exists with different ID
        const messageExists = storedTips.some(st => 
          st.category === tip.category && st.message === tip.message
        );
        
        if (!messageExists) {
          newTips.push({
            id,
            category: tip.category,
            message: tip.message,
            icon: tip.icon,
            timestamp: now,
          });
        }
      }
    });
    
    // If there are new tips, update state and localStorage
    if (newTips.length > 0) {
      const combined = [...storedTips, ...newTips];
      saveStoredTips(combined);
      setStoredTips(combined);
    }
  }, [currentTips, storedTips]);

  const allTips = storedTips;

  // Generate notification IDs (reuse 'now' from above)
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const goalNotificationId = shouldShowGoalNotification ? `goal-${currentMonthKey}` : null;
  
  const tipNotificationIds = useMemo(() => {
    return allTips.map(tip => tip.id);
  }, [allTips]);

  // Get all current notification IDs
  const allNotificationIds = useMemo(() => {
    return [
      ...(goalNotificationId ? [goalNotificationId] : []),
      ...tipNotificationIds,
    ];
  }, [goalNotificationId, tipNotificationIds]);

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (allNotificationIds.length > 0) {
      markAllAsRead(allNotificationIds);
      setReadNotifications(prev => new Set([...prev, ...allNotificationIds]));
    }
  };

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
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <div className="sticky top-0 z-10 border-b bg-background">
          <SheetHeader className="relative px-6 pb-4 pt-6">
            <div className="flex items-center justify-center">
              <div className="flex-1" />
              <div className="flex-1 flex flex-col items-center">
                <SheetTitle className="text-center">Bildirimler</SheetTitle>
                <SheetDescription className="text-center text-sm whitespace-nowrap">
                  Tasarruf hedefiniz ve ipuçları
                </SheetDescription>
              </div>
              <div className="flex-1" />
            </div>
          </SheetHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-clip px-4 py-4">
          <ul className="space-y-1">
            {/* Monthly Savings Goal */}
            {shouldShowGoalNotification && (
              <li className="border-b border-border/50 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {goalNotificationId && !readNotifications.has(goalNotificationId) && (
                      <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                    <Target className="h-4 w-4 text-primary/60 flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground/80 truncate">
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
            {allTips.map((tip, index) => {
              const tipId = tip.id;
              const isUnread = tipId && !readNotifications.has(tipId);
              
              return (
              <li 
                key={tipId} 
                className={`${
                  index < allTips.length - 1 ? "border-b border-border/50 pb-3 mb-3" : ""
                  } transition-colors hover:bg-muted/30 rounded-md py-1 cursor-default`}
              >
                  <div className="flex items-start gap-3">
                    <div className="flex items-start gap-2 flex-shrink-0 pt-0.5">
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                      )}
                      <span className="text-sm opacity-70">{tip.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground/80 mb-0.5">
                        {tip.category}
                      </p>
                      <p className="text-xs leading-snug line-clamp-2 text-muted-foreground">
                        {tip.message}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}

            {!shouldShowGoalNotification && allTips.length === 0 && (
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
        
        {/* Mark all as read button at the bottom */}
        {unreadCount > 0 && (
          <div className="sticky bottom-0 z-10 mt-auto border-t border-border bg-background p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" />
              Tümünü okundu işaretle
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

