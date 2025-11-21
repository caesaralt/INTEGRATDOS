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
  Import
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
    { role: 'model', text: "Hello! I'm Albert, your Integratd Living assistant. I can help you manage your projects, quotes, and automation designs. Import a module context to get started specifically.", timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    const contextString = selectedContext 
      ? `User has imported context from the ${selectedContext} module. Please assume access to data and workflows relevant to ${selectedContext}.` 
      : "User is in the general dashboard.";

    try {
      // Convert ChatMessage[] to the format expected by service (history)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await generateChatResponse(history, input, contextString);
      
      const botMessage: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I'm having trouble connecting to the server right now. Please try again.",
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-700 to-green-900 text-white p-4 rounded-full shadow-xl cursor-pointer hover:scale-105 transition-all z-50 flex items-center gap-3 border border-green-500/30"
        onClick={onMinimize}
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
        </div>
        <span className="font-semibold pr-2">Albert</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[450px] h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-10 duration-300 transition-colors">
      {/* Unified Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex items-center justify-between shadow-md shrink-0 relative overflow-hidden">
        {/* Background subtle effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg ring-2 ring-white/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
              Albert
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase tracking-wider rounded-full border border-green-500/30 font-semibold">
                Online
              </span>
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              AI Assistant
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 relative z-10">
          {/* Import From Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowContextMenu(!showContextMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedContext 
                  ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                  : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Import className="w-3.5 h-3.5" />
              {selectedContext ? (
                <span className="max-w-[80px] truncate">{selectedContext}</span>
              ) : (
                "Import From"
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${showContextMenu ? 'rotate-180' : ''}`} />
            </button>

            {showContextMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                  Import Context
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {MODULES.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setSelectedContext(mod.name);
                        setShowContextMenu(false);
                        // Optional: Add a system message about context switch
                        setMessages(prev => [...prev, {
                          role: 'model',
                          text: `I've connected to the **${mod.name}**. I can now answer questions specifically related to that module.`,
                          timestamp: new Date()
                        }]);
                      }}
                      className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        selectedContext === mod.name 
                          ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-medium' 
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-1.5 rounded-md ${
                        selectedContext === mod.name 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        <mod.icon className="w-3.5 h-3.5" />
                      </div>
                      {mod.name}
                    </button>
                  ))}
                </div>
                {selectedContext && (
                  <div className="border-t border-slate-100 dark:border-slate-700 p-1">
                    <button 
                      onClick={() => {
                        setSelectedContext(null);
                        setShowContextMenu(false);
                      }}
                      className="w-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-1.5 rounded text-center transition-colors"
                    >
                      Clear Context
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Window Controls */}
          <div className="flex items-center bg-white/10 rounded-lg border border-white/10 p-0.5 ml-1">
            <button 
              onClick={onMinimize} 
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <div className="w-px h-3 bg-white/10 mx-0.5"></div>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-300 hover:text-white hover:bg-red-500/20 hover:text-red-300 rounded-md transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Context Indicator (Optional secondary strip, but keeping it clean inside chat or removing) */}
      {selectedContext && (
        <div className="bg-green-50 dark:bg-green-900/10 px-4 py-2 text-xs text-green-800 dark:text-green-300 flex items-center justify-between border-b border-green-100 dark:border-green-900/20">
          <span className="flex items-center gap-2 font-medium">
            <Database className="w-3 h-3" />
            Context Active: {selectedContext}
          </span>
          <button onClick={() => setSelectedContext(null)} className="hover:text-green-600 dark:hover:text-green-400"><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800/50 space-y-4 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
              }`}
            >
              {/* Simple Markdown-like rendering for bold text */}
              <p className="leading-relaxed whitespace-pre-wrap">
                {msg.text.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </p>
              <div className={`text-[10px] mt-1.5 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 font-medium">Albert is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="relative flex items-center gap-2">
          <button className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Albert anything..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all shadow-md ${
              input.trim() && !isLoading
                ? 'bg-slate-900 dark:bg-green-600 text-white hover:bg-slate-800 dark:hover:bg-green-700 hover:scale-105 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-slate-400 dark:text-slate-600">
            AI can make mistakes. Review generated results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;