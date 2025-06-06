
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { storage } from '@/utils/storage';

interface APIKeyManagerProps {
  onKeyChange?: (key: string) => void;
}

// Hardcoded Gemini API key for users to use
const HARDCODED_GEMINI_KEY = 'YOUR_GEMINI_API_KEY_HERE';

export const APIKeyManager = ({ onKeyChange }: APIKeyManagerProps) => {
  const [apiKey] = useState(HARDCODED_GEMINI_KEY);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Use the hardcoded key and notify parent component
    onKeyChange?.(HARDCODED_GEMINI_KEY);
    // Also store it locally for consistency
    storage.set('gemini-api-key', HARDCODED_GEMINI_KEY);
  }, [onKeyChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="gemini-key" className="text-white/80 text-sm font-medium">
          Gemini API Key (Provided)
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-xs">✓ Ready to use</span>
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
        readOnly
        className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-400 cursor-not-allowed"
      />
      
      <p className="text-white/50 text-xs">
        API key is provided and ready for AI avatar generation. No setup required!
      </p>
    </div>
  );
};
