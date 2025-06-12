import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import storage from '@/lib/storage';
import { generateKeypair, createDIDFromPublicKey, formatDID } from '@/lib/did-utils';
import { useToast } from '@/hooks/use-toast';

interface DIDContextType {
  did: string | null;
  profile: Profile | null;
  agents: AgentProfile[];
  isLoading: boolean;
  generateDID: () => Promise<void>;
  saveProfile: (profileData: ProfileFormData) => Promise<void>;
  registerAgent: (agentData: AgentFormData) => void;
  loadProfile: (did: string) => Promise<{ profile: any; verified: boolean; cid: string } | null>;
  initiateHandshake: (senderDid: string, receiverDid: string, scope: string) => void;
  acceptHandshake: (handshakeId: string) => void;
  getPendingHandshakes: () => Handshake[];
  getAcceptedHandshakes: () => Handshake[];
}

interface Profile {
  name: string;
  bio: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  timestamp?: number;
}

interface ProfileFormData {
  name: string;
  bio: string;
  email: string;
  avatarUrl: string;
}

interface AgentFormData {
  name: string;
  description?: string;
  capabilities: string[];
}

interface AgentProfile {
  did: string;
  name: string;
  description?: string;
  capabilities: string[];
  ownerDid: string;
  createdAt: number;
}

export interface Handshake {
  id: string;
  senderDid: string;
  receiverDid: string;
  scope: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

const DIDContext = createContext<DIDContextType | undefined>(undefined);

const useDID = () => {
  const context = useContext(DIDContext);
  if (!context) {
    throw new Error("useDID must be used within a DIDProvider");
  }
  return context;
};

const DIDProvider = ({ children }: { children: React.ReactNode }) => {
  const [did, setDid] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedDID = storage.get('did');
    if (storedDID) {
      setDid(storedDID);
    }

    const storedProfile = storage.get('profile');
    if (storedProfile) {
      setProfile(storedProfile);
    }

    // Load agents from storage using the new storage method
    const agentEntries = storage.getByPrefix('agent-');
    const storedAgents = agentEntries.map(entry => entry.value).filter(Boolean) as AgentProfile[];
    setAgents(storedAgents);
  }, []);

  const generateDID = useCallback(async () => {
    setIsLoading(true);
    try {
      const { publicKey } = generateKeypair();
      const newDID = createDIDFromPublicKey(publicKey);

      setDid(newDID);
      storage.set('did', newDID);

      toast({
        title: "DID Generated",
        description: `Your DID has been generated: ${formatDID(newDID)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate DID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveProfile = useCallback(async (profileData: ProfileFormData) => {
    setIsLoading(true);
    try {
      const newProfile = {
        ...profileData,
        timestamp: Date.now()
      };
      setProfile(newProfile);
      storage.set('profile', newProfile);

      toast({
        title: "Profile Saved",
        description: "Your profile has been saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadProfile = useCallback(async (searchDid: string) => {
    try {
      // Check if it's the current user's DID
      if (searchDid === did && profile) {
        return {
          profile,
          verified: true,
          cid: `cid-${Date.now()}`
        };
      }

      // Check if it's an agent DID
      if (searchDid.startsWith('did:agent:')) {
        const agentKey = `agent-${searchDid}`;
        const agentData = storage.get(agentKey);
        if (agentData) {
          return {
            profile: {
              name: agentData.name,
              bio: agentData.description || 'AI Agent',
              email: 'agent@example.com',
              timestamp: agentData.createdAt
            },
            verified: true,
            cid: `cid-agent-${Date.now()}`
          };
        }
      }

      // For other DIDs, return null (not found)
      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }, [did, profile]);

  const registerAgent = useCallback((agentData: AgentFormData) => {
    if (!did) return;
    
    const agentDid = `did:agent:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAgent: AgentProfile = {
      did: agentDid,
      name: agentData.name,
      description: agentData.description,
      capabilities: agentData.capabilities,
      ownerDid: did,
      createdAt: Date.now()
    };
    
    // Save to storage
    const agentKey = `agent-${agentDid}`;
    storage.set(agentKey, newAgent);
    
    setAgents(prev => [...prev, newAgent]);
    
    toast({
      title: "Agent Registered",
      description: `${agentData.name} has been successfully registered with DID: ${agentDid.slice(0, 20)}...`,
    });
  }, [did, toast]);

  const initiateHandshake = useCallback((senderDid: string, receiverDid: string, scope: string) => {
    const handshakeId = `hs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const handshake: Handshake = {
      id: handshakeId,
      senderDid,
      receiverDid,
      scope,
      status: 'pending',
      createdAt: Date.now()
    };
    
    storage.set(`handshake-${handshakeId}`, handshake);
    
    toast({
      title: "Handshake Initiated",
      description: `Connection request sent to ${receiverDid.slice(0, 20)}...`,
    });
  }, [toast]);

  const acceptHandshake = useCallback((handshakeId: string) => {
    const handshake = storage.get(`handshake-${handshakeId}`) as Handshake;
    if (handshake) {
      const updatedHandshake = { ...handshake, status: 'accepted' as const };
      storage.set(`handshake-${handshakeId}`, updatedHandshake);
      
      toast({
        title: "Handshake Accepted",
        description: `Connection established with ${handshake.senderDid.slice(0, 20)}...`,
      });
    }
  }, [toast]);

  const getPendingHandshakes = useCallback(() => {
    if (!did) return [];
    
    const handshakeEntries = storage.getByPrefix('handshake-');
    const handshakes = handshakeEntries.map(entry => entry.value).filter(Boolean) as Handshake[];
    
    return handshakes.filter(h => h.receiverDid === did && h.status === 'pending');
  }, [did]);

  const getAcceptedHandshakes = useCallback(() => {
    if (!did) return [];
    
    const handshakeEntries = storage.getByPrefix('handshake-');
    const handshakes = handshakeEntries.map(entry => entry.value).filter(Boolean) as Handshake[];
    
    return handshakes.filter(h => 
      (h.receiverDid === did || h.senderDid === did) && h.status === 'accepted'
    );
  }, [did]);

  const value: DIDContextType = {
    did,
    profile,
    agents,
    isLoading,
    generateDID,
    saveProfile,
    loadProfile,
    registerAgent,
    initiateHandshake,
    acceptHandshake,
    getPendingHandshakes,
    getAcceptedHandshakes,
  };

  return (
    <DIDContext.Provider value={value}>
      {children}
    </DIDContext.Provider>
  );
};

export { DIDProvider, useDID };
export type { AgentProfile, AgentFormData, ProfileFormData, Profile };
