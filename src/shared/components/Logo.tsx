import { HandCoins } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = false, className }: LogoProps) {
  const iconSize = size * 0.6; // HandCoins ikonu ana boyutun %60'ı

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg',
        'shadow-lg',
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background:
          'linear-gradient(135deg, hsl(162, 100%, 42%) 0%, hsl(162, 100%, 38%) 50%, hsl(250, 65%, 63%) 100%)',
      }}
    >
      {/* HandCoins ikonu - ortada */}
      <div
        className="absolute left-1/2 z-10 -translate-x-1/2"
        style={{
          top: `${(size - iconSize) / 2}px`,
        }}
      >
        <HandCoins
          className="text-white"
          size={iconSize}
          strokeWidth={2.5}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          }}
        />
      </div>

      {/* Metin - altında (opsiyonel) */}
      {showText && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <span className="whitespace-nowrap text-xs font-bold text-white">
            Finansör
          </span>
        </div>
      )}
    </div>
  );
}
