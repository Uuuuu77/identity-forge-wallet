
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateKeypair, createDIDFromPublicKey } from '@/lib/did-utils';
import storage from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export interface DIDProfile {
  name: string;
  bio: string;
  avatar: string;
  website: string;
  twitter: string;
  github: string;
  email?: string;
  avatarUrl?: string;
  timestamp?: number;
}

export interface AgentProfile {
  did: string;
  name: string;
  capabilities: string[];
  ownerDid: string;
  createdAt: number;
}

export interface Handshake {
  id: string;
  senderDid: string;
  receiverDid: string;
  scope: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
}

export interface AgentFormData {
  name: string;
  capabilities: string[];
}

interface DIDContextType {
  did: string | null;
  privateKey: Uint8Array | null;
  publicKey: Uint8Array | null;
  profile: DIDProfile | null;
  agents: AgentProfile[];
  isLoading: boolean;
  generateDID: () => void;
  updateProfile: (profile: Partial<DIDProfile>) => void;
  saveProfile: (profile: Partial<DIDProfile>) => Promise<void>;
  loadProfile: (did: string) => Promise<{ profile: DIDProfile; verified: boolean; cid: string } | null>;
  exportDID: () => string;
  importDID: (didData: string) => boolean;
  registerAgent: (agentData: AgentFormData) => void;
  initiateHandshake: (senderDid: string, receiverDid: string, scope: string) => void;
  acceptHandshake: (handshakeId: string) => void;
  getPendingHandshakes: () => Handshake[];
  getAcceptedHandshakes: () => Handshake[];
}

const DIDContext = createContext<DIDContextType | undefined>(undefined);

export const useDID = () => {
  const context = useContext(DIDContext);
  if (!context) {
    throw new Error('useDID must be used within a DIDProvider');
  }
  return context;
};

// Helper function to generate unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const DIDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [did, setDID] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  const [publicKey, setPublicKey] = useState<Uint8Array | null>(null);
  const [profile, setProfile] = useState<DIDProfile | null>(null);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing DID and profile from storage
    const storedDID = storage.get('did');
    const storedPrivateKey = storage.get('privateKey');
    const storedPublicKey = storage.get('publicKey');
    const storedProfile = storage.get('profile');

    if (storedDID && storedPrivateKey && storedPublicKey) {
      setDID(storedDID);
      setPrivateKey(new Uint8Array(storedPrivateKey));
      setPublicKey(new Uint8Array(storedPublicKey));
    }

    if (storedProfile) {
      setProfile(storedProfile);
    }
  }, []);

  // Load agents when DID changes
  useEffect(() => {
    if (did) {
      const storedAgents = storage.get(`agents-${did}`) || [];
      setAgents(storedAgents);
    }
  }, [did]);

  const generateDID = () => {
    const keypair = generateKeypair();
    const newDID = createDIDFromPublicKey(keypair.publicKey);
    
    setDID(newDID);
    setPrivateKey(keypair.privateKey);
    setPublicKey(keypair.publicKey);
    
    // Store in localStorage
    storage.set('did', newDID);
    storage.set('privateKey', Array.from(keypair.privateKey));
    storage.set('publicKey', Array.from(keypair.publicKey));
    
    // Clear any existing profile when generating new DID
    setProfile(null);
    storage.remove('profile');
    setAgents([]);
  };

  const updateProfile = (newProfile: Partial<DIDProfile>) => {
    const updatedProfile = { 
      ...profile, 
      ...newProfile,
      timestamp: Date.now()
    };
    setProfile(updatedProfile);
    storage.set('profile', updatedProfile);
  };

  const saveProfile = async (newProfile: Partial<DIDProfile>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateProfile(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfile = async (searchDid: string): Promise<{ profile: DIDProfile; verified: boolean; cid: string } | null> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (searchDid === did && profile) {
      return {
        profile: profile,
        verified: true,
        cid: `QmProfile${searchDid.slice(-8)}...`
      };
    }
    
    // Check if it's an agent DID
    if (searchDid.startsWith('did:agent:')) {
      const allAgents = storage.get('all-agents') || [];
      const agent = allAgents.find((a: AgentProfile) => a.did === searchDid);
      if (agent) {
        const agentProfile: DIDProfile = {
          name: agent.name,
          bio: `AI Agent with capabilities: ${agent.capabilities.join(', ')}`,
          avatar: '',
          website: '',
          twitter: '',
          github: '',
          email: `agent@${agent.ownerDid.slice(-8)}.ai`,
          timestamp: agent.createdAt
        };
        return {
          profile: agentProfile,
          verified: true,
          cid: `QmAgent${searchDid.slice(-8)}...`
        };
      }
    }
    
    const profileData = storage.get(`profile-${searchDid}`) || storage.get('profile');
    
    if (profileData) {
      return {
        profile: profileData,
        verified: true,
        cid: `QmProfile${searchDid.slice(-8)}...`
      };
    }
    
    return null;
  };

  const registerAgent = useCallback((agentData: AgentFormData) => {
    if (!did) {
      toast({
        title: "DID Required",
        description: "You need to generate a DID first to register an agent.",
        variant: "destructive",
      });
      return;
    }
    
    const agentDid = `did:agent:${generateId()}`;
    const newAgent: AgentProfile = {
      did: agentDid,
      name: agentData.name,
      capabilities: agentData.capabilities,
      ownerDid: did,
      createdAt: Date.now()
    };
    
    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    storage.set(`agents-${did}`, updatedAgents);
    
    // Also store in global agents for lookup
    const allAgents = storage.get('all-agents') || [];
    storage.set('all-agents', [...allAgents, newAgent]);
    
    toast({
      title: 'Agent Registered',
      description: `${agentData.name} is now active with DID: ${agentDid.slice(0, 20)}...`
    });
  }, [did, agents, toast]);

  const initiateHandshake = useCallback((
    senderDid: string,
    receiverDid: string,
    scope: string
  ) => {
    const handshake: Handshake = {
      id: `hs-${generateId()}`,
      senderDid,
      receiverDid,
      scope,
      status: "pending",
      createdAt: Date.now()
    };
    
    const allHandshakes = storage.get('handshakes') || [];
    storage.set('handshakes', [...allHandshakes, handshake]);
    
    toast({
      title: 'Request Sent',
      description: `Connection request sent to ${receiverDid.slice(0, 12)}...`
    });
  }, [toast]);

  const acceptHandshake = useCallback((handshakeId: string) => {
    const allHandshakes = storage.get('handshakes') || [];
    const updatedHandshakes = allHandshakes.map((h: Handshake) =>
      h.id === handshakeId ? { ...h, status: "accepted" } : h
    );
    storage.set('handshakes', updatedHandshakes);
    
    const handshake = allHandshakes.find((h: Handshake) => h.id === handshakeId);
    if (handshake) {
      toast({
        title: 'Connection Established',
        description: `Now connected to ${handshake.senderDid.slice(0, 12)}...`
      });
    }
  }, [toast]);

  const getPendingHandshakes = useCallback(() => {
    const allHandshakes = storage.get('handshakes') || [];
    return allHandshakes.filter((h: Handshake) => 
      h.receiverDid === did && h.status === "pending"
    );
  }, [did]);

  const getAcceptedHandshakes = useCallback(() => {
    const allHandshakes = storage.get('handshakes') || [];
    return allHandshakes.filter((h: Handshake) => 
      (h.receiverDid === did || h.senderDid === did) && h.status === "accepted"
    );
  }, [did]);

  const exportDID = () => {
    if (!did || !privateKey || !publicKey) {
      throw new Error('No DID to export');
    }
    
    const exportData = {
      did,
      privateKey: Array.from(privateKey),
      publicKey: Array.from(publicKey),
      profile,
      agents,
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const importDID = (didData: string): boolean => {
    try {
      const data = JSON.parse(didData);
      
      if (!data.did || !data.privateKey || !data.publicKey) {
        return false;
      }
      
      setDID(data.did);
      setPrivateKey(new Uint8Array(data.privateKey));
      setPublicKey(new Uint8Array(data.publicKey));
      setProfile(data.profile || {
        name: '',
        bio: '',
        avatar: '',
        website: '',
        twitter: '',
        github: '',
      });
      setAgents(data.agents || []);
      
      // Store in localStorage
      storage.set('did', data.did);
      storage.set('privateKey', data.privateKey);
      storage.set('publicKey', data.publicKey);
      storage.set('profile', data.profile);
      if (data.agents) {
        storage.set(`agents-${data.did}`, data.agents);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import DID:', error);
      return false;
    }
  };

  return (
    <DIDContext.Provider value={{
      did,
      privateKey,
      publicKey,
      profile,
      agents,
      isLoading,
      generateDID,
      updateProfile,
      saveProfile,
      loadProfile,
      exportDID,
      importDID,
      registerAgent,
      initiateHandshake,
      acceptHandshake,
      getPendingHandshakes,
      getAcceptedHandshakes,
    }}>
      {children}
    </DIDContext.Provider>
  );
};
