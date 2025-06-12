
import { useDID } from '@/contexts/DIDContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { CopyButton } from './CopyButton';

const formatDID = (did: string): string => {
  if (did.length <= 30) return did;
  return `${did.substring(0, 20)}...${did.substring(did.length - 10)}`;
};

export const DIDDashboard = () => {
  const { did, generateDID } = useDID();

  if (!did) {
    return (
      <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center animate-fade-in shadow-2xl border border-white/20">
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
            🔐
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Welcome to DID Wallet
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed text-base sm:text-lg px-4">
            Create your decentralized identity to get started. Your DID will be cryptographically secured and completely under your control.
          </p>
        </div>
        
        <button
          onClick={generateDID}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-xl sm:rounded-2xl text-lg sm:text-xl hover:scale-105 transition-all duration-200 shadow-2xl flex items-center gap-2 sm:gap-3 mx-auto"
        >
          <span>✨</span>
          Generate My DID
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 animate-fade-in shadow-2xl border border-white/20">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-xl sm:text-2xl">
          🆔
        </div>
        <span className="break-words">Your Decentralized Identity</span>
      </h2>
      
      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 border border-white/10 backdrop-blur-sm">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-xl">
              <QRCodeDisplay text={did} size={window.innerWidth < 640 ? 160 : 200} />
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6 w-full order-1 lg:order-2">
            <div>
              <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3 font-semibold uppercase tracking-wider flex items-center gap-2">
                <span>🔑</span>
                Your DID
              </p>
              <div className="bg-black/30 rounded-lg sm:rounded-xl p-3 sm:p-4 break-all text-xs sm:text-sm font-mono text-white border border-white/10 backdrop-blur-sm overflow-x-auto">
                <span className="hidden sm:inline">{did}</span>
                <span className="sm:hidden">{formatDID(did)}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <CopyButton text={did} className="flex-1 text-sm sm:text-base py-2 sm:py-3" />
              <button
                onClick={generateDID}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-green-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-green-500/30 flex items-center justify-center text-xl sm:text-2xl">
            🔒
          </div>
          <p className="text-white font-semibold text-sm sm:text-base">Cryptographically Secured</p>
          <p className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Protected by advanced encryption</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-blue-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-blue-500/30 flex items-center justify-center text-xl sm:text-2xl">
            🌐
          </div>
          <p className="text-white font-semibold text-sm sm:text-base">Globally Resolvable</p>
          <p className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Accessible worldwide instantly</p>
        </div>
        
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-primary/20 backdrop-blur-sm hover:scale-105 transition-all duration-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-primary/30 flex items-center justify-center text-xl sm:text-2xl">
            👤
          </div>
          <p className="text-white font-semibold text-sm sm:text-base">Self-Sovereign</p>
          <p className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">You own and control your identity</p>
        </div>
      </div>
    </div>
  );
};
