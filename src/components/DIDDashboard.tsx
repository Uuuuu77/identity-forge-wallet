
import { useDID } from '@/contexts/DIDContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { CopyButton } from './CopyButton';
import { formatDID } from '@/utils/crypto';

export const DIDDashboard = () => {
  const { did, generateDID } = useDID();

  if (!did) {
    return (
      <div className="glass rounded-2xl p-8 text-center animate-fade-in">
        <div className="mb-6">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to DID Wallet</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Create your decentralized identity to get started. Your DID will be cryptographically secured and completely under your control.
          </p>
        </div>
        
        <button
          onClick={generateDID}
          className="btn-primary text-white font-semibold py-3 px-8 rounded-xl text-lg"
        >
          Generate My DID
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">🆔</span>
        Your Decentralized Identity
      </h2>
      
      <div className="bg-white/10 rounded-xl p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center">
            <QRCodeDisplay text={did} size={200} />
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-white/60 text-sm mb-2 font-medium uppercase tracking-wide">
                Your DID
              </p>
              <div className="bg-black/20 rounded-lg p-4 break-all text-sm font-mono text-white border border-white/10">
                <span className="hidden sm:inline">{did}</span>
                <span className="sm:hidden">{formatDID(did)}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <CopyButton text={did} className="flex-1" />
              <button
                onClick={generateDID}
                className="btn-secondary text-white font-medium py-2 px-4 rounded-lg text-sm"
              >
                🔄 Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-white/80 text-sm font-medium">Cryptographically Secured</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl mb-2">🌐</div>
          <p className="text-white/80 text-sm font-medium">Globally Resolvable</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl mb-2">👤</div>
          <p className="text-white/80 text-sm font-medium">Self-Sovereign</p>
        </div>
      </div>
    </div>
  );
};
