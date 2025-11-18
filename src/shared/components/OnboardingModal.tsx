import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useOnboarding, OnboardingStep } from '@/shared/hooks/useOnboarding';
import { Wallet, TrendingUp, Trophy, Sparkles, ArrowRight, X } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { useTranslation } from 'react-i18next';

export function OnboardingModal() {
  const { t } = useTranslation();
  const { isCompleted, currentStep, setStep, completeOnboarding } =
    useOnboarding();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isCompleted && currentStep !== 'completed') {
      setOpen(true);
    }
  }, [isCompleted, currentStep]);

  const handleSkip = () => {
    completeOnboarding();
    setOpen(false);
  };

  const steps: Record<
    Exclude<OnboardingStep, 'completed'>,
    {
      title: string;
      description: string;
      icon: React.ReactNode;
      content: React.ReactNode;
      nextLabel: string;
    }
  > = {
    welcome: {
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {t('onboarding.welcome.content')}
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">{t('onboarding.welcome.features')}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {t('onboarding.welcome.feature1')}</li>
              <li>• {t('onboarding.welcome.feature2')}</li>
              <li>• {t('onboarding.welcome.feature3')}</li>
              <li>• {t('onboarding.welcome.feature4')}</li>
              <li>• {t('onboarding.welcome.feature5')}</li>
            </ul>
          </div>
        </div>
      ),
      nextLabel: t('onboarding.welcome.next'),
    },
    'add-transaction': {
      title: t('onboarding.addTransaction.title'),
      description: t('onboarding.addTransaction.description'),
      icon: <Wallet className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {t('onboarding.addTransaction.content')}
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">{t('onboarding.addTransaction.tips')}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {t('onboarding.addTransaction.tip1')}</li>
              <li>• {t('onboarding.addTransaction.tip2')}</li>
              <li>• {t('onboarding.addTransaction.tip3')}</li>
            </ul>
          </div>
        </div>
      ),
      nextLabel: t('onboarding.addTransaction.next'),
    },
    'view-stats': {
      title: t('onboarding.viewStats.title'),
      description: t('onboarding.viewStats.description'),
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {t('onboarding.viewStats.content')}
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">{t('onboarding.viewStats.charts')}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {t('onboarding.viewStats.chart1')}</li>
              <li>• {t('onboarding.viewStats.chart2')}</li>
              <li>• {t('onboarding.viewStats.chart3')}</li>
            </ul>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              handleSkip();
              window.location.href = ROUTES.STATISTICS;
            }}
          >
            {t('onboarding.viewStats.viewButton')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      nextLabel: t('onboarding.viewStats.next'),
    },
    achievements: {
      title: t('onboarding.achievements.title'),
      description: t('onboarding.achievements.description'),
      icon: <Trophy className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {t('onboarding.achievements.content')}
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">{t('onboarding.achievements.system')}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {t('onboarding.achievements.system1')}</li>
              <li>• {t('onboarding.achievements.system2')}</li>
              <li>• {t('onboarding.achievements.system3')}</li>
              <li>• {t('onboarding.achievements.system4')}</li>
            </ul>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              handleSkip();
              window.location.href = ROUTES.ACHIEVEMENTS;
            }}
          >
            {t('onboarding.achievements.viewButton')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      nextLabel: t('onboarding.achievements.next'),
    },
  };

  if (isCompleted || currentStep === 'completed') {
    return null;
  }

  const stepData = steps[currentStep];
  if (!stepData) return null;

  const handleNext = () => {
    const stepOrder: OnboardingStep[] = [
      'welcome',
      'add-transaction',
      'view-stats',
      'achievements',
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    } else {
      completeOnboarding();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {stepData.icon}
          </div>
          <DialogTitle className="text-center text-2xl">
            {stepData.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {stepData.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">{stepData.content}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            {t('onboarding.skip')}
          </Button>
          <Button onClick={handleNext} className="flex-1">
            {stepData.nextLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center gap-1">
          {Object.keys(steps).map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all ${
                Object.keys(steps).indexOf(currentStep) >= Object.keys(steps).indexOf(step)
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

