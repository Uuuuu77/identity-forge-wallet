
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProfileFormFields } from './ProfileFormFields';
import { AvatarSection } from './AvatarSection';
import { APIKeyManager } from '../APIKeyManager';

interface Profile {
  name: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  avatar?: string;
  timestamp?: number;
}

interface ProfileFormProps {
  profile?: Profile;
  isLoading: boolean;
  onSave: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export const ProfileForm = ({ profile, isLoading, onSave, onCancel }: ProfileFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    email: profile?.email || '',
    avatarUrl: profile?.avatarUrl || profile?.avatar || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to create a profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(formData);
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
          ✏️
        </div>
        {profile ? 'Edit Profile' : 'Create Profile'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <ProfileFormFields formData={formData} onFormChange={setFormData} />
        
        <AvatarSection
          avatarUrl={formData.avatarUrl}
          name={formData.name}
          bio={formData.bio}
          onAvatarChange={(url) => setFormData({...formData, avatarUrl: url})}
        />

        <APIKeyManager onKeyChange={() => {}} />
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl text-lg flex-1 hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Profile
              </>
            )}
          </button>
          
          {profile && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-white/20 hover:bg-white/30 text-foreground font-semibold py-4 px-8 rounded-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>❌</span>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
