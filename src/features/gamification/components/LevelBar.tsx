import { Progress } from '@/shared/components/ui/progress';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useLevel } from '../hooks/useLevel';
import { getLevelIcon } from '../constants/levelConfig';

export function LevelBar() {
  const { level, xp, title, nextLevelXP, progressPercentage } = useLevel();

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
      <CardContent className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getLevelIcon(level)}</span>
            <div>
              <h3 className="text-2xl font-bold">Level {level}</h3>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">XP</p>
            <p className="text-lg font-semibold">
              {xp} / {nextLevelXP}
            </p>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {Math.max(0, nextLevelXP - xp)} XP kaldı
        </p>
      </CardContent>
    </Card>
  );
}
