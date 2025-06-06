
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
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const storedKey = storage.get('gemini-api-key') as string;
    if (storedKey) {
      setApiKey(storedKey);
      onKeyChange?.(storedKey);
    } else {
      setShowPrompt(true);
    }
  }, [onKeyChange]);

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    storage.set('gemini-api-key', value);
    onKeyChange?.(value);
    if (value.trim()) {
      setShowPrompt(false);
    }
  };

  const handleSetupKey = () => {
    setShowPrompt(true);
  };

  if (showPrompt && !apiKey) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔑</span>
          <div>
            <h3 className="text-white font-semibold">Gemini API Key Required</h3>
            <p className="text-white/70 text-sm">Enter your API key to enable AI avatar generation</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="gemini-key" className="text-white/80 text-sm font-medium">
            Your Gemini API Key
          </Label>
          
          <div className="flex items-center gap-2">
            <Input
              id="gemini-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-white/60 hover:text-white/80 text-xs px-2"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          
          <p className="text-white/50 text-xs">
            Your API key is stored locally and never shared.{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-300 hover:text-yellow-200 underline"
            >
              Get your free API key here
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="gemini-key" className="text-white/80 text-sm font-medium">
          Gemini API Key
        </Label>
        <div className="flex items-center gap-2">
          {apiKey && (
            <span className="text-green-400 text-xs">✓ Connected</span>
          )}
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="text-white/60 hover:text-white/80 text-xs"
          >
            {showKey ? '🙈 Hide' : '👁️ Show'}
          </button>
        </div>
      </div>
      
      <Input
        id="gemini-key"
        type={showKey ? 'text' : 'password'}
        value={apiKey}
        onChange={(e) => handleKeyChange(e.target.value)}
        placeholder="Enter your Gemini API key"
        className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400"
      />
      
      <div className="flex items-center justify-between">
        <p className="text-white/50 text-xs">
          Stored locally and used for AI avatar generation.{' '}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-300 hover:text-purple-200 underline"
          >
            Get your free API key
          </a>
        </p>
        {!apiKey && (
          <button
            type="button"
            onClick={handleSetupKey}
            className="text-purple-300 hover:text-purple-200 text-xs underline"
          >
            Setup Key
          </button>
        )}
      </div>
    </div>
  );
};
