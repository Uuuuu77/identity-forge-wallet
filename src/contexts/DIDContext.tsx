
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { generateKeypair, createDIDFromPublicKey } from '@/lib/did-utils';
import storage from '@/lib/storage';

export interface Profile {
  did: string;
  name: string;
  bio: string;
  email: string;
  avatarUrl: string;
  timestamp: string;
  version: string;
}

export interface DIDContextType {
  did: string | null;
  profile: Profile | null;
  isLoading: boolean;
  generateDID: () => void;
  saveProfile: (profileData: Partial<Profile>) => Promise<string>;
  loadProfile: (targetDid?: string) => Promise<{ profile: Profile; verified: boolean; cid: string } | null>;
}

const DIDContext = createContext<DIDContextType | undefined>(undefined);

export const DIDProvider = ({ children }: { children: ReactNode }) => {
  const [did, setDid] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateDID = useCallback(() => {
    const keypair = generateKeypair();
    const newDid = createDIDFromPublicKey(keypair.publicKey);
    
    console.log('Generated new DID:', newDid);
    setDid(newDid);
    storage.set('did', newDid);
    storage.set('keypair', {
      publicKey: Array.from(keypair.publicKey),
      privateKey: Array.from(keypair.privateKey)
    });
  }, []);

  const saveProfile = useCallback(async (profileData: Partial<Profile>) => {
    if (!did) throw new Error('No DID available');
    
    setIsLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profileWithMetadata: Profile = {
        ...profileData,
        did,
        name: profileData.name || '',
        bio: profileData.bio || '',
        email: profileData.email || '',
        avatarUrl: profileData.avatarUrl || '',
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      storage.set(`profile-${did}`, profileWithMetadata);
      setProfile(profileWithMetadata);
      
      console.log('Profile saved successfully:', profileWithMetadata);
      return 'success';
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [did]);

  const loadProfile = useCallback(async (targetDid?: string) => {
    const lookupDid = targetDid || did;
    if (!lookupDid) return null;
    
    try {
      const profileData = storage.get(`profile-${lookupDid}`) as Profile | null;
      console.log('Loading profile for DID:', lookupDid, profileData);
      return profileData ? {
        profile: profileData,
        verified: true,
        cid: 'mock-cid-' + lookupDid.slice(-8)
      } : null;
    } catch (error) {
      console.error('Failed to load profile:', error);
      return null;
    }
  }, [did]);

  // Load existing DID on mount
  useEffect(() => {
    const storedDid = storage.get('did') as string | null;
    if (storedDid) {
      console.log('Loaded existing DID:', storedDid);
      setDid(storedDid);
    }
  }, []);

  // Load profile when DID changes
  useEffect(() => {
    if (did) {
      loadProfile().then(result => {
        if (result && result.verified) {
          setProfile(result.profile);
        }
      });
    }
  }, [did, loadProfile]);

  return (
    <DIDContext.Provider value={{
      did,
      profile,
      isLoading,
      generateDID,
      saveProfile,
      loadProfile
    }}>
      {children}
    </DIDContext.Provider>
  );
};

export const useDID = () => {
  const context = useContext(DIDContext);
  if (!context) {
    throw new Error('useDID must be used within a DIDProvider');
  }
  return context;
};
