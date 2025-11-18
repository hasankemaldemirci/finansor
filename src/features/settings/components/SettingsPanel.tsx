import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useSettings } from '../hooks/useSettings';
import { useTransactionStore } from '@/features/transactions/stores/transactionStore';
import { useGamificationStore } from '@/features/gamification/stores/gamificationStore';
import { Currency, Theme } from '@/shared/types/common.types';
import { toast } from '@/shared/hooks/useToast';
import { AlertTriangle, MessageSquare, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SettingsPanel() {
  const {
    settings,
    updateTheme,
    updateCurrency,
    updateMonthlyGoal,
    updateLanguage,
    resetSettings,
  } = useSettings();
  const { t } = useTranslation();

  const { clearAllTransactions } = useTransactionStore();
  const { resetProgress } = useGamificationStore();

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showResetAllDialog, setShowResetAllDialog] = useState(false);
  const [monthlyGoalValue, setMonthlyGoalValue] = useState<string>(
    settings.monthlyGoal.toString()
  );

  // Currency configuration based on settings
  const currencyConfig = {
    TRY: { prefix: '₺', decimalSeparator: ',', groupSeparator: '.' },
    USD: { prefix: '$', decimalSeparator: '.', groupSeparator: ',' },
    EUR: { prefix: '€', decimalSeparator: ',', groupSeparator: '.' },
  };

  const config = currencyConfig[settings.currency] || currencyConfig.TRY;

  const handleReset = () => {
    resetSettings();
    setShowResetDialog(false);
    toast({
      title: t('settings.resetSuccess'),
      description: t('settings.resetSuccessDesc'),
    });
  };

  const handleResetAll = () => {
    // Clear all data
    clearAllTransactions();
    resetProgress();
    resetSettings();

    setShowResetAllDialog(false);

    toast({
      title: t('settings.resetAllSuccess'),
      description: t('settings.resetAllSuccessDesc'),
    });

    // Reload page to ensure fresh state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent(t('settings.feedbackSubject'));
    const body = encodeURIComponent(t('settings.feedbackBody'));
    const mailtoLink = `mailto:hasankemal.demirci@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.general')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme */}
          <div className="space-y-2">
            <Label>{t('settings.theme')}</Label>
            <Tabs
              value={settings.theme}
              onValueChange={(value) => updateTheme(value as Theme)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="light">{t('settings.themeLight')}</TabsTrigger>
                <TabsTrigger value="dark">{t('settings.themeDark')}</TabsTrigger>
                <TabsTrigger value="system">{t('settings.themeSystem')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label>{t('settings.language')}</Label>
            <Tabs
              value={settings.language}
              onValueChange={(value) => updateLanguage(value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tr">{t('settings.languageTurkish')}</TabsTrigger>
                <TabsTrigger value="en">{t('settings.languageEnglish')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>{t('settings.currency')}</Label>
            <Tabs
              value={settings.currency}
              onValueChange={(value) => updateCurrency(value as Currency)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="TRY">₺ TRY</TabsTrigger>
                <TabsTrigger value="USD">$ USD</TabsTrigger>
                <TabsTrigger value="EUR">€ EUR</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Monthly Goal */}
          <div className="space-y-3">
            <Label htmlFor="monthlyGoal" className="text-base">
              {t('settings.monthlyGoal')}
            </Label>
            <CurrencyInput
              id="monthlyGoal"
              placeholder={`0${config.decimalSeparator}00 ${config.prefix.trim()}`}
              value={monthlyGoalValue}
              decimalsLimit={2}
              suffix={' ' + config.prefix.trim()}
              decimalSeparator={config.decimalSeparator}
              groupSeparator={config.groupSeparator}
              autoComplete="off"
              onValueChange={(value) => {
                setMonthlyGoalValue(value || '');
                const numValue = value ? parseFloat(value) : 0;
                if (!isNaN(numValue) && numValue >= 0) {
                  updateMonthlyGoal(numValue);
                }
              }}
              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-4xl font-bold text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Support Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            {t('settings.support')}
          </CardTitle>
          <CardDescription>
            {t('settings.supportDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() =>
              window.open(
                'https://www.buymeacoffee.com/hasankemaldemirci',
                '_blank'
              )
            }
            className="w-full bg-[#FFDD00] font-semibold text-[#000000] hover:bg-[#FFDD00]/90"
          >
            {t('settings.supportButton')}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {t('settings.supportText')}
          </p>
        </CardContent>
      </Card>

      {/* Feedback Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t('settings.feedback')}
          </CardTitle>
          <CardDescription>
            {t('settings.feedbackDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSendFeedback}
            variant="outline"
            className="w-full"
          >
            {t('settings.feedbackButton')}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t('settings.dangerZone')}
          </CardTitle>
          <CardDescription>
            {t('settings.dangerZoneDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('settings.resetSettingsDesc')}
            </p>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(true)}
              className="w-full"
            >
              {t('settings.resetSettings')}
            </Button>
          </div>

          <div className="space-y-2 border-t pt-3">
            <p className="text-sm font-medium text-muted-foreground">
              {t('settings.resetAllDesc')}
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowResetAllDialog(true)}
              className="w-full"
            >
              {t('settings.resetAll')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Settings Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.resetSettingsTitle')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('settings.resetSettingsConfirm')}
            </p>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">•</span>
                <span>{t('settings.resetSettingsItems.theme')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">•</span>
                <span>{t('settings.resetSettingsItems.currency')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">•</span>
                <span>{t('settings.resetSettingsItems.monthlyGoal')}</span>
              </li>
            </ul>

            <div className="rounded-lg border border-primary/30 bg-primary/15 p-3">
              <p className="text-center text-sm font-medium text-primary">
                {t('settings.resetSettingsNote')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
              className="sm:flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              className="sm:flex-1"
            >
              {t('settings.resetSettings')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset All Data Dialog */}
      <Dialog open={showResetAllDialog} onOpenChange={setShowResetAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t('settings.resetAllTitle')}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm font-semibold text-destructive">
            {t('settings.resetAllWarning')}
          </p>

          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                {t('settings.resetAllTitle')}:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-destructive">•</span>
                  <span>{t('settings.resetAllItems.transactions')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-destructive">•</span>
                  <span>{t('settings.resetAllItems.progress')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-destructive">•</span>
                  <span>{t('settings.resetAllItems.achievements')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-destructive">•</span>
                  <span>{t('settings.resetAllItems.settings')}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
              <p className="text-center text-sm font-medium text-destructive">
                {t('settings.resetAllNote')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetAllDialog(false)}
              className="sm:flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetAll}
              className="sm:flex-1"
            >
              {t('common.yes')}, {t('settings.resetAll')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
