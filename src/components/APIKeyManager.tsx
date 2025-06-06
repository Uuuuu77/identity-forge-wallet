
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storage } from '@/utils/storage';

interface APIKeyManagerProps {
  onKeyChange?: (key: string) => void;
}

export const APIKeyManager = ({ onKeyChange }: APIKeyManagerProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const storedKey = storage.get('gemini-api-key') as string;
    if (storedKey) {
      setApiKey(storedKey);
      onKeyChange?.(storedKey);
    }
  }, [onKeyChange]);

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    storage.set('gemini-api-key', value);
    onKeyChange?.(value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="gemini-key" className="text-white/80 text-sm font-medium">
          Gemini API Key
        </Label>
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="text-white/60 hover:text-white/80 text-xs"
        >
          {showKey ? '🙈 Hide' : '👁️ Show'}
        </button>
      </div>
      
      <Input
        id="gemini-key"
        type={showKey ? 'text' : 'password'}
        value={apiKey}
        onChange={(e) => handleKeyChange(e.target.value)}
        placeholder="Enter your Gemini API key"
        className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400"
      />
      
      <p className="text-white/50 text-xs">
        Your API key is stored locally and used for AI avatar generation.{' '}
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-300 hover:text-purple-200 underline"
        >
          Get your free API key here
        </a>
      </p>
    </div>
  );
};
