
import { useIsMobile } from '@/hooks/use-responsive';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const isMobile = useIsMobile();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'lookup', label: 'Lookup', icon: '🔍' },
    { id: 'agents', label: 'Agents', icon: '🤖' }
  ];

  if (isMobile) {
    // Mobile bottom navigation
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]',
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-foreground/60 hover:text-foreground/80 hover:bg-white/5'
              )}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop horizontal navigation
  return (
    <nav className="mb-6 sm:mb-8 animate-fade-in">
      <GlassCard className="p-1 sm:p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105',
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary shadow-lg'
                  : 'text-foreground/60 hover:text-foreground/80 hover:bg-white/10'
              )}
            >
              <span className="text-base sm:text-lg">{tab.icon}</span>
              <span className="hidden sm:inline text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>
    </nav>
  );
};
