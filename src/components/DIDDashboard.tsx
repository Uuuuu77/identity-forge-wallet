
import { useDID } from '@/contexts/DIDContext';
import { QRCodeDisplay } from './QRCodeDisplay';
import { CopyButton } from './CopyButton';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useIsMobile } from '@/hooks/use-responsive';

const formatDID = (did: string): string => {
  if (did.length <= 30) return did;
  return `${did.substring(0, 20)}...${did.substring(did.length - 10)}`;
};

export const DIDDashboard = () => {
  const { did, generateDID } = useDID();
  const isMobile = useIsMobile();

  if (!did) {
    return (
      <GlassCard variant="glow" className="text-center animate-fade-in shadow-2xl mb-20 sm:mb-8">
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
            🔐
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">
            Welcome to DID Wallet
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed text-sm sm:text-base lg:text-lg px-2">
            Create your decentralized identity to get started. Your DID will be cryptographically secured and completely under your control.
          </p>
        </div>
        
        <AnimatedButton
          onClick={generateDID}
          size={isMobile ? "default" : "lg"}
          className="flex items-center gap-2 sm:gap-3 mx-auto text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4"
        >
          <span>✨</span>
          Generate My DID
        </AnimatedButton>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6 mb-20 sm:mb-8">
      <GlassCard variant="interactive" className="animate-fade-in shadow-2xl">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-lg sm:text-2xl">
            🆔
          </div>
          <span className="break-words">Your Decentralized Identity</span>
        </h2>
        
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="p-2 sm:p-3 lg:p-4 bg-white rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <QRCodeDisplay text={did} size={isMobile ? 140 : 180} />
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
                <AnimatedButton
                  onClick={generateDID}
                  variant="secondary"
                  size="default"
                  className="flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
                >
                  <span>🔄</span>
                  Regenerate
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            icon: '🔒',
            title: 'Cryptographically Secured',
            desc: 'Protected by advanced encryption',
            gradient: 'from-gray-600/20 to-gray-700/20',
            border: 'border-gray-500/20'
          },
          {
            icon: '🌐',
            title: 'Globally Resolvable',
            desc: 'Accessible worldwide instantly',
            gradient: 'from-gray-500/20 to-gray-600/20',
            border: 'border-gray-400/20'
          },
          {
            icon: '👤',
            title: 'Self-Sovereign',
            desc: 'You own and control your identity',
            gradient: 'from-gray-700/20 to-gray-800/20',
            border: 'border-gray-600/20'
          }
        ].map((feature, index) => (
          <GlassCard
            key={index}
            variant="interactive"
            className={`text-center bg-gradient-to-br ${feature.gradient} border ${feature.border} hover:scale-105 transition-all duration-200`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center text-xl sm:text-2xl">
              {feature.icon}
            </div>
            <p className="text-white font-semibold text-sm sm:text-base">{feature.title}</p>
            <p className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">{feature.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
