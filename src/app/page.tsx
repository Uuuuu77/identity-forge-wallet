
'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { DIDDashboard } from '@/components/DIDDashboard';
import { ProfileEditor } from '@/components/ProfileEditor';
import { DIDLookup } from '@/components/DIDLookup';
import { AgentsTab } from '@/components/AgentsTab';

export type TabType = 'dashboard' | 'profile' | 'lookup' | 'agents';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DIDDashboard />;
      case 'profile':
        return <ProfileEditor />;
      case 'lookup':
        return <DIDLookup />;
      case 'agents':
        return <AgentsTab />;
      default:
        return <DIDDashboard />;
    }
  };

  return (
    <div className="dark">
      <div className="min-h-screen p-2 sm:p-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              DID Wallet & AI Agents
            </h1>
            <p className="text-white/70 text-base sm:text-lg">
              Decentralized Identity & AI Agent Management
            </p>
          </div>

          <Navigation activeTab={activeTab} setActiveTab={handleTabChange} />
          
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
