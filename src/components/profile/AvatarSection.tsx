
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateAIAvatar, getGeminiApiKey } from '@/lib/ai-utils';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  bio: string;
  onAvatarChange: (url: string) => void;
}

const avatarStyles = [
    { value: 'professional', label: 'Professional' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'robot', label: 'Robot' },
    { value: 'pixel', label: 'Pixel Art' },
    { value: 'fantasy', label: 'Fantasy' },
];

export const AvatarSection = ({ avatarUrl, name, bio, onAvatarChange }: AvatarSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState(avatarStyles[0].value);
  const [avatarDescription, setAvatarDescription] = useState('');
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

    if (!avatarDescription.trim() && !name && !bio) {
      toast({
        title: "Profile Info Needed",
        description: "Please enter a description, or fill out your name/bio to generate a personalized avatar.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = avatarDescription.trim() || `${name}${bio ? `, ${bio}` : ''}`;
      const generatedAvatarUrl = await generateAIAvatar(prompt, avatarStyle);
      
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
    <div className="space-y-6 border-t border-white/10 pt-8">
        <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-3">
            <span className="text-xl">✨</span> AI Avatar Generation
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="avatarDescription" className="text-foreground/80">Description</Label>
                <Textarea
                id="avatarDescription"
                value={avatarDescription}
                onChange={(e) => setAvatarDescription(e.target.value)}
                placeholder="e.g., a wizard with a long white beard"
                className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl"
                rows={3}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="avatarStyle" className="text-foreground/80">Style</Label>
                <Select value={avatarStyle} onValueChange={setAvatarStyle}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12">
                        <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                        {avatarStyles.map(style => (
                            <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="flex justify-end">
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
                Generate Avatar
                </>
            )}
            </button>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-6">
            <Label htmlFor="avatarUrl" className="text-foreground/90 font-semibold flex items-center gap-2">
            <span>🖼️</span> Manual Avatar URL
            </Label>
            <Input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => onAvatarChange(e.target.value)}
                className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
                placeholder="https://example.com/avatar.jpg or generate with AI"
            />
        </div>
    </div>
  );
};
