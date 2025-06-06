import { useState, useEffect } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { APIKeyManager } from './APIKeyManager';
import { useToast } from '@/components/ui/use-toast';

export const ProfileEditor = () => {
  const { profile, saveProfile, isLoading } = useDID();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    avatarUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        email: profile.email || '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile(formData);
      setIsEditing(false);
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

  const generateAIAvatar = async () => {
    if (!geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to generate an AI avatar.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name && !formData.bio) {
      toast({
        title: "Profile Info Needed",
        description: "Please enter your name or bio to generate a personalized avatar.",
        variant: "destructive",
      });
      return;
    }

    // This is where you'd implement the actual Gemini API call
    toast({
      title: "AI Avatar Generation",
      description: "AI avatar generation will be implemented with your API key.",
    });
  };

  if (!isEditing && profile) {
    return (
      <div className="glass rounded-2xl p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">👤</span>
            Your Profile
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary text-white font-medium py-2 px-4 rounded-lg"
          >
            ✏️ Edit Profile
          </button>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-6">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none'; 
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl border-2 border-white/20">
                👤
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
              {profile.bio && <p className="text-white/70 mt-2">{profile.bio}</p>}
              {profile.email && (
                <p className="text-white/60 text-sm mt-1">📧 {profile.email}</p>
              )}
              <p className="text-white/50 text-xs mt-2">
                Last updated: {new Date(profile.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">✏️</span>
        {profile ? 'Edit Profile' : 'Create Profile'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/80">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400"
            placeholder="Your name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white/80">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400 resize-none"
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400"
            placeholder="your@email.com"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="avatarUrl" className="text-white/80">Avatar URL</Label>
            <button
              type="button"
              onClick={generateAIAvatar}
              className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-1 px-3 rounded-lg transition-all duration-200"
            >
              🎨 Generate AI Avatar
            </button>
          </div>
          <Input
            id="avatarUrl"
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400"
            placeholder="https://example.com/avatar.jpg or generate with AI"
          />
        </div>

        <APIKeyManager onKeyChange={setGeminiKey} />
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl flex-1"
          >
            {isLoading ? '💾 Saving...' : '💾 Save Profile'}
          </button>
          
          {profile && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary text-white font-medium py-3 px-6 rounded-xl"
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
