
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import storage from '../lib/storage';

interface APIKeyManagerProps {
  onKeyChange: (key: string) => void;
}

export const APIKeyManager = ({ onKeyChange }: APIKeyManagerProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const storedKey = storage.get('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      onKeyChange(storedKey);
    }
  }, [onKeyChange]);

  const handleSaveKey = () => {
    storage.set('gemini_api_key', apiKey);
    onKeyChange(apiKey);
  };

  const handleClearKey = () => {
    setApiKey('');
    storage.remove('gemini_api_key');
    onKeyChange('');
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <Label htmlFor="gemini-key" className="text-foreground/90 font-semibold flex items-center gap-2">
          <span>🔑</span> Gemini API Key
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowKey(!showKey)}
          className="text-foreground/60 hover:text-foreground/80"
        >
          {showKey ? '👁️' : '👁️‍🗨️'}
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Input
          id="gemini-key"
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl flex-1"
          placeholder="Enter your Gemini API key for AI features"
        />
        <Button
          type="button"
          onClick={handleSaveKey}
          disabled={!apiKey.trim()}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl px-4"
        >
          Save
        </Button>
        {apiKey && (
          <Button
            type="button"
            onClick={handleClearKey}
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl px-4"
          >
            Clear
          </Button>
        )}
      </div>
      
      <p className="text-foreground/60 text-sm">
        Your API key is stored locally and used only for generating AI avatars.
      </p>
    </div>
  );
};
