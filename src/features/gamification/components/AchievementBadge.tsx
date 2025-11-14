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
          'flex items-center justify-center rounded-full transition-all',
          sizeClasses[size],
          achievement.unlocked
            ? 'bg-gradient-to-br from-primary to-secondary shadow-lg'
            : 'bg-gray-200 opacity-50 grayscale dark:bg-gray-700'
        )}
      >
        <span className="drop-shadow-md filter">{achievement.icon}</span>
      </div>
      {!achievement.unlocked &&
        showProgress &&
        achievement.progress !== undefined && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform">
            <div className="rounded-full border bg-background px-2 py-0.5 text-xs font-semibold">
              {Math.floor(achievement.progress)}%
            </div>
          </div>
        )}
    </div>
  );
}
