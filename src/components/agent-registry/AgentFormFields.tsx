
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AgentFormFieldsProps {
  agentName: string;
  agentDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const AgentFormFields = ({
  agentName,
  agentDescription,
  onNameChange,
  onDescriptionChange
}: AgentFormFieldsProps) => {
  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="agentName" className="text-foreground/90 font-semibold flex items-center gap-2">
          <span>🤖</span> Agent Name *
        </Label>
        <Input
          id="agentName"
          type="text"
          value={agentName}
          onChange={(e) => onNameChange(e.target.value)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 resize-none rounded-xl"
          placeholder="Describe what your agent does..."
          rows={3}
        />
      </div>
    </>
  );
};
