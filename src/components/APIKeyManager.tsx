
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
    <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <Label htmlFor="gemini-key" className="text-white/90 text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🤖</span>
          AI Configuration
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs font-medium">Ready</span>
          </div>
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="text-white/70 hover:text-white transition-colors text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg"
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
        className="bg-black/20 border-white/20 text-white/90 placeholder-white/50 focus:border-purple-400 cursor-not-allowed font-mono text-sm"
      />
      
      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
        <span className="text-blue-300 text-lg">ℹ️</span>
        <p className="text-blue-200 text-xs leading-relaxed">
          Gemini AI is pre-configured and ready for avatar generation. No additional setup required!
        </p>
      </div>
    </div>
  );
};
