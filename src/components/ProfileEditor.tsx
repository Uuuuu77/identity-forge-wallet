
import { useState, useEffect } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { useToast } from '@/hooks/use-toast';

export const ProfileEditor = () => {
  const { profile, saveProfile, isLoading, did } = useDID();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    avatarUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);

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
    if (!did) {
      toast({
        title: "No DID Found",
        description: "Please generate a DID first",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile Saved",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!did) {
    return (
      <div className="glass rounded-2xl p-8 text-center animate-fade-in">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-4">No DID Found</h2>
        <p className="text-white/70">Please generate a DID first from the Dashboard</p>
      </div>
    );
  }

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
            className="btn-secondary text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            ✏️ Edit Profile
          </button>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-2xl text-white">
                👤
              </div>
            )}
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                {profile.bio && (
                  <p className="text-white/70 mt-2 leading-relaxed">{profile.bio}</p>
                )}
              </div>
              
              {profile.email && (
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>📧</span>
                  <span>{profile.email}</span>
                </div>
              )}
              
              <div className="text-white/40 text-xs">
                Last updated: {new Date(profile.timestamp).toLocaleDateString()}
              </div>
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
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 h-24 resize-none transition-all"
            placeholder="Tell us about yourself..."
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Avatar URL (Optional)
          </label>
          <input
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>💾 Save Profile</>
            )}
          </button>
          
          {profile && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
