
import { useDID } from '@/contexts/DIDContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { CopyButton } from './CopyButton';

const formatDID = (did: string): string => {
  if (did.length <= 20) return did;
  return `${did.substring(0, 15)}...${did.substring(did.length - 8)}`;
};

export const DIDDashboard = () => {
  const { did, generateDID } = useDID();

  if (!did) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center animate-fade-in shadow-2xl border border-white/20">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-lg">
            🔐
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to DID Wallet
          </h2>
          <p className="text-foreground/80 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
            Create your decentralized identity to get started. Your DID will be cryptographically secured and completely under your control.
          </p>
        </div>
        
        <button
          onClick={generateDID}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-4 px-10 rounded-2xl text-xl hover:scale-105 transition-all duration-200 shadow-2xl flex items-center gap-3 mx-auto"
        >
          <span>✨</span>
          Generate My DID
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-2xl">
          🆔
        </div>
        Your Decentralized Identity
      </h2>
      
      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 mb-8 border border-white/10 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <QRCodeDisplay text={did} size={200} />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-foreground/70 text-sm mb-3 font-semibold uppercase tracking-wider flex items-center gap-2">
                <span>🔑</span>
                Your DID
              </p>
              <div className="bg-black/30 rounded-xl p-4 break-all text-sm font-mono text-foreground border border-white/10 backdrop-blur-sm">
                <span className="hidden sm:inline">{did}</span>
                <span className="sm:hidden">{formatDID(did)}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <CopyButton text={did} className="flex-1" />
              <button
                onClick={generateDID}
                className="bg-white/20 hover:bg-white/30 text-foreground font-semibold py-3 px-6 rounded-xl text-sm hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 text-center border border-green-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-200">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-500/30 flex items-center justify-center text-2xl">
            🔒
          </div>
          <p className="text-foreground font-semibold">Cryptographically Secured</p>
          <p className="text-foreground/60 text-sm mt-2">Protected by advanced encryption</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 text-center border border-blue-400/20 backdrop-blur-sm hover:scale-105 transition-all duration-200">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/30 flex items-center justify-center text-2xl">
            🌐
          </div>
          <p className="text-foreground font-semibold">Globally Resolvable</p>
          <p className="text-foreground/60 text-sm mt-2">Accessible worldwide instantly</p>
        </div>
        
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-6 text-center border border-primary/20 backdrop-blur-sm hover:scale-105 transition-all duration-200">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/30 flex items-center justify-center text-2xl">
            👤
          </div>
          <p className="text-foreground font-semibold">Self-Sovereign</p>
          <p className="text-foreground/60 text-sm mt-2">You own and control your identity</p>
        </div>
      </div>
    </div>
  );
};
