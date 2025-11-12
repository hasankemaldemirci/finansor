import { cn } from '@/shared/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container mx-auto px-4 py-6 pb-24 max-w-3xl', className)}>
      {children}
    </div>
  );
}

