
import { useState } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { AgentRegistry } from './AgentRegistry';
import { AgentHandshake } from './AgentHandshake';

export const AgentsTab = () => {
  const { did, agents } = useDID();
  const [activeSection, setActiveSection] = useState<'overview' | 'register' | 'connections'>('overview');

  if (!did) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center animate-fade-in shadow-2xl border border-white/20">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl shadow-lg">
            ⚠️
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-6">
            DID Required
          </h2>
          <p className="text-foreground/80 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
            You need to generate a DID first before managing AI agents. Please go to the Dashboard tab and generate your DID.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 border border-primary/20 backdrop-blur-sm">
          <p className="text-foreground/70 text-sm">
            💡 Your DID (Decentralized Identifier) is required to create and manage AI agents securely.
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'register':
        return <AgentRegistry />;
      case 'connections':
        return <AgentHandshake />;
      default:
        return (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">My Agents</h3>
                <p className="text-3xl font-bold text-purple-300">{agents.length}</p>
                <p className="text-foreground/60 text-sm mt-2">Registered Agents</p>
              </div>
              
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                  🤝
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Active Connections</h3>
                <p className="text-3xl font-bold text-blue-300">0</p>
                <p className="text-foreground/60 text-sm mt-2">Agent Handshakes</p>
              </div>
              
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Capabilities</h3>
                <p className="text-3xl font-bold text-green-300">
                  {agents.reduce((acc, agent) => acc + agent.capabilities.length, 0)}
                </p>
                <p className="text-foreground/60 text-sm mt-2">Total Skills</p>
              </div>
            </div>

            {/* My Agents List */}
            {agents.length > 0 && (
              <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  My AI Agents
                </h3>
                
                <div className="grid gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.did}
                      className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              🤖
                            </div>
                            <h4 className="text-xl font-semibold text-foreground">{agent.name}</h4>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-foreground/60 font-mono break-all">
                              <strong>DID:</strong> {agent.did}
                            </p>
                            <p className="text-sm text-foreground/60">
                              <strong>Created:</strong> {new Date(agent.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {agent.capabilities.map((capability) => (
                            <span
                              key={capability}
                              className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-3 py-1 rounded-full text-sm font-medium border border-purple-400/30"
                            >
                              {capability}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setActiveSection('register')}
                className="glass-card rounded-2xl p-8 text-left hover:scale-105 transition-all duration-200 border border-white/20 hover:border-purple-400/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    ➕
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Register New Agent</h3>
                </div>
                <p className="text-foreground/70">
                  Create a new AI agent with specific capabilities and get a unique DID identifier.
                </p>
              </button>
              
              <button
                onClick={() => setActiveSection('connections')}
                className="glass-card rounded-2xl p-8 text-left hover:scale-105 transition-all duration-200 border border-white/20 hover:border-blue-400/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                    🤝
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Manage Connections</h3>
                </div>
                <p className="text-foreground/70">
                  Initiate handshakes with other agents and manage your connection requests.
                </p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="glass-card rounded-2xl p-2 animate-fade-in">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'register', label: 'Register', icon: '➕' },
            { id: 'connections', label: 'Connections', icon: '🤝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                activeSection === tab.id
                  ? 'bg-primary/20 text-primary shadow-lg'
                  : 'text-foreground/60 hover:text-foreground/80 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </div>
  );
};
