import { useState } from 'react';
import { Container } from '@/shared/components/layout/Container';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
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

export function SettingsPage() {
  const [selectedType, setSelectedType] = useState<AchievementType | 'all'>(
    'all'
  );
  const {
    achievements,
    unlockedAchievements,
    completionPercentage,
    achievementsByType,
  } = useAchievements();

  const filteredAchievements =
    selectedType === 'all' ? achievements : achievementsByType[selectedType];

  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Ayarlar</h1>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            <TabsTrigger value="achievements">Başarılar</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6">
            <SettingsPanel />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>İlerleme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kilidi Açılan</span>
                  <span className="font-semibold">
                    {unlockedAchievements.length} / {achievements.length}
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <div className="text-center text-sm text-muted-foreground">
                  %{completionPercentage.toFixed(0)} tamamlandı
                </div>
              </CardContent>
            </Card>

            {/* Filter Tabs */}
            <Tabs
              value={selectedType}
              onValueChange={(value) =>
                setSelectedType(value as AchievementType | 'all')
              }
              className="w-full"
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Tümü ({achievements.length})
                </TabsTrigger>
                {Object.entries(ACHIEVEMENT_CATEGORIES).map(
                  ([type, category]) => {
                    const count =
                      achievementsByType[type as AchievementType]?.length || 0;
                    return (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="data-[state=active]:bg-primary data-[state=active]:text-white"
                      >
                        {category.label} ({count})
                      </TabsTrigger>
                    );
                  }
                )}
              </TabsList>
            </Tabs>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                Bu kategoride başarı bulunamadı.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
