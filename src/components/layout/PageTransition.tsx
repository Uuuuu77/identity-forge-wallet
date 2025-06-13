
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <div className={cn(
      'animate-fade-in',
      className
    )}>
      {children}
    </div>
  );
};
