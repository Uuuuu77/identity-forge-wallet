
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateAIAvatar, getGeminiApiKey } from '@/lib/ai-utils';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  bio: string;
  onAvatarChange: (url: string) => void;
}

export const AvatarSection = ({ avatarUrl, name, bio, onAvatarChange }: AvatarSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAIAvatarHandler = async () => {
    const apiKey = getGeminiApiKey();
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter and save your Gemini API key first.",
        variant: "destructive",
      });
      return;
    }

    if (!name && !bio) {
      toast({
        title: "Profile Info Needed",
        description: "Please enter your name or bio to generate a personalized avatar.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `${name}${bio ? `, ${bio}` : ''}, professional avatar, friendly appearance`;
      const generatedAvatarUrl = await generateAIAvatar(prompt);
      
      onAvatarChange(generatedAvatarUrl);
      
      toast({
        title: "Avatar Generated",
        description: "Your AI avatar has been generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="avatarUrl" className="text-foreground/90 font-semibold flex items-center gap-2">
          <span>🖼️</span> Avatar
        </Label>
        <button
          type="button"
          onClick={generateAIAvatarHandler}
          disabled={isGenerating || !getGeminiApiKey()}
          className="text-sm bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating...
            </>
          ) : (
            <>
              <span>🎨</span>
              Generate AI Avatar
            </>
          )}
        </button>
      </div>
      <Input
        id="avatarUrl"
        type="url"
        value={avatarUrl}
        onChange={(e) => onAvatarChange(e.target.value)}
        className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
        placeholder="https://example.com/avatar.jpg or generate with AI"
      />
      <div className="text-sm text-foreground/60">
        💡 Try prompts like: "robot avatar", "cartoon style", "professional headshot", "anime character"
      </div>
    </div>
  );
};
