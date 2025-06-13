
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProfileFormFieldsProps {
  formData: {
    name: string;
    bio: string;
    email: string;
    avatarUrl: string;
  };
  onFormChange: (data: any) => void;
}

export const ProfileFormFields = ({ formData, onFormChange }: ProfileFormFieldsProps) => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-foreground/90 font-semibold flex items-center gap-2">
            <span>👤</span> Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange({...formData, name: e.target.value})}
            className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
            placeholder="Your name"
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="email" className="text-foreground/90 font-semibold flex items-center gap-2">
            <span>📧</span> Email (Optional)
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormChange({...formData, email: e.target.value})}
            className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl h-12"
            placeholder="your@email.com"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="bio" className="text-foreground/90 font-semibold flex items-center gap-2">
          <span>💭</span> Bio
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => onFormChange({...formData, bio: e.target.value})}
          className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 resize-none rounded-xl"
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div>
    </>
  );
};
