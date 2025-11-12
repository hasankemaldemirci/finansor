import { Achievement } from '../types/achievement.types';
import { cn } from '@/shared/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = false,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'rounded-full flex items-center justify-center transition-all',
          sizeClasses[size],
          achievement.unlocked
            ? 'bg-gradient-to-br from-primary to-secondary shadow-lg'
            : 'bg-gray-200 dark:bg-gray-700 grayscale opacity-50'
        )}
      >
        <span className="filter drop-shadow-md">{achievement.icon}</span>
      </div>
      {!achievement.unlocked && showProgress && achievement.progress !== undefined && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-background border rounded-full px-2 py-0.5 text-xs font-semibold">
            {Math.floor(achievement.progress)}%
          </div>
        </div>
      )}
    </div>
  );
}

