
import { useState } from 'react';
import { useDID } from '@/contexts/DIDContext';
import { useToast } from '@/hooks/use-toast';
import { AgentFormFields } from './agent-registry/AgentFormFields';
import { CapabilitySelector } from './agent-registry/CapabilitySelector';
import { AgentSubmission } from './agent-registry/AgentSubmission';

export const AgentRegistry = () => {
  const { did, registerAgent } = useDID();
  const { toast } = useToast();
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(capability) 
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  const handleCapabilitiesGenerated = (capabilities: string[]) => {
    setSelectedCapabilities(capabilities);
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

  const isFormValid = agentName.trim() && selectedCapabilities.length > 0;

  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-in shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
          🤖
        </div>
        Register AI Agent
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <AgentFormFields
          agentName={agentName}
          agentDescription={agentDescription}
          onNameChange={setAgentName}
          onDescriptionChange={setAgentDescription}
        />
        
        <CapabilitySelector
          selectedCapabilities={selectedCapabilities}
          onToggleCapability={toggleCapability}
          agentName={agentName}
          agentDescription={agentDescription}
          onCapabilitiesGenerated={handleCapabilitiesGenerated}
        />
        
        <AgentSubmission
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          onSubmit={() => {}}
        />
      </form>
    </div>
  );
};
