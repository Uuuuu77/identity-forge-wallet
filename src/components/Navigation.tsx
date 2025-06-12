
interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'lookup', label: 'Lookup', icon: '🔍' },
    { id: 'agents', label: 'Agents', icon: '🤖' }
  ];

  return (
    <nav className="glass-card rounded-2xl p-2 mb-8 animate-fade-in">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary/20 text-primary shadow-lg'
                : 'text-foreground/60 hover:text-foreground/80 hover:bg-white/10'
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
