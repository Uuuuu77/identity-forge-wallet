
import { useState } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { Profile } from '@/contexts/DIDContext';

export const DIDLookup = () => {
  const { loadProfile } = useDID();
  const [searchDid, setSearchDid] = useState('');
  const [searchResult, setSearchResult] = useState<{ profile: Profile; verified: boolean; cid: string } | null>(null);
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
    <div className="glass rounded-2xl p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">🔍</span>
        Lookup DID Profile
      </h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchDid}
            onChange={(e) => setSearchDid(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
            placeholder="Enter DID (e.g., did:key:z6Mk...)"
          />
          <button
            type="submit"
            disabled={isSearching || !searchDid.trim()}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Searching...
              </>
            ) : (
              <>🔍 Search</>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-red-200">⚠️</span>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}

      {searchResult && (
        <div className="bg-white/10 rounded-xl p-6 animate-fade-in border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Profile Found</h3>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-200 flex items-center gap-1">
              ✅ Verified
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {searchResult.profile.avatarUrl ? (
              <img 
                src={searchResult.profile.avatarUrl} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-xl text-white">
                👤
              </div>
            )}
            
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-semibold text-white">{searchResult.profile.name}</h4>
              {searchResult.profile.bio && (
                <p className="text-white/70 leading-relaxed">{searchResult.profile.bio}</p>
              )}
              {searchResult.profile.email && (
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>📧</span>
                  <span>{searchResult.profile.email}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 text-white/50 text-xs">
                <span>Updated: {new Date(searchResult.profile.timestamp).toLocaleDateString()}</span>
                <span className="hidden sm:inline">•</span>
                <span>CID: {searchResult.cid}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!searchResult && !error && !isSearching && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🌐</div>
          <p className="text-white/60">
            Enter a DID above to lookup someone's profile
          </p>
        </div>
      )}
    </div>
  );
};
