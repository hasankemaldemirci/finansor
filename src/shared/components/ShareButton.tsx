import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Share2,
  Twitter,
  Facebook,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  shareToTwitter,
  shareToFacebook,
  shareToWhatsApp,
  shareNative,
  copyToClipboard,
} from '@/shared/utils/socialShare';
import { useToast } from '@/shared/hooks/useToast';
import { useTranslation } from 'react-i18next';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButton({
  title,
  text,
  url,
  variant = 'outline',
  size = 'default',
}: ShareButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleNativeShare = async () => {
    const shared = await shareNative({ title, text, url });
    if (!shared) {
      // Fallback to dropdown if native share not available
      return;
    }
  };

  const handleCopy = async () => {
    const shareText = `${text} ${url || window.location.href}`;
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      toast({
        title: t('share.copied'),
        description: t('share.copiedDescription'),
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    shareToTwitter({ title, text, url });
  };

  const handleFacebook = () => {
    shareToFacebook({ title, text, url });
  };

  const handleWhatsApp = () => {
    shareToWhatsApp({ title, text, url });
  };

  // Check if native sharing is available
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

  if (hasNativeShare) {
    return (
      <Button onClick={handleNativeShare} variant={variant} size={size}>
        <Share2 className="mr-2 h-4 w-4" />
        {t('share.share')}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="mr-2 h-4 w-4" />
          {t('share.share')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          {t('share.twitter')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebook}>
          <Facebook className="mr-2 h-4 w-4" />
          {t('share.facebook')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp}>
          <MessageCircle className="mr-2 h-4 w-4" />
          {t('share.whatsapp')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              {t('share.copied')}
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              {t('share.copyLink')}
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

