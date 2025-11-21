import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  Minimize2, 
  Bot, 
  Paperclip, 
  ChevronDown, 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  Zap, 
  Cpu, 
  Settings, 
  Users, 
  ClipboardList,
  Database,
  Import,
  Brain,
  Play,
  Pause,
  ImageIcon,
  File
} from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-4 rounded-full shadow-xl cursor-pointer hover:scale-105 transition-all z-50 flex items-center gap-3 border border-purple-500/50 overflow-hidden"
        onClick={onMinimize}
      >
        {/* Mini galaxy effect in minimized state */}
        <div className="absolute inset-0 opacity-50 galaxy-bg"></div>
        
        <div className="relative">
          <Bot className="w-6 h-6 relative z-10" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse z-10 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
        </div>
        <span className="font-semibold pr-2 relative z-10">ALFRED</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[450px] h-[650px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 duration-300 ring-1 ring-white/10">
      
      {/* Galaxy Background */}
      <div className="absolute inset-0 galaxy-bg -z-10">
        {animationsEnabled && (
          <>
            <div className="stars"></div>
            <div className="stars2"></div>
            {/* Nebulas */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse duration-[10s]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[80px] animate-pulse duration-[8s]"></div>
          </>
        )}
      </div>

      {/* Header (Minimal & Integrated) */}
      <div className="p-4 flex items-start justify-between shrink-0 relative z-20">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg ring-1 ring-white/30 backdrop-blur-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-wide drop-shadow-md">ALFRED</span>
            <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-medium">System Online</span>
          </div>
        </div>

        {/* Window Controls inside Chat */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className="p-1.5 text-white/50 hover:text-white/90 hover:bg-white/10 rounded-full transition-colors"
            title={animationsEnabled ? "Pause Animations" : "Play Animations"}
          >
            {animationsEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <div className="w-px h-3 bg-white/10 mx-1"></div>
          <button 
            onClick={onMinimize} 
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose} 
            className="p-1.5 text-white/70 hover:text-white hover:bg-red-500/30 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
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
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg backdrop-blur-sm border ${
                msg.role === 'user'
                  ? 'bg-indigo-600/80 text-white rounded-tr-sm border-indigo-400/30'
                  : 'glass-panel text-indigo-100 rounded-tl-sm'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap drop-shadow-sm">
                {msg.text.replace('ALFRED: ', '')}
              </p>
              <div className="text-[9px] mt-1.5 opacity-50 text-right uppercase tracking-widest">
                {msg.role === 'model' && <span className="float-left mr-2 font-bold text-indigo-300">ALFRED</span>}
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="glass-panel rounded-2xl rounded-tl-sm px-4 py-3 border border-white/10 flex items-center gap-2">
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-0"></div>
               <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Glassmorphism */}
      <div className="p-4 bg-black/20 backdrop-blur-md border-t border-white/10 relative z-20">
        {/* Active Context Badge */}
        {selectedContext && (
          <div className="absolute -top-8 left-4 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md rounded-t-lg text-[10px] text-indigo-200 flex items-center gap-2 animate-in slide-in-from-bottom-2">
            <Database className="w-3 h-3" />
            Connected to: <span className="font-bold text-white">{selectedContext}</span>
            <button onClick={() => setSelectedContext(null)} className="hover:text-white ml-1"><X className="w-3 h-3" /></button>
          </div>
        )}

        <div className="relative flex items-end gap-2">
          {/* Context Import Button */}
          <div className="relative" ref={contextMenuRef}>
             <button 
                onClick={() => setShowContextMenu(!showContextMenu)}
                className={`p-3 rounded-xl transition-all border ${
                  selectedContext 
                    ? 'bg-indigo-500/30 border-indigo-400 text-indigo-200' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Import Context from Modules"
             >
               <Import className="w-5 h-5" />
             </button>

             {/* Context Menu Popup */}
             {showContextMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0f172a]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-1 overflow-hidden z-50 animate-in zoom-in-95 duration-150">
                   <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                     Import Data From
                   </div>
                   <div className="max-h-64 overflow-y-auto scrollbar-thin">
                     {MODULES.map((mod) => (
                       <button
                         key={mod.id}
                         onClick={() => {
                           setSelectedContext(mod.name);
                           setShowContextMenu(false);
                           setMessages(prev => [...prev, {
                             role: 'model',
                             text: `ALFRED: I've established a secure link to the **${mod.name}** module. I'm ready to process data from that source.`,
                             timestamp: new Date()
                           }]);
                         }}
                         className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-white/5 transition-colors ${
                           selectedContext === mod.name ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300'
                         }`}
                       >
                         <mod.icon className="w-4 h-4 opacity-70" />
                         {mod.name}
                       </button>
                     ))}
                   </div>
                </div>
             )}
          </div>

          {/* Attachments Button (Visual Only) */}
          <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10 rounded-xl transition-colors" title="Upload PDF or Image">
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Reasoning Toggle */}
          <button 
            onClick={() => setIsReasoningEnabled(!isReasoningEnabled)}
            className={`p-3 rounded-xl transition-all border ${
               isReasoningEnabled
                 ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                 : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Extended Reasoning"
          >
            <Brain className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ALFRED..."
              rows={1}
              className="w-full pl-4 pr-12 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm text-white placeholder:text-white/30 resize-none scrollbar-none"
              style={{ minHeight: '46px', maxHeight: '100px' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-1.5 bottom-1.5 p-2 rounded-lg transition-all ${
                input.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;