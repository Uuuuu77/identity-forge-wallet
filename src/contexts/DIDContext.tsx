'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateKeypair, createDIDFromPublicKey } from '../lib/did-utils';
import storage from '../lib/storage';

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

interface DIDContextType {
  did: string | null;
  privateKey: Uint8Array | null;
  publicKey: Uint8Array | null;
  profile: DIDProfile | null;
  isLoading: boolean;
  generateDID: () => void;
  updateProfile: (profile: Partial<DIDProfile>) => void;
  saveProfile: (profile: Partial<DIDProfile>) => Promise<void>;
  loadProfile: (did: string) => Promise<{ profile: DIDProfile; verified: boolean; cid: string } | null>;
  exportDID: () => string;
  importDID: (didData: string) => boolean;
}

const DIDContext = createContext<DIDContextType | undefined>(undefined);

export const useDID = () => {
  const context = useContext(DIDContext);
  if (!context) {
    throw new Error('useDID must be used within a DIDProvider');
  }
  return context;
};

export const DIDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [did, setDID] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  const [publicKey, setPublicKey] = useState<Uint8Array | null>(null);
  const [profile, setProfile] = useState<DIDProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      updateProfile(newProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfile = async (searchDid: string): Promise<{ profile: DIDProfile; verified: boolean; cid: string } | null> => {
    // Mock implementation - in real app, this would fetch from IPFS/network
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data for demo
    if (searchDid.startsWith('did:key:z')) {
      return {
        profile: {
          name: 'Mock User',
          bio: 'This is a mock profile for demonstration',
          avatar: '',
          website: '',
          twitter: '',
          github: '',
          email: 'mock@example.com',
          timestamp: Date.now() - 86400000 // 1 day ago
        },
        verified: true,
        cid: 'QmMockCID123...'
      };
    }
    
    return null;
  };

  const exportDID = () => {
    if (!did || !privateKey || !publicKey) {
      throw new Error('No DID to export');
    }
    
    const exportData = {
      did,
      privateKey: Array.from(privateKey),
      publicKey: Array.from(publicKey),
      profile,
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
      
      // Store in localStorage
      storage.set('did', data.did);
      storage.set('privateKey', data.privateKey);
      storage.set('publicKey', data.publicKey);
      storage.set('profile', data.profile);
      
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
      isLoading,
      generateDID,
      updateProfile,
      saveProfile,
      loadProfile,
      exportDID,
      importDID,
    }}>
      {children}
    </DIDContext.Provider>
  );
};
