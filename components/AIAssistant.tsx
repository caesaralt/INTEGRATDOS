import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  Minimize2, 
  Bot, 
  Paperclip, 
  Check,
  Database,
  Import,
  Brain,
  Play,
  Pause
} from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { LayoutDashboard, FileText, PenTool, Zap, Cpu, Settings, ClipboardList, Users } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

const MODULES = [
  { name: 'CRM Dashboard', id: 'crm', icon: LayoutDashboard },
  { name: 'Quote Automation', id: 'quotes', icon: FileText },
  { name: 'Canvas Editor', id: 'canvas', icon: PenTool },
  { name: 'Electrical Mapping', id: 'mapping', icon: Zap },
  { name: 'Loxone Board Builder', id: 'board', icon: Cpu },
  { name: 'Electrical CAD', id: 'cad', icon: Settings },
  { name: 'Operations Board', id: 'ops', icon: ClipboardList },
  { name: 'Admin Panel', id: 'admin', icon: Users },
];

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onMinimize, isMinimized }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "ALFRED: What's up?", timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isReasoningEnabled, setIsReasoningEnabled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare context string
    let contextString = selectedContext 
      ? `User has imported context from the ${selectedContext} module. Assume access to data and workflows relevant to ${selectedContext}.` 
      : "User is in the general dashboard.";
    
    if (isReasoningEnabled) {
      contextString += " EXTENDED REASONING ENABLED: Think deeply and consider all edge cases before answering.";
    }

    try {
      // Convert ChatMessage[] to the format expected by service (history)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text.replace('ALFRED: ', '') }] // Strip prefix for history
      }));

      const responseText = await generateChatResponse(history, input, contextString);
      
      const botMessage: ChatMessage = {
        role: 'model',
        text: `ALFRED: ${responseText}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "ALFRED: I'm having trouble connecting to the server right now. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-all z-50 flex items-center justify-center border border-white/20 overflow-hidden group"
        onClick={onMinimize}
        title="Open ALFRED"
      >
        {/* Mini galaxy effect in minimized state */}
        <div className="absolute inset-0 opacity-80 bg-black"></div>
        
        <div className="relative z-10">
          <Bot className="w-7 h-7 text-white drop-shadow-lg group-hover:text-green-400 transition-colors" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse z-10 shadow-[0_0_8px_rgba(74,222,128,0.8)] border border-indigo-900"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 duration-300 ring-1 ring-white/10 bg-black">
      
      {/* Galaxy Background - Now darker/black */}
      <div className="absolute inset-0 bg-black -z-10 overflow-hidden">
        {animationsEnabled && (
          <>
            <div className="stars opacity-50"></div>
            <div className="stars2 opacity-30"></div>
            {/* Nebulas - Subtle */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse duration-[10s]"></div>
          </>
        )}
      </div>

      {/* Header (Minimal & Integrated) */}
      <div className="p-3 flex items-center justify-between shrink-0 relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center shadow-lg ring-1 ring-white/10">
              <Bot className="w-5 h-5 text-green-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black shadow-[0_0_5px_#4ade80]"></div>
          </div>
        </div>

        {/* Window Controls inside Chat */}
        <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
          <button 
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={`p-1.5 rounded-full transition-colors ${animationsEnabled ? 'text-green-400 hover:text-green-300' : 'text-white/30 hover:text-white/70'}`}
            title={animationsEnabled ? "Pause Visuals" : "Resume Visuals"}
          >
            {animationsEnabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <div className="w-px h-3 bg-white/10 mx-1"></div>
          <button 
            onClick={onMinimize} 
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onClose} 
            className="p-1.5 text-white/50 hover:text-white hover:bg-red-500/30 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Area - 3D feel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin relative z-10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-lg backdrop-blur-md border ${
                msg.role === 'user'
                  ? 'bg-green-600/20 text-white rounded-tr-sm border-green-500/30'
                  : 'bg-white/5 text-slate-200 rounded-tl-sm border-white/10'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap drop-shadow-sm font-light">
                {msg.text.replace('ALFRED: ', '')}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 border border-white/10 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-0"></div>
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-150"></div>
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Glassmorphism */}
      <div className="p-3 bg-black/40 backdrop-blur-xl border-t border-white/10 relative z-20">
        {/* Active Context Badge */}
        {selectedContext && (
          <div className="absolute -top-8 left-4 px-3 py-1 bg-green-500/20 border border-green-500/30 backdrop-blur-md rounded-t-lg text-[10px] text-green-200 flex items-center gap-2 animate-in slide-in-from-bottom-2 shadow-lg">
            <Database className="w-3 h-3" />
            <span>{selectedContext}</span>
            <button onClick={() => setSelectedContext(null)} className="hover:text-white ml-1"><X className="w-3 h-3" /></button>
          </div>
        )}

        <div className="relative flex items-end gap-2">
          {/* Context Import Button */}
          <div className="relative" ref={contextMenuRef}>
             <button 
                onClick={() => setShowContextMenu(!showContextMenu)}
                className={`p-2.5 rounded-xl transition-all border ${
                  selectedContext 
                    ? 'bg-green-500/30 border-green-400 text-green-200' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Import Context from Modules"
             >
               {selectedContext ? <Check className="w-4 h-4" /> : <Import className="w-4 h-4" />}
             </button>

             {/* Context Menu Popup */}
             {showContextMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#0f172a] rounded-xl shadow-2xl border border-white/10 py-1 overflow-hidden z-50 animate-in zoom-in-95 duration-150">
                   <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 bg-white/5">
                     Import Data From
                   </div>
                   <div className="max-h-60 overflow-y-auto scrollbar-thin">
                     {MODULES.map((mod) => (
                       <button
                         key={mod.id}
                         onClick={() => {
                           setSelectedContext(mod.name);
                           setShowContextMenu(false);
                         }}
                         className={`w-full px-4 py-2 text-xs text-left flex items-center gap-3 hover:bg-white/10 transition-colors ${
                           selectedContext === mod.name ? 'text-green-400 bg-green-500/10 font-medium' : 'text-slate-400'
                         }`}
                       >
                         <mod.icon className="w-3.5 h-3.5 opacity-70" />
                         {mod.name}
                       </button>
                     ))}
                   </div>
                </div>
             )}
          </div>

          {/* Attachments Button */}
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10 rounded-xl transition-colors" title="Upload PDF or Image">
            <Paperclip className="w-4 h-4" />
          </button>
          
          {/* Reasoning Toggle */}
          <button 
            onClick={() => setIsReasoningEnabled(!isReasoningEnabled)}
            className={`p-2.5 rounded-xl transition-all border ${
               isReasoningEnabled
                 ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                 : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Deep Reasoning (Think Harder)"
          >
            <Brain className="w-4 h-4" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ALFRED..."
              rows={1}
              className="w-full pl-3 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all text-sm text-white placeholder:text-white/20 resize-none scrollbar-none"
              style={{ minHeight: '42px', maxHeight: '100px' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-1.5 bottom-1.5 p-1.5 rounded-lg transition-all ${
                input.trim() && !isLoading
                  ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/20'
                  : 'bg-transparent text-white/10 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;