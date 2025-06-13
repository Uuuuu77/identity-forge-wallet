
import { useState, useEffect } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { AgentChat } from './AgentChat';
import { ProfileForm } from './profile/ProfileForm';
import { ProfileDisplay } from './profile/ProfileDisplay';
import { AgentsList } from './profile/AgentsList';

export const ProfileEditor = () => {
  const { did, profile, agents, saveProfile, isLoading } = useDID();
  const [isEditing, setIsEditing] = useState(false);
  const [chatAgent, setChatAgent] = useState<any>(null);

  // If no DID is generated, show message to generate DID first
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
            You need to generate a DID first before creating your profile. Please go to the Dashboard tab and generate your DID.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 border border-primary/20 backdrop-blur-sm">
          <p className="text-foreground/70 text-sm">
            💡 Your DID (Decentralized Identifier) is required to create and manage your profile securely.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (formData: any) => {
    await saveProfile(formData);
    setIsEditing(false);
  };

  if (!isEditing && profile) {
    return (
      <div className="space-y-8">
        {/* Chat Modal */}
        {chatAgent && (
          <AgentChat
            agentName={chatAgent.name}
            capabilities={chatAgent.capabilities}
            avatarUrl={chatAgent.avatar}
            onClose={() => setChatAgent(null)}
          />
        )}

        <ProfileDisplay
          profile={profile}
          agents={agents}
          onEdit={() => setIsEditing(true)}
          onChatWithAgent={setChatAgent}
        />

        <AgentsList
          agents={agents}
          onChatWithAgent={setChatAgent}
        />
      </div>
    );
  }

  return (
    <ProfileForm
      profile={profile}
      isLoading={isLoading}
      onSave={handleSaveProfile}
      onCancel={profile ? () => setIsEditing(false) : undefined}
    />
  );
};
