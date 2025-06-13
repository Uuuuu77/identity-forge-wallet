
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
      primary: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white',
      secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
      ghost: 'hover:bg-white/10 text-white'
    };

    // Map our custom variants to button component variants
    const buttonVariant = variant === 'primary' ? 'default' : variant;

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        className={cn(
          'transform transition-all duration-200 hover:scale-105 active:scale-95 font-semibold',
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
