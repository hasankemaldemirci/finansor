import { useState } from 'react';
import { Container } from '@/shared/components/layout/Container';
import { useAchievements } from '@/features/gamification/hooks/useAchievements';
import { AchievementCard } from '@/features/gamification/components/AchievementCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { AchievementType } from '@/features/gamification/types/achievement.types';
import { ACHIEVEMENT_CATEGORIES } from '@/features/gamification/constants/achievements';

export function AchievementsPage() {
  const {
    achievements,
    unlockedAchievements,
    completionPercentage,
    achievementsByType,
  } = useAchievements();

  const [selectedType, setSelectedType] = useState<AchievementType | 'all'>(
    'all'
  );

  const filteredAchievements =
    selectedType === 'all' ? achievements : achievementsByType[selectedType];

  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Başarılar</h1>
          <p className="text-muted-foreground">
            İşlemler yaparak başarılar kazan ve XP topla!
          </p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle>Genel İlerleme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Açılan Başarılar
                </span>
                <span className="text-lg font-bold">
                  {unlockedAchievements.length} / {achievements.length}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <p className="text-center text-sm font-semibold text-primary">
                %{completionPercentage} Tamamlandı
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-primary text-white'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Tümü ({achievements.length})
          </button>
          {Object.entries(ACHIEVEMENT_CATEGORIES).map(([type, category]) => {
            const count = achievementsByType[type as AchievementType].length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type as AchievementType)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Achievement Grid */}
        <div className="space-y-3">
          {filteredAchievements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Bu kategoride başarı bulunamadı.
              </CardContent>
            </Card>
          ) : (
            filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))
          )}
        </div>
      </div>
    </Container>
  );
}
