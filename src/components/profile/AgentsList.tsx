
interface Agent {
  did: string;
  name: string;
  capabilities: string[];
  createdAt: number;
}

interface AgentsListProps {
  agents: Agent[];
  onChatWithAgent: (agent: Agent) => void;
}

export const AgentsList = ({ agents, onChatWithAgent }: AgentsListProps) => {
  if (agents.length === 0) return null;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-in shadow-2xl border border-white/20">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shrink-0">
          🤖
        </div>
        My AI Agents ({agents.length})
      </h3>
      
      <div className="grid gap-4">
        {agents.map((agent) => (
          <div
            key={agent.did}
            className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                    🤖
                  </div>
                  <h4 className="text-lg font-semibold text-foreground break-words">{agent.name}</h4>
                </div>
                <p className="text-sm text-foreground/60 font-mono break-all mb-2">
                  {agent.did}
                </p>
                <p className="text-sm text-foreground/60">
                  Created: {new Date(agent.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-stretch sm:items-end gap-3">
                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                  {agent.capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-purple-400/30"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onChatWithAgent(agent)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  Chat with Agent
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-foreground/60 text-sm mb-4">
          Want to register more agents or manage connections?
        </p>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 hover:scale-105">
          Go to Agents Tab
        </button>
      </div>
    </div>
  );
};
