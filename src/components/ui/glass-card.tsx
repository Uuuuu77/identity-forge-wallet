
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'glow';
  children: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.18)]',
      interactive: 'backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_40px_rgba(94,44,237,0.25)] transition-all duration-300 hover:bg-white/8',
      glow: 'relative group backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.18)]'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-4 sm:p-6',
          variants[variant],
          className
        )}
        {...props}
      >
        {variant === 'glow' && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-purple-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10" />
        )}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
