import { useState } from 'react';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
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

  const handleMonthlyGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      updateMonthlyGoal(value);
    }
  };

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
            <Select
              value={settings.theme}
              onValueChange={(value) => updateTheme(value as Theme)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Açık</SelectItem>
                <SelectItem value="dark">Koyu</SelectItem>
                <SelectItem value="system">Sistem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>Para Birimi</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) => updateCurrency(value as Currency)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TL">Türk Lirası (₺)</SelectItem>
                <SelectItem value="USD">Amerikan Doları ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monthly Goal */}
          <div className="space-y-2">
            <Label htmlFor="monthlyGoal">Aylık Tasarruf Hedefi</Label>
            <Input
              id="monthlyGoal"
              type="number"
              value={settings.monthlyGoal}
              onChange={handleMonthlyGoalChange}
              min="0"
              step="100"
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
            <DialogDescription>
              Tema, para birimi ve hedef ayarları varsayılan değerlere dönecek.
              İşlemleriniz ve seviyeniz etkilenmeyecek.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleReset}>
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
            <DialogDescription className="space-y-2">
              <p className="font-semibold">Bu işlem geri alınamaz!</p>
              <p>Silinecekler:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Tüm işlemler (gelir & gider)</li>
                <li>Seviye ve XP ilerlemeniz</li>
                <li>Kilidi açılmış başarılar</li>
                <li>Tüm ayarlar</li>
              </ul>
              <p className="text-destructive font-medium mt-3">
                Uygulamaya sıfırdan başlayacaksınız.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetAllDialog(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleResetAll}>
              Evet, Tüm Verileri Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

