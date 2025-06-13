
import { cn } from '@/lib/utils';

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContainer = ({ children, className }: MainContainerProps) => {
  return (
    <div className={cn(
      'w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6',
      className
    )}>
      {children}
    </div>
  );
};
