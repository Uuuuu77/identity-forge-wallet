
interface Profile {
  name: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  avatar?: string;
  timestamp?: number;
}

interface Agent {
  did: string;
  name: string;
  capabilities: string[];
  createdAt: number;
}

interface ProfileDisplayProps {
  profile: Profile;
  agents: Agent[];
  onEdit: () => void;
  onChatWithAgent: (agent: Agent) => void;
}

export const ProfileDisplay = ({ profile, agents, onEdit, onChatWithAgent }: ProfileDisplayProps) => {
  return (
    <div className="space-y-8">
      {/* Profile Display */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
              👤
            </div>
            Your Profile
          </h2>
          <button
            onClick={onEdit}
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
    </div>
  );
};
