
import { TabType } from '@/pages/Index';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: '🏠' },
    { id: 'profile' as TabType, label: 'Profile', icon: '👤' },
    { id: 'lookup' as TabType, label: 'Lookup', icon: '🔍' }
  ];

  return (
    <nav className="glass rounded-2xl p-2 mb-8 animate-scale-in">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
