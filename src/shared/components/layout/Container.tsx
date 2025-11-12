import { cn } from '@/shared/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container mx-auto px-3 py-4 pb-20 sm:px-4 sm:py-6 sm:pb-24 max-w-3xl', className)}>
      {children}
    </div>
  );
}

