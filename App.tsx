import React, { useState, useEffect, useRef } from 'react';
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
  Calendar as CalendarIcon,
  Package,
  CreditCard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Truck,
  Contact,
  HardHat,
  UserCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  MapPin,
  Filter,
  Download,
  ExternalLink,
  MousePointer2,
  Move,
  Minus,
  RotateCw,
  Sparkles,
  X,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Save,
  Share2,
  Layers,
  Grid,
  Eye,
  FileDown,
  ImageIcon,
  Calculator,
  Wrench
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import { User, UserRole, CanvasItem } from './types';
import { analyzeFloorplan } from './services/geminiService';

// --- Types ---
type ViewState = 'dashboard' | 'crm' | 'quotes' | 'canvas' | 'mapping' | 'board' | 'cad' | 'learning' | 'ops' | 'admin';

// --- Constants ---
const SYMBOLS = [
  { id: 'light', label: 'Light', icon: Lightbulb, cost: 120, color: 'bg-yellow-500' },
  { id: 'sensor', label: 'Sensor', icon: Zap, cost: 180, color: 'bg-blue-500' },
  { id: 'shade', label: 'Shade', icon: Blinds, cost: 450, color: 'bg-orange-500' },
  { id: 'speaker', label: 'Speaker', icon: Speaker, cost: 250, color: 'bg-purple-500' },
  { id: 'cam', label: 'Camera', icon: Lock, cost: 350, color: 'bg-red-500' },
];

// --- Helper Components ---

// Generic Modal for CRM Items
const ItemModal = ({ isOpen, onClose, title, fields, onSave, initialData }: any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-[600px] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6">
           {fields.map((field: any, idx: number) => (
             <div key={idx}>
               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wide">{field.label}</label>
               {field.type === 'select' ? (
                 <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-700 dark:text-slate-200">
                   {field.options.map((opt: string) => <option key={opt}>{opt}</option>)}
                 </select>
               ) : field.type === 'textarea' ? (
                 <textarea className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-700 dark:text-slate-200 min-h-[100px]" placeholder={field.placeholder} defaultValue={initialData?.[field.key]} />
               ) : (
                 <input type={field.type || 'text'} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-700 dark:text-slate-200" placeholder={field.placeholder} defaultValue={initialData?.[field.key]} />
               )}
             </div>
           ))}
           
           {/* Cross Linking Section */}
           <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
             <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <ExternalLink size={14} /> Linked Items
             </h4>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Link to Project</label>
                 <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm">
                   <option>Select Project...</option>
                   <option>Smith Residence</option>
                   <option>Acme Office HQ</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Link to Quote</label>
                 <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm">
                   <option>Select Quote...</option>
                   <option>Q-2024-001</option>
                   <option>Q-2024-002</option>
                 </select>
               </div>
             </div>
           </div>
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={onSave} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// Minimalist Stat Card (Clickable)
const StatCard = ({ title, value, trend, icon: Icon, onClick, active }: { title: string, value: string, trend?: string, icon: any, onClick: () => void, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-2xl border transition-all duration-300 text-left w-full group relative overflow-hidden ${
      active 
        ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' 
        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg'
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${active ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-700'} transition-colors`}>
        <Icon size={20} className={active ? 'text-white' : 'text-slate-600 dark:text-slate-300'} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trend.startsWith('+') 
            ? (active ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-600') 
            : (active ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-600')
        }`}>
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className={`text-sm font-medium ${active ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{title}</h3>
      <p className={`text-2xl font-bold tracking-tight ${active ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{value}</p>
    </div>
  </button>
);

// Custom SVG Charts
const RevenueChart = () => {
  const data = [10, 25, 15, 35, 20, 45, 30, 55, 40, 70];
  const width = 600;
  const height = 200;
  const max = 80;
  const step = width / (data.length - 1);
  
  const points = data.map((d, i) => `${i * step},${height - (d / max) * height}`).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="w-full h-64 relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
         <defs>
           <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
             <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
           </linearGradient>
         </defs>
         {[0.2, 0.4, 0.6, 0.8].map(p => (
           <line key={p} x1="0" y1={height * p} x2={width} y2={height * p} stroke="currentColor" strokeOpacity="0.05" />
         ))}
         <path d={areaPoints} fill="url(#grad1)" />
         <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
         {data.map((d, i) => (
           <g key={i} className="group">
             <circle cx={i * step} cy={height - (d / max) * height} r="6" className="fill-white stroke-blue-500 stroke-2 opacity-0 group-hover:opacity-100 transition-opacity" />
             <foreignObject x={i * step - 20} y={height - (d / max) * height - 40} width="40" height="30" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-800 text-white text-xs rounded px-1 py-0.5 text-center shadow-lg">${d}k</div>
             </foreignObject>
           </g>
         ))}
      </svg>
    </div>
  );
};

const ProjectsChart = () => {
  const data = [
    { label: 'Planning', value: 30, color: '#f59e0b' },
    { label: 'Active', value: 45, color: '#3b82f6' },
    { label: 'Review', value: 25, color: '#10b981' }
  ];
  
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumPercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex justify-center items-center h-64 gap-8">
       <div className="w-40 h-40 relative">
         <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
            {data.map((slice, i) => {
              const startPercent = cumPercent;
              const slicePercent = slice.value / total;
              cumPercent += slicePercent;
              
              const [startX, startY] = getCoordinatesForPercent(startPercent);
              const [endX, endY] = getCoordinatesForPercent(cumPercent);
              const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
              
              const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
              
              return (
                <path 
                  key={i} 
                  d={pathData} 
                  fill={slice.color} 
                  className="hover:opacity-90 transition-opacity cursor-pointer stroke-white dark:stroke-slate-900 stroke-[0.02]" 
                />
              );
            })}
            <circle r="0.6" fill="currentColor" className="text-white dark:text-slate-900" />
         </svg>
       </div>
       <div className="space-y-2">
         {data.map((d, i) => (
           <div key={i} className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
             <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{d.label}</span>
             <span className="text-sm font-bold text-slate-900 dark:text-white">{d.value}%</span>
           </div>
         ))}
       </div>
    </div>
  );
};

const TeamChart = () => {
  const data = [60, 85, 45, 90, 70];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  return (
    <div className="w-full h-64 flex items-end justify-between gap-4 pt-8 pb-2">
       {data.map((h, i) => (
         <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
            <div className="w-full bg-indigo-500 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all relative" style={{ height: `${h}%` }}>
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                 {h}%
               </div>
            </div>
            <span className="text-xs font-medium text-slate-500 mt-2">{labels[i]}</span>
         </div>
       ))}
    </div>
  );
};

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

// --- CRM Sub-Views ---

// Generic list item component for consistent look
const ListItem = ({ title, subtitle, badge, badgeColor, onDelete, onEdit }: any) => (
  <div className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-sm">
        {title.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {badge && (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor || 'bg-slate-100 text-slate-600'}`}>
          {badge}
        </span>
      )}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
      </div>
    </div>
  </div>
);

const PeopleView = ({ searchQuery, subCategory }: { searchQuery: string, subCategory?: string }) => {
  const [people, setPeople] = useState([
    { id: 1, name: 'John Doe', role: 'Customer', company: 'Acme Corp', contact: 'john@acme.com', phone: '555-0123', address: '123 Main St' },
    { id: 2, name: 'Sarah Smith', role: 'Employee', company: 'Integratd Living', contact: 'sarah@integratd.com', phone: '555-0124', address: '456 Tech Blvd' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filterRole = subCategory === 'All' || !subCategory ? '' : subCategory?.slice(0, -1);
  const filteredPeople = people.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterRole || p.role.includes(filterRole) || (filterRole === 'Contact' && true);
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (p: any) => {
    setEditItem(p);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const savePerson = () => {
    if (editItem) {
      // Logic to update would go here
    } else {
      // Logic to add new
      setPeople([...people, { id: Date.now(), name: 'New User', role: 'Contact', company: 'New Co', contact: 'email@new.com', phone: '', address: '' }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'People Directory'}</h2>
          <p className="text-slate-500 text-sm">Manage your {subCategory?.toLowerCase() || 'contacts'}</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
          <Plus size={18} /> Add {filterRole || 'Person'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredPeople.length > 0 ? filteredPeople.map((p) => (
          <ListItem 
            key={p.id}
            title={p.name}
            subtitle={`${p.company} • ${p.contact}`}
            badge={p.role}
            badgeColor="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            onDelete={() => setPeople(people.filter(x => x.id !== p.id))}
            onEdit={() => handleEdit(p)}
          />
        )) : (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400">
            No {subCategory?.toLowerCase()} found. Click "Add" to create one.
          </div>
        )}
      </div>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editItem ? "Edit Person" : "Add New Person"}
        onSave={savePerson}
        initialData={editItem}
        fields={[
          { label: 'Full Name', key: 'name', placeholder: 'e.g. John Doe' },
          { label: 'Company', key: 'company', placeholder: 'e.g. Acme Corp' },
          { label: 'Email Address', key: 'contact', placeholder: 'e.g. john@example.com' },
          { label: 'Phone Number', key: 'phone', placeholder: 'e.g. 555-0123' },
          { label: 'Role', key: 'role', type: 'select', options: ['Customer', 'Employee', 'Supplier', 'Contractor', 'Contact'] },
          { label: 'Notes', key: 'notes', type: 'textarea', placeholder: 'Additional details...' }
        ]}
      />
    </div>
  );
};

const QuotesView = ({ searchQuery, subCategory }: { searchQuery: string, subCategory?: string }) => {
  const [quotes, setQuotes] = useState([
    { id: 1, title: 'Smart Home Upgrade', client: 'Smith Residence', amount: '$14,250', status: 'Open' },
    { id: 2, title: 'Lighting Retrofit', client: 'Jones Office', amount: '$5,500', status: 'Sent' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filterStatus = subCategory === 'Supplier Quotes' ? 'Supplier' : subCategory;
  const filtered = quotes.filter(q => !filterStatus || q.status === filterStatus);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'All Quotes'}</h2>
           <p className="text-slate-500 text-sm">Track and manage your quotes</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg shadow-yellow-600/20 transition-all">
          <Plus size={18} /> Create Quote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((q) => (
          <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600 dark:text-yellow-500">
                <FileText size={20} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                q.status === 'Open' ? 'bg-green-100 text-green-700' : 
                q.status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {q.status}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{q.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Client: {q.client}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">{q.amount}</span>
              <div className="flex gap-2">
                 <button onClick={() => setQuotes(quotes.filter(x => x.id !== q.id))} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                 <button onClick={() => setIsModalOpen(true)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create / Edit Quote"
        onSave={() => setIsModalOpen(false)}
        fields={[
          { label: 'Project Title', key: 'title', placeholder: 'e.g. Main Residence Automation' },
          { label: 'Client Name', key: 'client', placeholder: 'e.g. Smith Family' },
          { label: 'Total Amount', key: 'amount', type: 'number', placeholder: '0.00' },
          { label: 'Status', key: 'status', type: 'select', options: ['Draft', 'Open', 'Sent', 'Approved', 'Expired'] },
          { label: 'Quote Details', key: 'details', type: 'textarea', placeholder: 'Scope of work...' }
        ]}
      />
    </div>
  );
};

const ProjectsView = ({ searchQuery, subCategory }: { searchQuery: string, subCategory?: string }) => {
  const [projects, setProjects] = useState([
    { id: 1, title: 'Smith Residence', client: 'John Smith', status: 'Active', completion: 65, deadline: 'Dec 20, 2024' },
    { id: 2, title: 'Acme HQ Automation', client: 'Acme Corp', status: 'Planning', completion: 15, deadline: 'Jan 15, 2025' },
    { id: 3, title: 'Westside Apartments', client: 'Westside Dev', status: 'Review', completion: 95, deadline: 'Nov 30, 2024' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !subCategory || p.status === subCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'All Projects'}</h2>
          <p className="text-slate-500 text-sm">Manage your ongoing installations</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Folder size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{p.title}</h3>
                  <p className="text-xs text-slate-500">{p.client}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                p.status === 'Active' ? 'bg-blue-100 text-blue-700' : 
                p.status === 'Planning' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
              }`}>
                {p.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Progress</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{p.completion}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${p.completion}%` }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={14} />
                <span>Due: {p.deadline}</span>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Project"
        onSave={() => setIsModalOpen(false)}
        fields={[
          { label: 'Project Title', key: 'title', placeholder: 'e.g. Downtown Office' },
          { label: 'Client', key: 'client', placeholder: 'Client Name' },
          { label: 'Status', key: 'status', type: 'select', options: ['Planning', 'Active', 'Review', 'Archived'] },
          { label: 'Deadline', key: 'deadline', type: 'date' },
          { label: 'Description', key: 'desc', type: 'textarea' }
        ]}
      />
    </div>
  );
};

const JobsView = ({ subCategory }: { subCategory?: string }) => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Living Room Automation', status: 'In Progress', due: 'Tomorrow', notes: 'Finish wiring' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'Jobs'}</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          <Plus size={18} /> New Job
        </button>
      </div>
      <div className="grid gap-3">
        {jobs.map(job => (
          <ListItem 
             key={job.id}
             title={job.title}
             subtitle={`Due: ${job.due}`}
             badge={job.status}
             badgeColor="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
             onDelete={() => setJobs(jobs.filter(j => j.id !== job.id))}
             onEdit={() => setIsModalOpen(true)}
          />
        ))}
      </div>
      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manage Job"
        onSave={() => setIsModalOpen(false)}
        fields={[
          { label: 'Job Title', key: 'title' },
          { label: 'Due Date', key: 'due', type: 'date' },
          { label: 'Status', key: 'status', type: 'select', options: ['Pending', 'In Progress', 'Finished'] },
          { label: 'Description', key: 'notes', type: 'textarea' }
        ]}
      />
    </div>
  );
};

const CalendarView = ({ subCategory }: { subCategory?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'Schedule'}</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
          <Plus size={18} /> Add Event
        </button>
      </div>
      {/* Simplified Calendar Visual */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 overflow-hidden">
         <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-500">{day}</div>
            ))}
            {Array.from({length: 35}).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-2 relative hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group border-b border-r border-slate-50 dark:border-slate-800">
                <span className={`text-xs ${i === 14 ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>{i + 1}</span>
              </div>
            ))}
         </div>
      </div>
      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Event"
        onSave={() => setIsModalOpen(false)}
        fields={[
          { label: 'Event Title', key: 'title' },
          { label: 'Date', key: 'date', type: 'date' },
          { label: 'Type', key: 'type', type: 'select', options: ['Meeting', 'Install', 'Service Call'] },
          { label: 'Details', key: 'details', type: 'textarea' }
        ]}
      />
    </div>
  );
};

const MaterialsView = ({ subCategory }: { subCategory?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'Inventory'}</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
          <Plus size={18} /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="h-32 bg-slate-100 dark:bg-slate-700 relative flex items-center justify-center">
                <Package className="text-slate-300 dark:text-slate-600 w-12 h-12" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Item #{i}</h3>
                <div className="mt-4 flex gap-2">
                   <button onClick={() => setIsModalOpen(true)} className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-xs font-bold">Edit</button>
                   <button className="flex-1 py-1.5 text-red-500 rounded text-xs font-bold">Delete</button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manage Stock Item"
        onSave={() => setIsModalOpen(false)}
        fields={[
          { label: 'Item Name', key: 'name' },
          { label: 'SKU', key: 'sku' },
          { label: 'Quantity', key: 'qty', type: 'number' },
          { label: 'Location', key: 'location', type: 'select', options: ['Sydney', 'Melbourne'] }
        ]}
      />
    </div>
  );
};

const PaymentsView = ({ subCategory }: { subCategory?: string }) => {
  const [direction, setDirection] = useState<'inbound' | 'outbound'>('inbound');
  const [showAddModal, setShowAddModal] = useState(false);
  const [invoices, setInvoices] = useState([
    { id: 1, ref: 'INV-2024-001', entity: 'Smith Residence', amount: '$12,500', date: 'Due Nov 25', status: 'Due', dir: 'inbound' },
    { id: 2, ref: 'INV-2024-002', entity: 'Jones Office', amount: '$4,200', date: 'Paid Oct 12', status: 'Paid', dir: 'inbound' },
  ]);

  const filterStatus = subCategory && !['Payments', 'To Us', 'To Suppliers'].includes(subCategory) ? subCategory : null;
  
  const filtered = invoices.filter(inv => {
    const dirMatch = inv.dir === direction;
    const statusMatch = filterStatus ? inv.status === filterStatus : true;
    return dirMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'Payments'}</h2>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
          <Plus size={18} /> New Invoice
        </button>
      </div>

      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button 
          onClick={() => setDirection('inbound')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${direction === 'inbound' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
        >
          To Us (Inbound)
        </button>
        <button 
          onClick={() => setDirection('outbound')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${direction === 'outbound' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
        >
          To Suppliers (Outbound)
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(inv => (
          <ListItem 
            key={inv.id}
            title={inv.ref} 
            subtitle={`${inv.entity} • ${inv.date} • ${inv.amount}`} 
            badge={inv.status} 
            badgeColor={inv.status === 'Paid' ? 'bg-green-100 text-green-600' : inv.status === 'Due' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'} 
            onDelete={() => setInvoices(invoices.filter(i => i.id !== inv.id))} 
            onEdit={() => setShowAddModal(true)} 
          />
        ))}
      </div>

      <ItemModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="New Invoice"
        onSave={() => setShowAddModal(false)}
        fields={[
           { label: 'Invoice Ref', key: 'ref' },
           { label: 'Amount', key: 'amount', type: 'number' },
           { label: 'Due Date', key: 'date', type: 'date' },
           { label: 'Status', key: 'status', type: 'select', options: ['Draft', 'Pending', 'Due', 'Paid'] }
        ]}
      />
    </div>
  );
};

const CRMDashboard = ({ searchQuery }: { searchQuery: string }) => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [subCategory, setSubCategory] = useState<string | undefined>(undefined);
  const [analyticsType, setAnalyticsType] = useState<string | null>(null);

  const navItems = [
    { id: 'people', label: 'People', icon: Users, sub: ['Employees', 'Customers', 'Suppliers', 'Contractors', 'Contacts'] },
    { id: 'quotes', label: 'Quotes', icon: FileText, sub: ['Open', 'Expired', 'Sent', 'Supplier Quotes'] },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, sub: ['In Progress', 'Upcoming', 'Pending', 'Finished', 'Recurring'] },
    { id: 'projects', label: 'Projects', icon: Folder, sub: ['Planning', 'Active', 'Review', 'Archived'] },
    { id: 'schedules', label: 'Schedules', icon: CalendarIcon, sub: ['Calendar', 'Timeline', 'Shifts'] },
    { id: 'stock', label: 'Materials', icon: Package, sub: ['Stock', 'Orders', 'Suppliers'] },
    { id: 'payments', label: 'Payments', icon: CreditCard, sub: ['Upcoming', 'Pending', 'Due', 'Paid', 'Credits', 'Retentions'] },
  ];

  const handleNavClick = (viewId: string, sub?: string) => {
    setActiveView(viewId);
    setSubCategory(sub);
    setAnalyticsType(null);
  };

  const renderContent = () => {
    if (analyticsType) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <button onClick={() => setAnalyticsType(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors">
             <ArrowLeft size={18} /> Back to Overview
           </button>
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{analyticsType} Analytics</h2>
             {analyticsType === 'Revenue' && <RevenueChart />}
             {analyticsType === 'Projects' && <ProjectsChart />}
             {analyticsType === 'Team' && <TeamChart />}
             {analyticsType === 'Quotes' && <div className="h-64 flex items-center justify-center text-slate-400">Quote Pipeline Chart Component</div>}
           </div>
        </div>
      );
    }

    switch(activeView) {
      case 'people': return <PeopleView searchQuery={searchQuery} subCategory={subCategory} />;
      case 'quotes': return <QuotesView searchQuery={searchQuery} subCategory={subCategory} />;
      case 'jobs': return <JobsView subCategory={subCategory} />;
      case 'projects': return <ProjectsView searchQuery={searchQuery} subCategory={subCategory} />;
      case 'schedules': return <CalendarView subCategory={subCategory} />;
      case 'stock': return <MaterialsView subCategory={subCategory} />;
      case 'payments': return <PaymentsView subCategory={subCategory} />;
      default: 
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, here's what's happening today.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <StatCard title="Revenue" value="$128.5k" trend="+12.5%" icon={DollarSign} onClick={() => setAnalyticsType('Revenue')} />
               <StatCard title="Active Projects" value="14" trend="+2" icon={Folder} onClick={() => setAnalyticsType('Projects')} />
               <StatCard title="Pending Quotes" value="8" icon={FileText} onClick={() => setAnalyticsType('Quotes')} />
               <StatCard title="Availability" value="85%" trend="-5%" icon={Clock} onClick={() => setAnalyticsType('Team')} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col relative shrink-0 z-50" style={{ overflow: 'visible' }}>
        <div className="p-4 pb-0 flex-1 flex flex-col">
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 pl-3">Main Menu</h2>
          <div className="space-y-0.5">
            <button onClick={() => handleNavClick('overview')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 ${activeView === 'overview' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : ''}`}>
               <div className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /><span className="text-sm">Overview</span></div>
            </button>
            {navItems.map((item) => (
              <div key={item.id} className="group relative">
                <button onClick={() => handleNavClick(item.id)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 ${activeView === item.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : ''}`}>
                  <div className="flex items-center gap-3"><item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" /><span className="text-sm">{item.label}</span></div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
                {/* Bridge to prevent mousegap */}
                <div className="absolute left-full top-0 h-full w-4 bg-transparent"></div>
                
                <div className="absolute left-[calc(100%+8px)] top-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 hidden group-hover:block animate-in fade-in slide-in-from-left-1 duration-200 z-[60]">
                   <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800 mb-1">{item.label}</div>
                   {item.sub.map((subItem) => (
                     <button key={subItem} onClick={(e) => { e.stopPropagation(); handleNavClick(item.id, subItem); }} className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between">
                       {subItem}
                     </button>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
        <div className="max-w-7xl mx-auto">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

const CanvasEditor = ({ project, onClose, initialItems = [], embedded = false, backgroundImage }: { project: string, onClose?: () => void, initialItems?: CanvasItem[], embedded?: boolean, backgroundImage?: string | null }) => {
  const [items, setItems] = useState<CanvasItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialItems.length > 0) setItems(initialItems);
  }, [initialItems]);

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / (zoom / 100); 
      const y = (e.clientY - rect.top) / (zoom / 100);
      const symbol = SYMBOLS.find(s => s.id === type);
      setItems([...items, { 
        id: Date.now().toString(), 
        type: type as any, 
        x, 
        y, 
        label: symbol?.label || 'Item', 
        cost: symbol?.cost || 0 
      }]);
    }
  };

  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedItem && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      setItems(prev => prev.map(item => {
        if (item.id === draggedItem) {
           return {
             ...item,
             x: (e.clientX - rect.left - 20) / scale, 
             y: (e.clientY - rect.top - 20) / scale
           };
        }
        return item;
      }));
    }
  };

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

  const containerClasses = embedded 
    ? "relative w-full h-[600px] flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden my-6 bg-slate-50 dark:bg-slate-900"
    : "fixed inset-0 bg-slate-100 dark:bg-slate-950 z-[60] flex flex-col text-slate-900 dark:text-white";

  return (
    <div className={containerClasses}>
      {/* Header / Toolbar */}
      <div className={`${embedded ? 'h-12 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3' : 'h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4'} flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-4">
           {!embedded && onClose && (
             <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
               <ArrowLeft size={18} />
             </button>
           )}
           {!embedded && (
             <div>
               <h2 className="font-bold text-sm">{project}</h2>
               <div className="text-xs text-slate-500">Canvas Editor v2.0</div>
             </div>
           )}
           
           {/* Embedded Toolbar - Symbols */}
           {embedded && (
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase mr-2">Add Symbol:</span>
                {SYMBOLS.map(sym => (
                  <div 
                    key={sym.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('type', sym.id)}
                    className="w-8 h-8 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center cursor-grab hover:border-blue-500 hover:scale-105 transition-all shadow-sm"
                    title={sym.label}
                  >
                    <sym.icon size={16} className={`${sym.color.replace('bg-', 'text-')}`} />
                  </div>
                ))}
             </div>
           )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600 shadow-sm">
             <span className="text-[10px] font-bold uppercase text-slate-400 px-1">Zoom:</span>
             <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"><ZoomOut size={14} /></button>
             <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"><ZoomIn size={14} /></button>
             <button onClick={() => setZoom(100)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"><Maximize size={14} /></button>
          </div>
          
          {embedded && (
             <button 
               onClick={() => { if(selectedItem) setItems(items.filter(i => i.id !== selectedItem)) }}
               disabled={!selectedItem}
               className="px-3 py-1.5 text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Trash2 size={14} /> Delete
             </button>
          )}

          {!embedded && (
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">Total Cost</div>
                <div className="font-bold text-green-600 text-lg">${totalCost.toLocaleString()}</div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
                <Save size={16} /> Save
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar (Only if not embedded) */}
        {!embedded && (
          <div className="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 gap-4 shrink-0">
             <button className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><MousePointer2 size={20} /></button>
             <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"><Move size={20} /></button>
             <div className="h-px w-8 bg-slate-200 dark:bg-slate-700 my-1"></div>
             {SYMBOLS.map(sym => (
               <div 
                 key={sym.id}
                 draggable
                 onDragStart={(e) => e.dataTransfer.setData('type', sym.id)}
                 className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-grab group relative"
               >
                 <sym.icon size={20} className="text-slate-600 dark:text-slate-400" />
               </div>
             ))}
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 bg-slate-200/50 dark:bg-slate-950/50 relative overflow-hidden flex items-center justify-center">
           <div 
              ref={canvasRef}
              className="w-[2000px] h-[2000px] bg-white dark:bg-[#0B1120] shadow-2xl relative overflow-hidden cursor-crosshair"
              style={{ 
                transform: `scale(${zoom / 100})`, 
                transformOrigin: 'center center',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: backgroundImage ? 'contain' : '40px 40px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, e.dataTransfer.getData('type'))}
              onMouseMove={onCanvasMouseMove}
              onMouseUp={() => setDraggedItem(null)}
              onClick={() => setSelectedItem(null)}
           >
              {/* Items */}
              {items.map(item => (
                 <div
                   key={item.id}
                   style={{ left: item.x, top: item.y }}
                   className={`absolute p-3 rounded-full shadow-lg cursor-move group transition-transform ${
                     selectedItem === item.id 
                       ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/50 z-20' 
                       : 'bg-white dark:bg-slate-800 hover:scale-110 z-10'
                   }`}
                   onMouseDown={(e) => { e.stopPropagation(); setDraggedItem(item.id); setSelectedItem(item.id); }}
                 >
                   <Zap size={24} className={selectedItem === item.id ? 'text-blue-600' : 'text-slate-700 dark:text-slate-200'} />
                   <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black/75 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                     {item.label}
                   </span>
                 </div>
              ))}
              {!backgroundImage && items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                  <div className="text-center">
                    <UploadCloud size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <h3 className="text-xl font-bold text-slate-400 dark:text-slate-600">Empty Canvas</h3>
                    <p className="text-slate-400">Drag symbols to start</p>
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Right Inspector (Only if not embedded) */}
        {!embedded && (
          <div className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
             {/* Inspector content ... */}
             <div className="p-4 text-center text-sm text-slate-500">Select an item to edit properties</div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Quote Automation with Embedded Canvas ---
const QuoteAutomation = () => {
  const [step, setStep] = useState<'details' | 'pricing' | 'analyzing' | 'results'>('details');
  const [projectName, setProjectName] = useState('');
  const [pricingTier, setPricingTier] = useState<'Basic' | 'Premium' | 'Deluxe'>('Basic');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const mapBreakdownToItems = (breakdown: any[]) => {
    const mapped: CanvasItem[] = [];
    breakdown.forEach((entry, idx) => {
       let type = 'sensor';
       const name = entry.item.toLowerCase();
       if (name.includes('light') || name.includes('led')) type = 'light';
       else if (name.includes('shade') || name.includes('blind')) type = 'shade';
       else if (name.includes('speaker') || name.includes('audio')) type = 'speaker';
       else if (name.includes('camera') || name.includes('security')) type = 'cam';
       
       for (let i = 0; i < entry.quantity; i++) {
         mapped.push({
           id: `auto-${idx}-${i}`,
           type: type as any,
           x: 800 + (Math.random() * 400 - 200), // Center somewhat
           y: 800 + (Math.random() * 400 - 200),
           label: entry.item,
           cost: entry.unitPrice || 0
         });
       }
    });
    return mapped;
  };

  const handleStandardQuote = () => {
    const multiplier = pricingTier === 'Deluxe' ? 2.5 : pricingTier === 'Premium' ? 1.5 : 1;
    const mockResult = {
      detectedRooms: ['Living Room', 'Kitchen', 'Master Bedroom'],
      breakdown: [
        { item: 'Smart Switch Touch', quantity: 4, unitPrice: 280, total: 1120 },
        { item: 'Presence Sensor', quantity: 3, unitPrice: 160, total: 480 },
        { item: 'LED Spot RGBW', quantity: 8, unitPrice: 85, total: 680 }
      ],
      laborHours: 12,
      laborCost: 1440,
      subtotal: 2280,
      grandTotal: 3720
    };
    setAnalysisResult(mockResult);
    setCanvasItems(mapBreakdownToItems(mockResult.breakdown));
    setStep('results');
  };

  const handleAIAnalysis = async () => {
    setStep('analyzing');
    if (uploadedFile) {
      const result = await analyzeFloorplan(uploadedFile, selectedTypes.join(','), pricingTier);
      if (result && typeof result !== 'string') {
          setAnalysisResult(result);
          setCanvasItems(mapBreakdownToItems(result.breakdown));
      } else {
          handleStandardQuote();
      }
    } else {
      handleStandardQuote();
    }
    if (!uploadedFile) setTimeout(() => setStep('results'), 2000);
    else setStep('results');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {step !== 'analyzing' && (
          <div className="p-8 border-b border-slate-100 dark:border-slate-700">
             {/* Header Content Same As Before */}
             <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400"><FileText size={24} /></div>
              <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Floor Plan Analysis</h2><p className="text-slate-500 dark:text-slate-400 text-sm">Step {step === 'details' ? '1' : step === 'pricing' ? '2' : '3'} of 3</p></div>
            </div>

             {/* Step 1 & 2 Content Preserved via conditional logic same as before... */}
             {step === 'details' && (
               <div className="space-y-8">
                 <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
                  <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter project name"/>
                 </div>
                 <div onClick={handleUploadClick} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer hover:border-green-500/50 ${uploadedFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'}`}>
                    {uploadedFile ? <div className="pointer-events-none"><ImageIcon className="w-8 h-8 text-green-600 mx-auto mb-2"/><p className="font-bold text-green-600">File Uploaded</p></div> : <div className="pointer-events-none"><UploadCloud className="w-8 h-8 text-green-600 mx-auto mb-2"/><p className="font-bold">Drop floor plan here</p></div>}
                 </div>
                 <div className="flex justify-end"><button onClick={() => setStep('pricing')} disabled={!projectName || !uploadedFile} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50">Next Step</button></div>
               </div>
             )}

             {step === 'pricing' && (
               <div className="space-y-8">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Pricing Tier</h3>
                 <div className="grid grid-cols-3 gap-6">
                   {['Basic', 'Premium', 'Deluxe'].map(tier => (
                     <button key={tier} onClick={() => setPricingTier(tier as any)} className={`p-6 rounded-2xl border-2 text-left hover:shadow-lg transition-all ${pricingTier === tier ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                       <div className="font-bold text-lg mb-2">{tier}</div>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${pricingTier === tier ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>{pricingTier === tier && <CheckSquare className="text-white w-3 h-3" />}</div>
                     </button>
                   ))}
                 </div>
                 <div className="flex justify-between pt-4">
                   <button onClick={() => setStep('details')} className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold">Back</button>
                   <div className="flex gap-4">
                     <button onClick={handleStandardQuote} className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl font-bold flex gap-2 items-center"><Calculator size={18}/> Standard Quote</button>
                     <button onClick={handleAIAnalysis} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex gap-2 items-center shadow-lg"><Sparkles size={18}/> AI Analysis</button>
                   </div>
                 </div>
               </div>
             )}

             {step === 'results' && analysisResult && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                  <div className="p-4 bg-green-600 text-white rounded-xl shadow-lg flex items-center gap-3">
                    <CheckCircle2 size={24} />
                    <div>
                      <h3 className="font-bold text-lg">Quote Generated with AI Vision</h3>
                      <p className="text-green-100 text-sm">Analysis complete based on {pricingTier} tier.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800"><div className="text-xs font-bold text-blue-600 uppercase">Project</div><div className="font-bold text-lg">{projectName}</div></div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800"><div className="text-xs font-bold text-purple-600 uppercase">Rooms</div><div className="font-bold text-lg">{analysisResult.detectedRooms.length} Zones</div></div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800"><div className="text-xs font-bold text-orange-600 uppercase">Method</div><div className="font-bold text-lg flex items-center gap-2"><Sparkles size={16}/> Smart Grid</div></div>
                  </div>

                  {/* Embedded Canvas Editor */}
                  <div className="rounded-2xl overflow-hidden border border-green-200 dark:border-green-900/50 shadow-lg">
                    <div className="bg-green-600 p-3 px-4 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white font-bold"><PenTool size={18}/> Interactive Floorplan Editor</div>
                      <div className="text-xs text-green-100">Drag symbols to customize placement • Edit in real-time</div>
                    </div>
                    <CanvasEditor 
                      project={projectName} 
                      embedded={true} 
                      initialItems={canvasItems} 
                      backgroundImage={uploadedFile}
                    />
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold flex items-center gap-2"><FileText size={18}/> Cost Breakdown</div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {analysisResult.breakdown.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between p-4"><span className="text-slate-600 dark:text-slate-300">{item.quantity}x {item.item}</span><span className="font-bold">${item.total.toLocaleString()}</span></div>
                      ))}
                      <div className="flex justify-between p-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-100 text-2xl font-bold border-t border-green-200 dark:border-green-900"><span>GRAND TOTAL</span><span>${analysisResult.grandTotal?.toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                     <button onClick={() => setStep('details')} className="text-slate-400 text-sm">Start New</button>
                     <div className="flex gap-3">
                       <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg flex gap-2 items-center"><FileDown size={18}/> Export PDF</button>
                       <button className="px-6 py-3 bg-white dark:bg-slate-800 border rounded-xl font-bold">Save to CRM</button>
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}
        {step === 'analyzing' && (
          <div className="p-24 text-center animate-in zoom-in">
            <div className="w-24 h-24 border-4 border-green-100 dark:border-green-900 rounded-full border-t-green-500 animate-spin mb-8 mx-auto"></div>
            <h2 className="text-2xl font-bold mb-2">Analyzing...</h2>
            <p className="text-slate-500">Using Gemini Vision to identify layout.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Electrical Mapping ---
const ElectricalMapping = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'visual' | 'mapping'>('visual');
  const [circuits, setCircuits] = useState([
    { slot: 1, pole: 'L1', breaker: 20, label: 'Kitchen GPO 1', load: 1200, devices: 4, type: '1P' },
    { slot: 2, pole: 'L1', breaker: 16, label: 'Kitchen Lights', load: 450, devices: 12, type: '1P' },
    { slot: 3, pole: 'L2', breaker: 20, label: 'Living Room Power', load: 800, devices: 6, type: '1P' },
    { slot: 4, pole: 'L2', breaker: 16, label: 'Living Room Lights', load: 300, devices: 8, type: '1P' },
    { slot: 5, pole: 'L3', breaker: 32, label: 'Induction Cooktop', load: 5400, devices: 1, type: '1P' },
    { slot: 6, pole: 'L3', breaker: 25, label: 'Oven', load: 3200, devices: 1, type: '1P' },
    { slot: 7, pole: 'L1', breaker: 10, label: 'Smoke Alarms', load: 50, devices: 5, type: '1P' },
    { slot: 8, pole: 'L2', breaker: 20, label: 'Bedroom 1 Power', load: 600, devices: 4, type: '1P' },
  ]);

  const totalLoad = circuits.reduce((acc, c) => acc + c.load, 0);
  const maxLoad = 15000; // Example max watts
  const loadPercentage = Math.round((totalLoad / maxLoad) * 100);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Electrical Mapping</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Circuit schedule, load balancing, and device mapping.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download size={18} /> Export Schedule
          </button>
          <button className="btn-primary px-4 py-2 bg-amber-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-colors">
            <Plus size={18} /> Add Circuit
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-xl"><Zap size={24}/></div>
               <div>
                 <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">Total Load</div>
                 <div className="text-2xl font-bold text-slate-900 dark:text-white">{(totalLoad / 1000).toFixed(1)} kW</div>
               </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
               <div className={`h-full rounded-full ${loadPercentage > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${loadPercentage}%`}}></div>
            </div>
            <div className="mt-2 text-xs text-slate-500 text-right">{loadPercentage}% Capacity</div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Activity size={24}/></div>
               <div>
                 <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">Active Circuits</div>
                 <div className="text-2xl font-bold text-slate-900 dark:text-white">{circuits.length}</div>
               </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-bold text-slate-500">8 SP</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-bold text-slate-500">0 3P</span>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl"><CheckCircle2 size={24}/></div>
               <div>
                 <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">Compliance</div>
                 <div className="text-2xl font-bold text-slate-900 dark:text-white">Pass</div>
               </div>
            </div>
            <div className="mt-4 text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit">
               NEC 2023 Compliant
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button onClick={() => setActiveTab('visual')} className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'visual' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Visual Board</button>
        <button onClick={() => setActiveTab('schedule')} className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'schedule' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Schedule List</button>
        <button onClick={() => setActiveTab('mapping')} className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'mapping' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Device Mapping</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Visual Panel (Always visible or conditionally based on design choice, here conditional for tab focus) */}
         {(activeTab === 'visual' || activeTab === 'mapping') && (
           <div className="bg-slate-800 dark:bg-slate-900 rounded-2xl border-4 border-slate-300 dark:border-slate-700 p-4 shadow-2xl lg:col-span-1 h-fit">
               <div className="text-center text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest">Distribution Board 1</div>
               <div className="bg-slate-900 dark:bg-black rounded-lg p-2 space-y-1 border border-slate-700 relative">
                  {/* Main Switch */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-10 bg-red-600 rounded-t-lg border-x-2 border-t-2 border-red-800 flex items-center justify-center shadow-lg z-10">
                    <span className="text-white text-[10px] font-bold">MAIN</span>
                  </div>

                  {/* Breakers Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-4">
                     {Array.from({length: 12}).map((_, i) => {
                       const circuit = circuits.find(c => c.slot === i + 1);
                       return (
                         <div key={i} className="flex items-center gap-1 group cursor-pointer">
                           <div className="text-[10px] text-slate-600 w-4 text-right">{i + 1}</div>
                           <div className={`h-8 flex-1 rounded border-b-2 shadow-inner relative transition-all ${circuit ? 'bg-slate-700 border-slate-900 hover:bg-slate-600' : 'bg-slate-800 border-slate-950 opacity-50'}`}>
                             {circuit && (
                               <>
                                 <div className={`absolute top-1 left-1 right-1 h-1 rounded-full ${circuit.load > (circuit.breaker * 100) ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                 <div className="absolute center inset-0 flex items-center justify-center text-[9px] font-bold text-white">{circuit.breaker}A</div>
                               </>
                             )}
                           </div>
                         </div>
                       )
                     })}
                  </div>
               </div>
               <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                 <div className="text-xs text-slate-300 font-bold mb-2">Selected Circuit Details</div>
                 <div className="text-xs text-slate-400">Click a breaker above to view connected devices and detailed load information.</div>
               </div>
           </div>
         )}

         {/* Right Content based on Tab */}
         <div className={`${activeTab === 'schedule' ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col`}>
             {activeTab === 'mapping' && (
               <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Wrench className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Device Mapping Mode</h3>
                  <p className="text-slate-500 max-w-md">Select a circuit on the left to highlight mapped devices on your floorplan. Drag devices from the unassigned list to a circuit to map them.</p>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Open Floorplan Overlay</button>
               </div>
             )}

             {activeTab !== 'mapping' && (
               <>
                 <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-bold text-sm text-slate-700 dark:text-slate-300 flex justify-between">
                    <span>Panel Schedule</span>
                    <span className="text-xs font-normal text-slate-500">DB-1 • 240V • 1 Phase</span>
                 </div>
                 <div className="overflow-auto flex-1">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-500 font-bold">
                       <tr>
                         <th className="p-3 pl-6 w-16">Slot</th>
                         <th className="p-3 w-20">Amps</th>
                         <th className="p-3">Description</th>
                         <th className="p-3">Load (W)</th>
                         <th className="p-3 text-right pr-6">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                       {circuits.map(c => (
                         <tr key={c.slot} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                           <td className="p-3 pl-6 font-mono text-slate-400">#{c.slot}</td>
                           <td className="p-3 font-bold">{c.breaker}A</td>
                           <td className="p-3">
                             <div className="font-medium text-slate-900 dark:text-white">{c.label}</div>
                             <div className="text-xs text-slate-500">{c.devices} Devices Connected</div>
                           </td>
                           <td className="p-3 font-mono">{c.load}W</td>
                           <td className="p-3 text-right pr-6">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"><Edit2 size={14} className="text-slate-500"/></button>
                                <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"><Trash2 size={14} className="text-red-500"/></button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </>
             )}
         </div>
      </div>
    </div>
  );
};

// --- Admin Panel ---
const AdminPanel = () => {
  const [users] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@integratd.com', role: UserRole.ADMIN, status: 'Active', lastLogin: 'Today', permissions: [] },
    { id: '2', name: 'Technician Tom', email: 'tom@integratd.com', role: UserRole.TECHNICIAN, status: 'Active', lastLogin: 'Yesterday', permissions: [] },
    { id: '3', name: 'Sarah Sales', email: 'sarah@integratd.com', role: UserRole.SALES, status: 'Active', lastLogin: '2 hours ago', permissions: [] },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Panel</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Manage system users, roles, and permissions.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value="12" icon={Users} onClick={() => {}} />
        <StatCard title="Active Sessions" value="4" icon={Activity} onClick={() => {}} />
        <StatCard title="System Health" value="98%" trend="+1%" icon={Activity} onClick={() => {}} /> 
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">User Directory</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500"><Filter size={18} /></button>
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500"><Download size={18} /></button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="p-4 pl-6">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Login</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">{user.lastLogin}</td>
                <td className="p-4 text-right pr-6">
                   <div className="flex items-center justify-end gap-2">
                     <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"><Edit2 size={14}/></button>
                     <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 size={14}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ... (App shell logic preserved) ...
export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAIMinimized, setIsAIMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderView = () => {
    switch(currentView) {
      case 'crm': return <CRMDashboard searchQuery={searchQuery} />;
      case 'quotes': return <QuoteAutomation />;
      case 'canvas': return <CanvasEditor project="Untitled Project" onClose={() => setCurrentView('dashboard')} />;
      case 'mapping': return <ElectricalMapping />;
      case 'admin': return <AdminPanel />;
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          {currentView !== 'dashboard' && <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"><ArrowLeft size={20} /></button>}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">Integratd Living</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-green-500/50 outline-none transition-all w-64" /></div>
           <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
      </header>
      <main className="flex-1 relative overflow-hidden flex flex-col">{renderView()}</main>
      <AIAssistant isOpen={isAIOpen || isAIMinimized} onClose={() => setIsAIOpen(false)} onMinimize={() => setIsAIMinimized(!isAIMinimized)} isMinimized={isAIMinimized} />
      {!isAIOpen && !isAIMinimized && <button onClick={() => { setIsAIOpen(true); setIsAIMinimized(false); }} className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-full shadow-xl shadow-green-900/30 flex items-center justify-center transition-all hover:scale-110 hover:from-green-600 hover:to-green-700 z-50 ring-4 ring-white/20 backdrop-blur-sm"><Brain size={24} className="fill-current" /></button>}
    </div>
  );
}