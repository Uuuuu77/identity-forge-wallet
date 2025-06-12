import { useState } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateAgentCapabilities, getGeminiApiKey } from '@/lib/ai-utils';

const CAPABILITY_OPTIONS = [
  { value: 'text', label: 'Text Processing', icon: '📝' },
  { value: 'image', label: 'Image Generation', icon: '🎨' },
  { value: 'data', label: 'Data Analysis', icon: '📊' },
  { value: 'voice', label: 'Voice Synthesis', icon: '🗣️' },
  { value: 'code', label: 'Code Generation', icon: '💻' },
  { value: 'translate', label: 'Translation', icon: '🌐' }
];

export const AgentRegistry = () => {
  const { did, registerAgent } = useDID();
  const { toast } = useToast();
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCapabilities, setIsGeneratingCapabilities] = useState(false);

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(capability) 
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  const generateCapabilities = async () => {
    const apiKey = getGeminiApiKey();
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in the Profile tab first.",
        variant: "destructive",
      });
      return;
    }

    if (!agentName.trim()) {
      toast({
        title: "Agent Name Required",
        description: "Please enter an agent name first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCapabilities(true);
    
    try {
      const suggestions = await generateAgentCapabilities(agentName, agentDescription);
      setSelectedCapabilities(suggestions);
      
      toast({
        title: "Capabilities Suggested",
        description: "AI has suggested relevant capabilities for your agent!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate capabilities.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCapabilities(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!did) {
      toast({
        title: "DID Required",
        description: "Please generate a DID first before registering an agent.",
        variant: "destructive",
      });
      return;
    }

    if (!agentName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your AI agent.",
        variant: "destructive",
      });
      return;
    }

    if (selectedCapabilities.length === 0) {
      toast({
        title: "Capabilities Required",
        description: "Please select at least one capability for your agent.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      registerAgent({
        name: agentName,
        description: agentDescription,
        capabilities: selectedCapabilities
      });
      
      // Clear form
      setAgentName("");
      setAgentDescription("");
      setSelectedCapabilities([]);
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to register agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
          🤖
        </div>
        Register AI Agent
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="agentName" className="text-foreground/90 font-semibold flex items-center gap-2">
            <span>🤖</span> Agent Name *
          </Label>
          <Input
            id="agentName"
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
            placeholder="e.g., Assistant Bot, Image Creator, Data Analyzer"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="agentDescription" className="text-foreground/90 font-semibold flex items-center gap-2">
            <span>📋</span> Description (Optional)
          </Label>
          <Textarea
            id="agentDescription"
            value={agentDescription}
            onChange={(e) => setAgentDescription(e.target.value)}
            className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 resize-none rounded-xl"
            placeholder="Describe what your agent does..."
            rows={3}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground/90 font-semibold flex items-center gap-2">
              <span>⚡</span> Capabilities *
            </Label>
            <Button
              type="button"
              onClick={generateCapabilities}
              disabled={isGeneratingCapabilities || !getGeminiApiKey()}
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
            >
              {isGeneratingCapabilities ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <span className="mr-2">🎯</span>
                  AI Suggest
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CAPABILITY_OPTIONS.map((capability) => (
              <button
                key={capability.value}
                type="button"
                onClick={() => toggleCapability(capability.value)}
                className={`p-4 rounded-xl border transition-all duration-200 text-left hover:scale-105 ${
                  selectedCapabilities.includes(capability.value)
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 text-purple-200'
                    : 'bg-white/10 border-white/20 text-foreground/80 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{capability.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{capability.label}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {selectedCapabilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCapabilities.map(cap => {
                const capability = CAPABILITY_OPTIONS.find(c => c.value === cap);
                return (
                  <span
                    key={cap}
                    className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-3 py-1 rounded-full text-sm font-medium border border-purple-400/30"
                  >
                    {capability?.icon} {capability?.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 pt-6 border-t border-white/10">
          <Button
            type="submit"
            disabled={isSubmitting || !agentName.trim() || selectedCapabilities.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl text-lg flex-1 hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Registering...
              </>
            ) : (
              <>
                <span>🚀</span>
                Register Agent
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
