
'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { DIDDashboard } from '@/components/DIDDashboard';
import { ProfileEditor } from '@/components/ProfileEditor';
import { DIDLookup } from '@/components/DIDLookup';
import { AgentsTab } from '@/components/AgentsTab';
import { MainContainer } from '@/components/layout/MainContainer';
import { PageTransition } from '@/components/layout/PageTransition';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-indigo-900/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-pink-900/5 to-transparent" />
        
        <div className="relative z-10 p-2 sm:p-4">
          <MainContainer>
            <div className="text-center mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight px-2">
                DID Wallet & AI Agents
              </h1>
              <p className="text-white/70 text-sm sm:text-base lg:text-lg px-4">
                Decentralized Identity & AI Agent Management
              </p>
            </div>

            <Navigation activeTab={activeTab} setActiveTab={handleTabChange} />
            
            <PageTransition>
              {renderTabContent()}
            </PageTransition>
          </MainContainer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
