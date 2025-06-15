import { useState } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export const DIDLookup = () => {
  const { loadProfile, did: currentDID } = useDID();
  const [searchDid, setSearchDid] = useState('');
  const [searchResult, setSearchResult] = useState<{ profile: any; verified: boolean; cid: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDid.trim()) {
      setError('Please enter a DID to search for.');
      return;
    }

    // Basic DID format validation
    if (!searchDid.startsWith('did:key:z')) {
      setError('Invalid DID format. DID should start with "did:key:z"');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResult(null);

    try {
      console.log('Searching for DID:', searchDid.trim());
      console.log('Current DID:', currentDID);
      
      const result = await loadProfile(searchDid.trim());
      console.log('Search result:', result);
      
      if (result) {
        setSearchResult(result);
      } else {
        setError('Profile not found for this DID. The user may not have created a profile yet, or the DID may not exist.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to lookup DID. Please check the DID format and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchDid('');
    setSearchResult(null);
    setError('');
  };

  return (
    <GlassCard className="p-4 md:p-8 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl md:text-2xl shrink-0">
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
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all backdrop-blur-sm"
              placeholder="Enter DID (e.g., did:key:z6Mk...)"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/30">
              🔗
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSearching || !searchDid.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 flex-1 sm:flex-none min-w-[140px] hover:scale-105 shadow-lg"
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
            {(searchResult || error) && (
              <AnimatedButton
                type="button"
                variant="secondary"
                onClick={clearSearch}
                className="p-3 sm:p-4 rounded-xl"
              >
                <span>🗑️</span>
              </AnimatedButton>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-xl p-4 sm:p-6 mb-6 animate-fade-in backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/30 flex items-center justify-center">
              ⚠️
            </div>
            <p className="text-red-200 font-medium">{error}</p>
          </div>
        </div>
      )}

      {searchResult && (
        <div className="bg-black/20 rounded-2xl p-4 md:p-6 animate-fade-in border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-3">
              <span>👤</span>
              Profile Found
              {searchDid === currentDID && (
                <span className="text-xs sm:text-sm bg-primary/20 text-primary-foreground px-2 py-1 rounded-full whitespace-nowrap">
                  Your Profile
                </span>
              )}
            </h3>
            <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-green-500/20 text-green-200 flex items-center gap-2 border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Verified
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-8">
            {searchResult.profile.avatarUrl ? (
              <div className="relative shrink-0">
                <img 
                  src={searchResult.profile.avatarUrl} 
                  alt="Avatar" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                  onError={(e) => { 
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl text-white shadow-lg border-4 border-white/20 shrink-0">
                👤
              </div>
            )}
            
            <div className="flex-1 space-y-4 min-w-0">
              <h4 className="text-xl md:text-2xl font-bold text-foreground break-words">{searchResult.profile.name}</h4>
              {searchResult.profile.bio && (
                <p className="text-foreground/80 leading-relaxed bg-black/20 rounded-lg p-3 text-sm md:text-base break-words">{searchResult.profile.bio}</p>
              )}
              {searchResult.profile.email && (
                <div className="flex items-center gap-3 text-foreground/70">
                  <span className="text-lg">📧</span>
                  <span className="font-medium text-sm md:text-base break-all">{searchResult.profile.email}</span>
                </div>
              )}
              <div className="flex flex-col gap-2 text-foreground/50 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span>🕒</span>
                  <span>Updated: {new Date(searchResult.profile.timestamp || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">🔗</span>
                  <span className="break-all">CID: {searchResult.cid}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!searchResult && !error && !isSearching && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl border border-primary/20">
            🌐
          </div>
          <p className="text-foreground/60 text-lg mb-4">
            Enter a DID above to lookup someone's profile
          </p>
          {currentDID && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
              <p className="text-foreground/70 text-sm mb-2">💡 Try searching for your own DID:</p>
              <p className="text-foreground/60 text-xs font-mono break-all">{currentDID}</p>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};
