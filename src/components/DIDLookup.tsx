
import { useState } from 'react';
import { useDID } from '@/contexts/DIDContext';

export const DIDLookup = () => {
  const { loadProfile } = useDID();
  const [searchDid, setSearchDid] = useState('');
  const [searchResult, setSearchResult] = useState<{ profile: any; verified: boolean; cid: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDid.trim()) return;

    setIsSearching(true);
    setError('');
    setSearchResult(null);

    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await loadProfile(searchDid.trim());
      if (result) {
        setSearchResult(result);
      } else {
        setError('Profile not found for this DID. The user may not have created a profile yet.');
      }
    } catch (err) {
      setError('Failed to lookup DID. Please check the DID format and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
          🔍
        </div>
        Lookup DID Profile
      </h2>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchDid}
              onChange={(e) => setSearchDid(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all backdrop-blur-sm"
              placeholder="Enter DID (e.g., did:key:z6Mk...)"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/30">
              🔗
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchDid.trim()}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 min-w-[140px] hover:scale-105 shadow-lg"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Searching...
              </>
            ) : (
              <>
                <span>🔍</span>
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-xl p-6 mb-6 animate-fade-in backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/30 flex items-center justify-center">
              ⚠️
            </div>
            <p className="text-red-200 font-medium">{error}</p>
          </div>
        </div>
      )}

      {searchResult && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 animate-fade-in border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <span>👤</span>
              Profile Found
            </h3>
            <div className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-200 flex items-center gap-2 border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Verified
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-8">
            {searchResult.profile.avatarUrl ? (
              <div className="relative">
                <img 
                  src={searchResult.profile.avatarUrl} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl text-white shadow-lg border-4 border-white/20">
                👤
              </div>
            )}
            
            <div className="flex-1 space-y-4">
              <h4 className="text-2xl font-bold text-foreground">{searchResult.profile.name}</h4>
              {searchResult.profile.bio && (
                <p className="text-foreground/80 leading-relaxed bg-black/20 rounded-lg p-3">{searchResult.profile.bio}</p>
              )}
              {searchResult.profile.email && (
                <div className="flex items-center gap-3 text-foreground/70">
                  <span className="text-lg">📧</span>
                  <span className="font-medium">{searchResult.profile.email}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 text-foreground/50 text-sm">
                <div className="flex items-center gap-2">
                  <span>🕒</span>
                  <span>Updated: {new Date(searchResult.profile.timestamp || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔗</span>
                  <span>CID: {searchResult.cid}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!searchResult && !error && !isSearching && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-3xl border border-blue-400/20">
            🌐
          </div>
          <p className="text-foreground/60 text-lg">
            Enter a DID above to lookup someone's profile
          </p>
        </div>
      )}
    </div>
  );
};
