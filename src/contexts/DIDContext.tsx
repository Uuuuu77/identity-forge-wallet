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

    // Load agents from storage
    const allKeys = Object.keys(localStorage);
    const agentKeys = allKeys.filter(key => key.startsWith('agent-'));
    const storedAgents = agentKeys.map(key => storage.get(key)).filter(Boolean) as AgentProfile[];
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
  }, [profile, toast]);

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

  const value: DIDContextType = {
    did,
    profile,
    agents,
    isLoading,
    generateDID,
    saveProfile,
    registerAgent,
  };

  return (
    <DIDContext.Provider value={value}>
      {children}
    </DIDContext.Provider>
  );
};

export { DIDProvider, useDID };
