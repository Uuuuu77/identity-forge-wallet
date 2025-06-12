
import { useState, useEffect } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Handshake } from '@/contexts/DIDContext';

const SCOPE_OPTIONS = [
  { value: 'calendar', label: 'Calendar Access', icon: '📅' },
  { value: 'contacts', label: 'Contact Information', icon: '👥' },
  { value: 'documents', label: 'Document Processing', icon: '📄' },
  { value: 'media', label: 'Media Files', icon: '🎬' },
  { value: 'analytics', label: 'Usage Analytics', icon: '📈' },
  { value: 'custom', label: 'Custom Scope', icon: '⚙️' }
];

export const AgentHandshake = () => {
  const { 
    did, 
    initiateHandshake, 
    acceptHandshake, 
    getPendingHandshakes, 
    getAcceptedHandshakes 
  } = useDID();
  const { toast } = useToast();
  
  const [receiverDid, setReceiverDid] = useState("");
  const [selectedScope, setSelectedScope] = useState("");
  const [customScope, setCustomScope] = useState("");
  const [pendingHandshakes, setPendingHandshakes] = useState<Handshake[]>([]);
  const [acceptedHandshakes, setAcceptedHandshakes] = useState<Handshake[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load handshakes
  useEffect(() => {
    if (did) {
      setPendingHandshakes(getPendingHandshakes());
      setAcceptedHandshakes(getAcceptedHandshakes());
    }
  }, [did, getPendingHandshakes, getAcceptedHandshakes]);

  const handleSendHandshake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!did) {
      toast({
        title: "DID Required",
        description: "Please generate a DID first.",
        variant: "destructive",
      });
      return;
    }

    if (!receiverDid.trim()) {
      toast({
        title: "Receiver DID Required",
        description: "Please enter the receiver's DID.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedScope) {
      toast({
        title: "Scope Required",
        description: "Please select an access scope.",
        variant: "destructive",
      });
      return;
    }

    if (selectedScope === 'custom' && !customScope.trim()) {
      toast({
        title: "Custom Scope Required",
        description: "Please specify your custom scope.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const scope = selectedScope === 'custom' ? customScope : selectedScope;
      initiateHandshake(did, receiverDid.trim(), scope);
      
      // Clear form
      setReceiverDid("");
      setSelectedScope("");
      setCustomScope("");
      
      // Refresh handshakes
      setPendingHandshakes(getPendingHandshakes());
      
    } catch (error) {
      toast({
        title: "Handshake Failed",
        description: "Failed to initiate handshake. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptHandshake = (handshakeId: string) => {
    acceptHandshake(handshakeId);
    setPendingHandshakes(getPendingHandshakes());
    setAcceptedHandshakes(getAcceptedHandshakes());
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDID = (did: string) => {
    return `${did.slice(0, 12)}...${did.slice(-8)}`;
  };

  return (
    <div className="space-y-8">
      {/* Pending Handshakes */}
      {pendingHandshakes.length > 0 && (
        <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl">
              ⏳
            </div>
            Pending Connection Requests
          </h3>
          
          <div className="space-y-4">
            {pendingHandshakes.map((handshake) => (
              <div
                key={handshake.id}
                className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">🤝</span>
                      <h4 className="font-semibold text-foreground">Connection Request</h4>
                    </div>
                    <div className="space-y-1 text-sm text-foreground/80">
                      <p><strong>From:</strong> {formatDID(handshake.senderDid)}</p>
                      <p><strong>Scope:</strong> {handshake.scope}</p>
                      <p><strong>Requested:</strong> {formatTimestamp(handshake.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptHandshake(handshake.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      ✅ Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/20 hover:bg-white/30 text-foreground border-white/20 hover:border-white/30 py-2 px-4 rounded-xl transition-all duration-200"
                    >
                      ❌ Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Connections */}
      {acceptedHandshakes.length > 0 && (
        <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl">
              ✅
            </div>
            Active Connections
          </h3>
          
          <div className="grid gap-4">
            {acceptedHandshakes.map((handshake) => (
              <div
                key={handshake.id}
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-400/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      🔗
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">
                        {handshake.senderDid === did ? formatDID(handshake.receiverDid) : formatDID(handshake.senderDid)}
                      </p>
                      <p className="text-foreground/60">{handshake.scope}</p>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/50">
                    {formatTimestamp(handshake.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initiate New Handshake */}
      <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
            🤝
          </div>
          Initiate Agent Connection
        </h3>
        
        <form onSubmit={handleSendHandshake} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="receiverDid" className="text-foreground/90 font-semibold flex items-center gap-2">
              <span>🎯</span> Receiver Agent DID *
            </Label>
            <Input
              id="receiverDid"
              type="text"
              value={receiverDid}
              onChange={(e) => setReceiverDid(e.target.value)}
              className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
              placeholder="did:agent:example123... or did:key:z6Mk..."
              required
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-foreground/90 font-semibold flex items-center gap-2">
              <span>🔐</span> Access Scope *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SCOPE_OPTIONS.map((scope) => (
                <button
                  key={scope.value}
                  type="button"
                  onClick={() => setSelectedScope(scope.value)}
                  className={`p-3 rounded-xl border transition-all duration-200 text-left hover:scale-105 ${
                    selectedScope === scope.value
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/50 text-blue-200'
                      : 'bg-white/10 border-white/20 text-foreground/80 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{scope.icon}</span>
                    <span className="text-sm font-medium">{scope.label}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {selectedScope === 'custom' && (
              <Input
                type="text"
                value={customScope}
                onChange={(e) => setCustomScope(e.target.value)}
                className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
                placeholder="Enter custom scope description"
                required
              />
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || !receiverDid.trim() || !selectedScope || (selectedScope === 'custom' && !customScope.trim())}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl text-lg w-full hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Sending Request...
              </>
            ) : (
              <>
                <span>🚀</span>
                Send Connection Request
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
