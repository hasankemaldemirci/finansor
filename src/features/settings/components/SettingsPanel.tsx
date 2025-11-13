import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
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
import { AlertTriangle, MessageSquare } from 'lucide-react';

export function SettingsPanel() {
  const {
    settings,
    updateTheme,
    updateCurrency,
    updateMonthlyGoal,
    resetSettings,
  } = useSettings();

  const { clearAllTransactions } = useTransactionStore();
  const { resetProgress } = useGamificationStore();
  
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showResetAllDialog, setShowResetAllDialog] = useState(false);
  const [monthlyGoalValue, setMonthlyGoalValue] = useState<string>(settings.monthlyGoal.toString());

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
      title: 'Ayarlar sıfırlandı',
      description: 'Tüm ayarlar varsayılan değerlere döndürüldü',
    });
  };

  const handleResetAll = () => {
    // Clear all data
    clearAllTransactions();
    resetProgress();
    resetSettings();
    
    setShowResetAllDialog(false);
    
    toast({
      title: '🎯 Tüm veriler sıfırlandı',
      description: 'İşlemler, seviye ve ayarlar temizlendi. Yeni bir başlangıç!',
    });
    
    // Reload page to ensure fresh state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent('Finansör - Geri Bildirim');
    const body = encodeURIComponent('Merhaba,\n\n[Mesajınızı buraya yazabilirsiniz]\n\n');
    const mailtoLink = `mailto:hasankemal.demirci@gmail.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme */}
          <div className="space-y-2">
            <Label>Tema</Label>
            <Tabs
              value={settings.theme}
              onValueChange={(value) => updateTheme(value as Theme)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="light">☀️ Açık</TabsTrigger>
                <TabsTrigger value="dark">🌙 Koyu</TabsTrigger>
                <TabsTrigger value="system">💻 Sistem</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>Para Birimi</Label>
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
          <div className="space-y-2">
            <Label htmlFor="monthlyGoal">Aylık Tasarruf Hedefi</Label>
            <CurrencyInput
              id="monthlyGoal"
              placeholder={`0${config.decimalSeparator}00 ${config.prefix}`}
              value={monthlyGoalValue}
              decimalsLimit={2}
              suffix={' ' + config.prefix}
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feedback Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Geri Bildirim
          </CardTitle>
          <CardDescription>
            Görüş, öneri veya hata bildirimi için bize ulaşın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSendFeedback}
            variant="outline"
            className="w-full"
          >
            📧 Geri Bildirim Gönder
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Tehlikeli Bölge
          </CardTitle>
          <CardDescription>
            Bu işlemler geri alınamaz. Dikkatli olun!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Sadece tema, para birimi gibi ayarları sıfırla
            </p>
            <Button 
              variant="outline" 
              onClick={() => setShowResetDialog(true)} 
              className="w-full"
            >
              Ayarları Sıfırla
            </Button>
          </div>

          <div className="border-t pt-3 space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              ⚠️ Tüm verileri temizle (işlemler, seviye, başarılar)
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setShowResetAllDialog(true)} 
              className="w-full"
            >
              Tüm Verileri Sıfırla
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Settings Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ayarları Sıfırla?</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aşağıdaki ayarlar varsayılan değerlere dönecek:
            </p>
            
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Tema tercihi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Para birimi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Aylık tasarruf hedefi</span>
              </li>
            </ul>
            
            <div className="rounded-lg bg-primary/15 border border-primary/30 p-3">
              <p className="text-sm text-primary font-medium text-center">
                ✓ İşlemleriniz ve seviyeniz korunacak
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)} className="sm:flex-1">
              İptal
            </Button>
            <Button variant="destructive" onClick={handleReset} className="sm:flex-1">
              Sıfırla
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
              Tüm Verileri Sil?
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-sm font-semibold text-destructive">
            Bu işlem geri alınamaz!
          </p>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Silinecekler:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Tüm işlemler (gelir & gider)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Seviye ve XP ilerlemeniz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Kilidi açılmış başarılar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Tüm ayarlar</span>
                </li>
              </ul>
            </div>
            
            <div className="rounded-lg bg-destructive/15 border border-destructive/30 p-3">
              <p className="text-sm font-medium text-destructive text-center">
                ⚠️ Uygulamaya sıfırdan başlayacaksınız
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetAllDialog(false)} className="sm:flex-1">
              İptal
            </Button>
            <Button variant="destructive" onClick={handleResetAll} className="sm:flex-1">
              Evet, Tüm Verileri Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

