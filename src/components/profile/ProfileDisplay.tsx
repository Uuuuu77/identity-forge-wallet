
import { GlassCard } from '@/components/ui/glass-card';

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

export const ProfileDisplay = ({ profile, onEdit }: ProfileDisplayProps) => {
  return (
    <div className="space-y-8">
      {/* Profile Display */}
      <GlassCard className="p-4 md:p-8 animate-fade-in shadow-2xl border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl md:text-2xl shrink-0">
              👤
            </div>
            Your Profile
          </h2>
          <button
            onClick={onEdit}
            className="bg-white/20 hover:bg-white/30 text-foreground font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-xl flex items-center gap-2 hover:scale-105 transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <span>✏️</span>
            Edit Profile
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 md:p-6 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-6 md:space-y-0 md:space-x-8">
            {(profile.avatarUrl || profile.avatar) ? (
              <div className="relative shrink-0">
                <img 
                  src={profile.avatarUrl || profile.avatar} 
                  alt="Avatar" 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none'; 
                  }}
                />
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl border-4 border-white/20 shadow-lg shrink-0">
                👤
              </div>
            )}
            <div className="flex-1 space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-foreground break-words">{profile.name}</h3>
              {profile.bio && (
                <p className="text-foreground/80 leading-relaxed bg-black/20 rounded-lg p-3 text-sm md:text-base break-words">{profile.bio}</p>
              )}
              {profile.email && (
                <div className="flex items-center justify-center md:justify-start gap-3 text-foreground/70">
                  <span className="text-lg">📧</span>
                  <span className="font-medium text-sm md:text-base break-all">{profile.email}</span>
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start gap-3 text-foreground/50 text-xs md:text-sm">
                <span>🕒</span>
                <span>Last updated: {new Date(profile.timestamp || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
