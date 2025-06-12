
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { chatWithAgent } from '@/lib/ai-utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AgentChatProps {
  agentName: string;
  capabilities: string[];
  avatarUrl?: string;
  onClose: () => void;
}

export const AgentChat = ({ agentName, capabilities, avatarUrl, onClose }: AgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${agentName}. I can help you with: ${capabilities.join(', ')}. How can I assist you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatWithAgent(agentName, inputMessage, capabilities);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      toast({
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to get response from agent.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-6 w-full max-w-2xl h-[90vh] sm:h-[600px] flex flex-col animate-fade-in shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={agentName} 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border-2 border-white/20 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                🤖
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">{agentName}</h3>
              <div className="flex gap-1 flex-wrap">
                {capabilities.slice(0, 2).map(cap => (
                  <span key={cap} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
                    {cap}
                  </span>
                ))}
                {capabilities.length > 2 && (
                  <span className="text-xs text-foreground/60">+{capabilities.length - 2}</span>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-foreground/70 hover:text-foreground flex-shrink-0 p-2"
          >
            ✕
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 mb-3 sm:mb-4">
          <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-xl sm:rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-primary to-accent text-white'
                      : 'bg-white/10 text-foreground border border-white/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 p-3 rounded-xl sm:rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-foreground border-t-transparent"></div>
                    <span className="text-sm text-foreground/70">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="bg-white/10 border-white/20 text-foreground placeholder-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-lg sm:rounded-xl text-sm sm:text-base"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-4 sm:px-6 rounded-lg sm:rounded-xl flex-shrink-0"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
