import i18n from '@/shared/lib/i18n';

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export function shareToTwitter(data: ShareData) {
  const url = data.url || window.location.href;
  const text = encodeURIComponent(data.text);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

export function shareToFacebook(data: ShareData) {
  const url = data.url || window.location.href;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=550,height=420');
}

export function shareToWhatsApp(data: ShareData) {
  const url = data.url || window.location.href;
  const text = encodeURIComponent(`${data.text} ${url}`);
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank');
}

export async function shareNative(data: ShareData) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url || window.location.href,
      });
      return true;
    } catch (error) {
      // User cancelled or error occurred
      return false;
    }
  }
  return false;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function generateAchievementShareText(
  achievementName: string,
  level?: number
): string {
  if (level) {
    return i18n.t('share.achievementWithLevel', {
      achievement: achievementName,
      level,
    });
  }
  return i18n.t('share.achievement', { achievement: achievementName });
}

export function generateStatsShareText(
  monthlySavings: number,
  currency: string,
  level: number
): string {
  const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
  const formattedSavings = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(monthlySavings);

  return i18n.t('share.stats', {
    savings: formattedSavings,
    level,
  });
}

