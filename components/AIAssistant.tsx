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
  Pause,
  ImageIcon,
  Trash2
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
  
  // File Upload State
  const [attachment, setAttachment] = useState<{ data: string, mimeType: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract base64 data and mime type
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          setAttachment({
            mimeType: matches[1],
            data: matches[2]
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !attachment) return;

    const userMessage: ChatMessage = { 
        role: 'user', 
        text: attachment ? `${input} [Attached Image]` : input, 
        timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Capture current attachment and clear state
    const currentAttachment = attachment;
    setAttachment(null); 
    
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
        parts: [{ text: m.text.replace('ALFRED: ', '').replace(' [Attached Image]', '') }] 
      }));

      // Prepare image payload if exists
      const imagePayload = currentAttachment ? { inlineData: currentAttachment } : undefined;
      
      const responseText = await generateChatResponse(history, input, contextString, imagePayload);
      
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
        {/* Attachment Preview */}
        {attachment && (
          <div className="absolute bottom-full left-0 mb-2 ml-2 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-white/70">Image Attached</span>
            <button onClick={() => setAttachment(null)} className="p-1 hover:bg-white/20 rounded-full text-white/50 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="relative flex items-end gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center p-1 transition-all focus-within:bg-white/10 focus-within:border-green-500/30">
            <button 
              onClick={() => setShowContextMenu(!showContextMenu)}
              className={`p-2 rounded-xl transition-colors ${selectedContext ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="Add Context"
            >
              <Database className="w-5 h-5" />
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-xl transition-colors ${attachment ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              title="Attach Image"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isReasoningEnabled ? "Ask deeply..." : "Ask ALFRED..."}
              className="w-full bg-transparent border-none text-white placeholder-slate-500 px-3 py-2.5 focus:ring-0 resize-none h-[44px] max-h-[120px] scrollbar-hide text-sm"
              rows={1}
            />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!input.trim() && !attachment}
            className="p-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Context Menu */}
        {showContextMenu && (
          <div ref={contextMenuRef} className="absolute bottom-full left-2 mb-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-30">
             <div className="p-2 border-b border-white/5 text-xs font-bold text-slate-400 uppercase tracking-wider">Import Context</div>
             <div className="max-h-48 overflow-y-auto py-1">
               {MODULES.map((mod) => (
                 <button
                   key={mod.id}
                   onClick={() => { setSelectedContext(mod.id); setShowContextMenu(false); }}
                   className={`w-full px-3 py-2 text-left text-sm flex items-center gap-3 hover:bg-white/10 transition-colors ${selectedContext === mod.id ? 'text-green-400 bg-white/5' : 'text-slate-300'}`}
                 >
                   <mod.icon className="w-4 h-4" />
                   {mod.name}
                   {selectedContext === mod.id && <Check className="w-3 h-3 ml-auto" />}
                 </button>
               ))}
             </div>
             <div className="p-2 border-t border-white/5 bg-white/5">
                <button 
                  onClick={() => setIsReasoningEnabled(!isReasoningEnabled)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${isReasoningEnabled ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'}`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  Deep Reasoning {isReasoningEnabled ? 'ON' : 'OFF'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;