
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface AnimatedButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg',
      secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold',
      ghost: 'hover:bg-white/10 text-white font-semibold'
    };

    // Map our custom variants to button component variants
    const buttonVariant = variant === 'primary' ? 'default' : variant;

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        className={cn(
          'transform transition-all duration-200 hover:scale-105 active:scale-95',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
