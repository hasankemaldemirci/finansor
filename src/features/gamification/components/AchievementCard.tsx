import { Achievement } from '../types/achievement.types';
import { AchievementBadge } from './AchievementBadge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { ACHIEVEMENT_CATEGORIES } from '../constants/achievements';
import { formatDate } from '@/shared/utils/date';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const category = ACHIEVEMENT_CATEGORIES[achievement.type];

  return (
    <Card className={achievement.unlocked ? 'border-primary/50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <AchievementBadge achievement={achievement} showProgress />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-semibold ${
                  achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {achievement.name}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${category.color} bg-opacity-10`}>
                {category.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="space-y-1">
                <Progress value={achievement.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.floor(achievement.progress)}% tamamlandı
                </p>
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
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

