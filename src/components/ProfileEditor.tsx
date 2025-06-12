import { useState, useEffect } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { APIKeyManager } from './APIKeyManager';
import { useToast } from '@/hooks/use-toast';

export const ProfileEditor = () => {
  const { did, profile, agents, saveProfile, isLoading } = useDID();
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
        avatarUrl: profile.avatarUrl || profile.avatar || ''
      });
    }
  }, [profile]);

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

    toast({
      title: "AI Avatar Generation",
      description: "AI avatar generation will be implemented with your API key.",
    });
  };

  if (!isEditing && profile) {
    return (
      <div className="space-y-8">
        <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                👤
              </div>
              Your Profile
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-foreground font-medium py-3 px-6 rounded-xl flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <span>✏️</span>
              Edit Profile
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-8">
              {(profile.avatarUrl || profile.avatar) ? (
                <div className="relative">
                  <img 
                    src={profile.avatarUrl || profile.avatar} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                    onError={(e) => { 
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none'; 
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl border-4 border-white/20 shadow-lg">
                  👤
                </div>
              )}
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">{profile.name}</h3>
                {profile.bio && (
                  <p className="text-foreground/80 leading-relaxed bg-black/20 rounded-lg p-3">{profile.bio}</p>
                )}
                {profile.email && (
                  <div className="flex items-center gap-3 text-foreground/70">
                    <span className="text-lg">📧</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-foreground/50 text-sm">
                  <span>🕒</span>
                  <span>Last updated: {new Date(profile.timestamp || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agents Section */}
        {agents.length > 0 && (
          <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                🤖
              </div>
              My AI Agents ({agents.length})
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
                        <h4 className="text-lg font-semibold text-foreground">{agent.name}</h4>
                      </div>
                      <p className="text-sm text-foreground/60 font-mono break-all mb-2">
                        {agent.did}
                      </p>
                      <p className="text-sm text-foreground/60">
                        Created: {new Date(agent.createdAt).toLocaleDateString()}
                      </p>
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
            
            <div className="mt-6 text-center">
              <p className="text-foreground/60 text-sm mb-4">
                Want to register more agents or manage connections?
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 hover:scale-105">
                Go to Agents Tab
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
          ✏️
        </div>
        {profile ? 'Edit Profile' : 'Create Profile'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-foreground/90 font-semibold flex items-center gap-2">
              <span>👤</span> Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
              placeholder="Your name"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="email" className="text-foreground/90 font-semibold flex items-center gap-2">
              <span>📧</span> Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
              placeholder="your@email.com"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="bio" className="text-foreground/90 font-semibold flex items-center gap-2">
            <span>💭</span> Bio
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 resize-none rounded-xl"
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="avatarUrl" className="text-foreground/90 font-semibold flex items-center gap-2">
              <span>🖼️</span> Avatar
            </Label>
            <button
              type="button"
              onClick={generateAIAvatar}
              className="text-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg"
            >
              <span>🎨</span>
              Generate AI Avatar
            </button>
          </div>
          <Input
            id="avatarUrl"
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
            className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
            placeholder="https://example.com/avatar.jpg or generate with AI"
          />
        </div>

        <APIKeyManager onKeyChange={setGeminiKey} />
        
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
          
          {profile && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
