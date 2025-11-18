import { Achievement } from '../types/achievement.types';
import { AchievementBadge } from './AchievementBadge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { ACHIEVEMENT_CATEGORIES } from '../constants/achievements';
import { formatDate } from '@/shared/utils/date';
import { useTranslation } from 'react-i18next';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { t } = useTranslation();
  const category = ACHIEVEMENT_CATEGORIES[achievement.type];
  const name = t(achievement.name);
  const description = t(achievement.description);
  const categoryLabel = t(category.labelKey);

  return (
    <Card className={achievement.unlocked ? 'border-primary/50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <AchievementBadge achievement={achievement} showProgress />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3
                className={`font-semibold ${
                  achievement.unlocked
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {name}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${category.color} bg-opacity-10`}
              >
                {categoryLabel}
              </span>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              {description}
            </p>
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="space-y-1">
                <Progress value={achievement.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.floor(achievement.progress)}% {t('achievements.completed')}
                </p>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                +{achievement.xpReward} XP
              </span>
              {achievement.unlocked && achievement.unlockedDate && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(achievement.unlockedDate, 'dd MMM yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
