import React, { useState, useEffect } from 'react';
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
  Speaker,
  Moon,
  Sun,
  ChevronRight,
  Briefcase,
  Folder,
  Calendar,
  Package,
  CreditCard,
  Menu
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';

// --- Types ---
type ViewState = 'dashboard' | 'crm' | 'quotes' | 'canvas' | 'mapping' | 'board' | 'cad' | 'learning' | 'ops' | 'admin';

// --- Sub-components ---

interface ModuleCardProps {
  title: string;
  icon: React.ElementType;
  desc: string;
  color: string;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  icon: Icon, 
  desc, 
  color, 
  onClick 
}) => (
  <button 
    onClick={onClick}
    className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left border border-slate-100 dark:border-slate-700 group flex flex-col h-full relative overflow-hidden"
  >
    {/* Subtle background glow */}
    <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('text-', 'bg-').replace('bg-', 'text-')} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-opacity group-hover:opacity-10`}></div>

    <div className={`mb-6 p-4 rounded-2xl w-fit ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{desc}</p>
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

const CRMDashboard = () => {
  const navItems = [
    { id: 'people', label: 'People', icon: Users, sub: ['Clients', 'Team', 'Contractors'] },
    { id: 'quotes', label: 'Quotes', icon: FileText, sub: ['New Quote', 'Drafts', 'Pending', 'Approved'] },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, sub: ['Active Jobs', 'Scheduled', 'Completed'] },
    { id: 'projects', label: 'Projects', icon: Folder, sub: ['Planning', 'In Progress', 'Review'] },
    { id: 'schedules', label: 'Schedules', icon: Calendar, sub: ['Calendar', 'Timeline', 'Shifts'] },
    { id: 'stock', label: 'Stock', icon: Package, sub: ['Inventory', 'Orders', 'Suppliers'] },
    { id: 'payments', label: 'Payments', icon: CreditCard, sub: ['Invoices', 'Expenses', 'Reports'] },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Navy Blue Sidebar */}
      <div className="w-72 bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl z-20 relative shrink-0">
        <div className="p-6 pb-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Main Menu</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id} className="group relative">
                <button className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200 group-hover:shadow-lg border border-transparent hover:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
                
                {/* Hover Submenu */}
                <div className="absolute left-full top-0 ml-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block animate-in fade-in slide-in-from-left-2 duration-200 z-50">
                   {item.sub.map((subItem) => (
                     <div key={subItem} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                       {subItem}
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
               JD
             </div>
             <div>
               <div className="text-sm font-bold text-white">John Doe</div>
               <div className="text-xs text-slate-400">Admin</div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Apple-esque Minimalist */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
            </div>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300">
              Customize View
            </button>
          </div>

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: 'Total Revenue', value: '$128,450', change: '+12.5%', trend: 'up' },
               { label: 'Active Projects', value: '14', change: '+2', trend: 'up' },
               { label: 'Pending Quotes', value: '8', change: '-1', trend: 'down' },
               { label: 'Team Availability', value: '85%', change: 'Normal', trend: 'neutral' },
             ].map((stat, i) => (
               <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{stat.label}</div>
                 <div className="flex items-baseline gap-3">
                   <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                   <div className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                     stat.trend === 'up' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                     stat.trend === 'down' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                     'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                   }`}>
                     {stat.change}
                   </div>
                 </div>
               </div>
             ))}
          </div>

          {/* Recent Activity Table (Placeholder) */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Projects</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Project Name</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {[1, 2, 3, 4].map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium">Smart Home Upgrade {i+1}</td>
                    <td className="px-6 py-4">John Smith</td>
                    <td className="px-6 py-4"><span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full text-xs font-bold">In Progress</span></td>
                    <td className="px-6 py-4 opacity-70">Nov {24 + i}, 2025</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Floor Plan Analysis</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Upload your PDF to generate an automated quote</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-slate-50 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Floor Plan PDF</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className="mx-auto w-16 h-16 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Drop your floor plan here, or <span className="text-green-600 dark:text-green-400">browse</span></h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">PDF files only (max 10MB)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Select Automation Types</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automationTypes.map((type) => {
                  const isSelected = selectedTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 shadow-sm' 
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-green-200 dark:hover:border-green-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-500 bg-transparent'
                      }`}>
                        {isSelected && <CheckSquare className="text-white w-4 h-4" />}
                      </div>
                      <type.icon className={`w-5 h-5 ${isSelected ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pricing Tier</label>
              <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none bg-slate-50 dark:bg-slate-900 dark:text-white appearance-none">
                <option>Basic - Standard Components</option>
                <option>Premium - Advanced Components</option>
                <option>Luxury - High-end Components</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end border-t border-slate-100 dark:border-slate-700">
          <button className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2">
            <Zap className="w-5 h-5 fill-current" />
            Generate Quote
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => (
  <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 animate-in fade-in">
    {/* Sidebar */}
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Admin Panel
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-medium transition-colors">
          <Users className="w-5 h-5" />
          User Management
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">
          <Lock className="w-5 h-5" />
          Permissions
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">
          <ClipboardList className="w-5 h-5" />
          Activity Log
        </button>
      </nav>
    </div>

    {/* Content */}
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Create and manage user accounts with role-based permissions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '1' },
            { label: 'Active Users', value: '1' },
            { label: 'Administrators', value: '1' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">All Users</h3>
            <button className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Display Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Admin</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">System Administrator</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-bold">admin</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold">Active</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">21/11/2025</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 dark:text-red-400 transition-colors">
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderView = () => {
    switch(currentView) {
      case 'crm': return <CRMDashboard />;
      case 'quotes': return <QuoteAutomation />;
      case 'admin': return <AdminPanel />;
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 dark:text-slate-500">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold text-slate-500 dark:text-slate-400">Module Under Construction</h2>
            <p className="text-sm mt-2">Check back soon or ask Albert for updates.</p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="mt-6 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Return Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          {currentView !== 'dashboard' && (
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-600/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-sm">IL</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">Integratd Living</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-green-700 dark:text-green-400 tracking-wide uppercase">System Online</span>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2"></div>
          
          <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
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