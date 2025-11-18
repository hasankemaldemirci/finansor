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

export function OnboardingModal() {
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
      title: 'Finansör\'e Hoş Geldiniz! 🎉',
      description: 'Tasarrufun eğlenceli hali ile tanışın',
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Finansör, finansal yönetiminizi oyunlaştırarak eğlenceli hale getirir.
            Gelir-gider takibi yapın, XP kazanın, seviye atlayın ve başarılar açın!
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">Özellikler:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 💰 Hızlı gelir-gider takibi</li>
              <li>• 📊 Detaylı istatistikler ve grafikler</li>
              <li>• 🎮 100 seviye ve 25+ başarı</li>
              <li>• 📱 PWA desteği (offline çalışır)</li>
              <li>• 🔒 Verileriniz cihazınızda güvende</li>
            </ul>
          </div>
        </div>
      ),
      nextLabel: 'Başlayalım',
    },
    'add-transaction': {
      title: 'İşlem Ekleme',
      description: 'Gelir ve giderlerinizi kolayca takip edin',
      icon: <Wallet className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Ana sayfadaki formdan gelir veya gider ekleyebilirsiniz. Her işlem
            için XP kazanırsınız ve seviye atlayabilirsiniz!
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">İpuçları:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Gelir eklemek daha fazla XP kazandırır</li>
              <li>• Kategorileri kullanarak harcamalarınızı organize edin</li>
              <li>• Düzenli işlem eklemek başarılar açmanıza yardımcı olur</li>
            </ul>
          </div>
        </div>
      ),
      nextLabel: 'Devam Et',
    },
    'view-stats': {
      title: 'İstatistikler',
      description: 'Finansal durumunuzu analiz edin',
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            İstatistikler sayfasında aylık trendler, kategori analizleri ve
            tasarruf oranınızı görebilirsiniz.
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">Grafikler:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Aylık gelir-gider trendi</li>
              <li>• Kategori bazlı pasta grafikleri</li>
              <li>• Tasarruf oranı analizi</li>
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
            İstatistikleri Görüntüle
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      nextLabel: 'Devam Et',
    },
    achievements: {
      title: 'Başarılar ve Seviyeler',
      description: 'Oyunlaştırma ile motivasyonunuzu artırın',
      icon: <Trophy className="h-12 w-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Her işlem için XP kazanın, seviye atlayın ve 25+ farklı başarıyı
            açın. Başarılarınızı sosyal medyada paylaşabilirsiniz!
          </p>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">Sistem:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 100 seviye sistemi</li>
              <li>• Seviye bazlı başlıklar</li>
              <li>• 25+ farklı başarı</li>
              <li>• Başarılarınızı paylaşın</li>
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
            Başarıları Görüntüle
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      nextLabel: 'Tamamla',
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
            Atla
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

