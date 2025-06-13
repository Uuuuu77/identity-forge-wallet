
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { generateAgentCapabilities, getGeminiApiKey } from '@/lib/ai-utils';
import { useToast } from '@/hooks/use-toast';

const CAPABILITY_OPTIONS = [
  { value: 'text', label: 'Text Processing', icon: '📝' },
  { value: 'image', label: 'Image Generation', icon: '🎨' },
  { value: 'data', label: 'Data Analysis', icon: '📊' },
  { value: 'voice', label: 'Voice Synthesis', icon: '🗣️' },
  { value: 'code', label: 'Code Generation', icon: '💻' },
  { value: 'translate', label: 'Translation', icon: '🌐' }
];

interface CapabilitySelectorProps {
  selectedCapabilities: string[];
  onToggleCapability: (capability: string) => void;
  agentName: string;
  agentDescription: string;
  onCapabilitiesGenerated: (capabilities: string[]) => void;
}

export const CapabilitySelector = ({
  selectedCapabilities,
  onToggleCapability,
  agentName,
  agentDescription,
  onCapabilitiesGenerated
}: CapabilitySelectorProps) => {
  const { toast } = useToast();
  const [isGeneratingCapabilities, setIsGeneratingCapabilities] = useState(false);

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
      onCapabilitiesGenerated(suggestions);
      
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

  return (
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
            onClick={() => onToggleCapability(capability.value)}
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
  );
};
