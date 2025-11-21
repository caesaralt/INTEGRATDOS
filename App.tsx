import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  Zap, 
  Cpu, 
  Settings, 
  Brain, 
  ClipboardList, 
  Users, 
  ArrowLeft, 
  LogOut,
  UploadCloud,
  CheckSquare,
  Square,
  Plus,
  MoreVertical,
  Search,
  Edit2,
  Trash2,
  Lightbulb,
  Blinds,
  Lock,
  Thermometer,
  Speaker
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';

// --- Types ---
type ViewState = 'dashboard' | 'crm' | 'quotes' | 'canvas' | 'mapping' | 'board' | 'cad' | 'learning' | 'ops' | 'admin';

// --- Sub-components ---

const ModuleCard = ({ 
  title, 
  icon: Icon, 
  desc, 
  color, 
  onClick 
}: { 
  title: string; 
  icon: React.ElementType; 
  desc: string; 
  color: string;
  onClick: () => void;
}) => (
  <button 
    onClick={onClick}
    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all text-left border border-slate-100 group flex flex-col h-full"
  >
    <div className={`mb-6 p-4 rounded-2xl w-fit ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </button>
);

const Dashboard = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const modules = [
    { id: 'crm', title: 'CRM Dashboard', icon: LayoutDashboard, desc: 'Manage customers, projects, scheduling, inventory, and more in one place.', color: 'text-blue-600 bg-blue-600' },
    { id: 'quotes', title: 'Quote Automation', icon: FileText, desc: 'Upload floor plans and let AI generate accurate quotes automatically.', color: 'text-yellow-600 bg-yellow-600' },
    { id: 'canvas', title: 'Canvas Editor', icon: PenTool, desc: 'Professional floor plan editor with zoom, pan, and symbol management.', color: 'text-orange-600 bg-orange-600' },
    { id: 'mapping', title: 'Electrical Mapping', icon: Zap, desc: 'Professional electrical mapping with wiring, circuits, and component management.', color: 'text-amber-500 bg-amber-500' },
    { id: 'board', title: 'Loxone Board Builder', icon: Cpu, desc: 'Design professional Loxone boards with AI generation and integration.', color: 'text-slate-700 bg-slate-700' },
    { id: 'cad', title: 'Electrical CAD Designer', icon: Settings, desc: 'Professional-grade CAD drawings with AI generation and DXF export.', color: 'text-emerald-700 bg-emerald-700' },
    { id: 'learning', title: 'AI Learning', icon: Brain, desc: 'Train the system with examples to improve accuracy over time.', color: 'text-pink-600 bg-pink-600' },
    { id: 'ops', title: 'Operations Board', icon: ClipboardList, desc: 'Kanban task management system for team workflow and project tracking.', color: 'text-indigo-600 bg-indigo-600' },
    { id: 'admin', title: 'Admin Panel', icon: Users, desc: 'Manage users, assign permissions, and configure system access controls.', color: 'text-cyan-600 bg-cyan-600' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <ModuleCard 
            key={mod.id}
            title={mod.title}
            icon={mod.icon}
            desc={mod.desc}
            color={mod.color}
            onClick={() => onNavigate(mod.id as ViewState)}
          />
        ))}
      </div>
    </div>
  );
};

const QuoteAutomation = () => {
  const [projectName, setProjectName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const automationTypes = [
    { id: 'lighting', label: 'Lighting Control', icon: Lightbulb },
    { id: 'shading', label: 'Shading Control', icon: Blinds },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'climate', label: 'Climate Control', icon: Thermometer },
    { id: 'audio', label: 'Audio System', icon: Speaker },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <FileText size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">AI Floor Plan Analysis</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Floor Plan PDF</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="mx-auto w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Drop your floor plan here, or <span className="text-green-600">browse</span></h3>
                <p className="text-slate-500 mt-1">PDF files only (max 10MB)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Automation Types</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automationTypes.map((type) => {
                  const isSelected = selectedTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-green-500 bg-green-50 text-green-900' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <CheckSquare className="text-white w-3.5 h-3.5" />}
                      </div>
                      <type.icon className={`w-5 h-5 ${isSelected ? 'text-green-600' : 'text-slate-400'}`} />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pricing Tier</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none bg-slate-50">
                <option>Basic - Standard Components</option>
                <option>Premium - Advanced Components</option>
                <option>Luxury - High-end Components</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 flex justify-end">
          <button className="px-8 py-3 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg shadow-green-900/20 flex items-center gap-2">
            <Zap className="w-5 h-5 fill-current" />
            Generate Quote
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => (
  <div className="flex h-[calc(100vh-64px)] bg-slate-50 animate-in fade-in">
    {/* Sidebar */}
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Admin Panel
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl font-medium transition-colors">
          <Users className="w-5 h-5" />
          User Management
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
          <Lock className="w-5 h-5" />
          Permissions
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
          <ClipboardList className="w-5 h-5" />
          Activity Log
        </button>
      </nav>
    </div>

    {/* Content */}
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-500">Create and manage user accounts with role-based permissions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '1' },
            { label: 'Active Users', value: '1' },
            { label: 'Administrators', value: '1' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">All Users</h3>
            <button className="px-5 py-2.5 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Display Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">Admin</td>
                  <td className="px-6 py-4 text-slate-600">System Administrator</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">admin</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Active</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">21/11/2025</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAIMinimized, setIsAIMinimized] = useState(false);

  const renderView = () => {
    switch(currentView) {
      case 'quotes': return <QuoteAutomation />;
      case 'admin': return <AdminPanel />;
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold text-slate-500">Module Under Construction</h2>
            <p className="text-sm mt-2">Check back soon or ask Albert for updates.</p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="mt-6 px-4 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors font-medium"
            >
              Return Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          {currentView !== 'dashboard' && (
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-sm">IL</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">Integratd Living</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-green-700 tracking-wide uppercase">System Online</span>
          </div>
          <div className="w-px h-8 bg-slate-100 mx-2"></div>
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden">
        {renderView()}
      </main>

      {/* AI Assistant Integration */}
      <AIAssistant 
        isOpen={isAIOpen || isAIMinimized} 
        onClose={() => setIsAIOpen(false)} 
        onMinimize={() => setIsAIMinimized(!isAIMinimized)}
        isMinimized={isAIMinimized}
      />

      {/* Floating AI Button (When closed) */}
      {!isAIOpen && !isAIMinimized && (
        <button 
          onClick={() => { setIsAIOpen(true); setIsAIMinimized(false); }}
          className="fixed bottom-8 right-8 px-6 py-3.5 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-full shadow-xl shadow-green-900/30 flex items-center gap-2.5 font-bold transition-all hover:scale-105 hover:from-green-600 hover:to-green-700 z-50 ring-4 ring-white/20 backdrop-blur-sm"
        >
          <Brain size={20} className="fill-current" />
          AI Assistant
        </button>
      )}
    </div>
  );
}