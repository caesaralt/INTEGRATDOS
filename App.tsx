
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
  ArrowDownLeft
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import { User, UserRole, CanvasItem } from './types';

// --- Types ---
type ViewState = 'dashboard' | 'crm' | 'quotes' | 'canvas' | 'mapping' | 'board' | 'cad' | 'learning' | 'ops' | 'admin';

// --- Helper Components ---

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
         {/* Gradients */}
         <defs>
           <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
             <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
           </linearGradient>
         </defs>
         {/* Grid */}
         {[0.2, 0.4, 0.6, 0.8].map(p => (
           <line key={p} x1="0" y1={height * p} x2={width} y2={height * p} stroke="currentColor" strokeOpacity="0.05" />
         ))}
         {/* Path */}
         <path d={areaPoints} fill="url(#grad1)" />
         <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
         {/* Tooltip triggers */}
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
  
  // Calculate donut segments
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
    { id: 1, name: 'John Doe', role: 'Customer', company: 'Acme Corp', contact: 'john@acme.com' },
    { id: 2, name: 'Sarah Smith', role: 'Employee', company: 'Integratd Living', contact: 'sarah@integratd.com' },
    { id: 3, name: 'Rexel Supply', role: 'Supplier', company: 'Rexel', contact: 'sales@rexel.com' },
    { id: 4, name: 'Mike Fixit', role: 'Contractor', company: 'Fixit All', contact: 'mike@fixit.com' },
  ]);

  const filterRole = subCategory === 'All' || !subCategory ? '' : subCategory?.slice(0, -1); // Simple plural to singular
  
  const filteredPeople = people.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterRole || p.role.includes(filterRole) || (filterRole === 'Contact' && true); // Fallback
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    const newPerson = { 
      id: Date.now(), 
      name: 'New Person', 
      role: filterRole || 'Contact', 
      company: 'Company', 
      contact: 'email@example.com' 
    };
    setPeople([...people, newPerson]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'People Directory'}</h2>
          <p className="text-slate-500 text-sm">Manage your {subCategory?.toLowerCase() || 'contacts'}</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
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
            onEdit={() => {}}
          />
        )) : (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400">
            No {subCategory?.toLowerCase()} found. Click "Add" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

const QuotesView = ({ searchQuery, subCategory }: { searchQuery: string, subCategory?: string }) => {
  const [quotes, setQuotes] = useState([
    { id: 1, title: 'Smart Home Upgrade', client: 'Smith Residence', amount: '$14,250', status: 'Open' },
    { id: 2, title: 'Lighting Retrofit', client: 'Jones Office', amount: '$5,500', status: 'Sent' },
    { id: 3, title: 'Cinema Room', client: 'Brown Manor', amount: '$22,000', status: 'Expired' },
  ]);

  const filterStatus = subCategory === 'Supplier Quotes' ? 'Supplier' : subCategory;

  const filtered = quotes.filter(q => !filterStatus || q.status === filterStatus || (filterStatus === 'Supplier' && false)); // Placeholder for supplier logic

  const handleAdd = () => {
    setQuotes([...quotes, { id: Date.now(), title: 'New Quote', client: 'Client', amount: '$0.00', status: filterStatus || 'Open' }]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'All Quotes'}</h2>
           <p className="text-slate-500 text-sm">Track and manage your quotes</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg shadow-yellow-600/20 transition-all">
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
                 <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
           <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400">
             No quotes found in this category.
           </div>
        )}
      </div>
    </div>
  );
};

const JobsView = ({ subCategory }: { subCategory?: string }) => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Living Room Automation', status: 'In Progress', due: 'Tomorrow' },
    { id: 2, title: 'Kitchen Lighting', status: 'Upcoming', due: 'Next Week' },
  ]);

  const filtered = subCategory ? jobs.filter(j => j.status === subCategory) : jobs;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'Jobs'}</h2>
          <p className="text-slate-500 text-sm">Project execution and tracking</p>
        </div>
        <button onClick={() => setJobs([...jobs, { id: Date.now(), title: 'New Job', status: subCategory || 'Pending', due: 'TBD' }])} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          <Plus size={18} /> New Job
        </button>
      </div>
      
      <div className="grid gap-3">
        {filtered.map(job => (
          <ListItem 
             key={job.id}
             title={job.title}
             subtitle={`Due: ${job.due}`}
             badge={job.status}
             badgeColor="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
             onDelete={() => setJobs(jobs.filter(j => j.id !== job.id))}
             onEdit={() => {}}
          />
        ))}
        {filtered.length === 0 && <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">No jobs in this status.</div>}
      </div>
    </div>
  );
};

const CalendarView = ({ subCategory }: { subCategory?: string }) => {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'Schedule'}</h2>
           <p className="text-slate-500 text-sm">Timeline and events</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-500 flex items-center gap-2 hover:text-blue-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Synced
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      {/* Mock Calendar */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
         <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-500">{day}</div>
            ))}
            {Array.from({length: 35}).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-2 min-h-[80px] relative hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <span className={`text-xs ${i === 14 ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>{i + 1}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const MaterialsView = ({ subCategory }: { subCategory?: string }) => {
  const isOrders = subCategory === 'Orders';
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{subCategory || 'Inventory'}</h2>
          <p className="text-slate-500 text-sm">{isOrders ? 'Track supplier orders' : 'Manage stock levels'}</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
          <Plus size={18} /> {isOrders ? 'New Order' : 'Add Item'}
        </button>
      </div>

      {!isOrders ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="h-32 bg-slate-100 dark:bg-slate-700 relative flex items-center justify-center">
                <Package className="text-slate-300 dark:text-slate-600 w-12 h-12" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Loxone Miniserver</h3>
                <div className="mt-4 flex gap-2">
                   <button className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-xs font-bold">Edit</button>
                   <button className="flex-1 py-1.5 text-red-500 rounded text-xs font-bold">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
           <ListItem title="Order #1234" subtitle="Rexel • 12 Items" badge="Pending" badgeColor="bg-yellow-100 text-yellow-700" onDelete={() => {}} onEdit={() => {}} />
           <ListItem title="Order #1235" subtitle="Middy's • 4 Items" badge="Received" badgeColor="bg-green-100 text-green-700" onDelete={() => {}} onEdit={() => {}} />
        </div>
      )}
    </div>
  );
};

const PaymentsView = ({ subCategory }: { subCategory?: string }) => {
  const [direction, setDirection] = useState<'inbound' | 'outbound'>('inbound');
  const [showAddModal, setShowAddModal] = useState(false);
  const [invoices, setInvoices] = useState([
    { id: 1, ref: 'INV-2024-001', entity: 'Smith Residence', amount: '$12,500', date: 'Due Nov 25', status: 'Due', dir: 'inbound' },
    { id: 2, ref: 'INV-2024-002', entity: 'Jones Office', amount: '$4,200', date: 'Paid Oct 12', status: 'Paid', dir: 'inbound' },
    { id: 3, ref: 'PO-9921', entity: 'Rexel Supply', amount: '$850', date: 'Pending Approval', status: 'Pending', dir: 'outbound' },
  ]);

  // Subcategory acts as filter status if present (e.g., 'Upcoming', 'Paid')
  const filterStatus = subCategory && !['To Us', 'To Suppliers', 'Invoices'].includes(subCategory) ? subCategory : null;
  
  // Auto-switch direction based on menu selection if possible
  useEffect(() => {
    if (subCategory === 'To Us') setDirection('inbound');
    if (subCategory === 'To Suppliers') setDirection('outbound');
  }, [subCategory]);

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
          <p className="text-slate-500 text-sm">Financial tracking & Invoicing</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {/* Tabs */}
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
            onEdit={() => {}} 
          />
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400">
             No {direction} payments found{filterStatus ? ` with status ${filterStatus}` : ''}.
          </div>
        )}
      </div>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-[500px] shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Create New Invoice</h3>
            <div className="space-y-4">
               <input placeholder="Invoice Reference (e.g. INV-001)" className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
               <div className="grid grid-cols-2 gap-4">
                 <input placeholder="Amount" type="number" className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
                 <input placeholder="Due Date" type="date" className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" />
               </div>
               
               {/* Cross Linking */}
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Link To</label>
                 <select className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-600 dark:text-slate-300">
                   <option>Select Project...</option>
                   <option>Smart Home Upgrade</option>
                   <option>Lighting Retrofit</option>
                 </select>
               </div>
               <div>
                 <select className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-600 dark:text-slate-300">
                   <option>Select Quote...</option>
                   <option>Quote #1001</option>
                   <option>Quote #1002</option>
                 </select>
               </div>

            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">Create Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CRMDashboard = ({ searchQuery }: { searchQuery: string }) => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [subCategory, setSubCategory] = useState<string | undefined>(undefined);
  const [analyticsType, setAnalyticsType] = useState<string | null>(null);

  // Navigation Structure
  const navItems = [
    { 
      id: 'people', 
      label: 'People', 
      icon: Users, 
      sub: ['Employees', 'Customers', 'Suppliers', 'Contractors', 'Contacts'] 
    },
    { 
      id: 'quotes', 
      label: 'Quotes', 
      icon: FileText, 
      sub: ['Open', 'Expired', 'Sent', 'Supplier Quotes'] 
    },
    { 
      id: 'jobs', 
      label: 'Jobs', 
      icon: Briefcase, 
      sub: ['In Progress', 'Upcoming', 'Pending', 'Finished', 'Recurring'] 
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: Folder, 
      sub: ['Planning', 'In Progress', 'Review', 'Archived'] 
    },
    { 
      id: 'schedules', 
      label: 'Schedules', 
      icon: CalendarIcon, 
      sub: ['Calendar', 'Timeline', 'Shifts'] 
    },
    { 
      id: 'stock', 
      label: 'Materials', 
      icon: Package, 
      sub: ['Stock', 'Orders', 'Suppliers'] 
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: CreditCard, 
      sub: ['To Us', 'To Suppliers', 'Invoices', 'Upcoming', 'Pending', 'Due', 'Paid', 'Credits', 'Retentions'] 
    },
  ];

  const handleNavClick = (viewId: string, sub?: string) => {
    setActiveView(viewId);
    setSubCategory(sub);
    setAnalyticsType(null); // Reset analytics when navigating
  };

  const renderContent = () => {
    // If Analytics Mode is active (clicked from dashboard)
    if (analyticsType) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <button onClick={() => setAnalyticsType(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors">
             <ArrowLeft size={18} /> Back to Overview
           </button>
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
             <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{analyticsType} Analytics</h2>
                  <p className="text-slate-500">Detailed performance metrics.</p>
                </div>
                <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Year to Date</option>
                </select>
             </div>
             
             {/* Render specific chart based on type */}
             {analyticsType === 'Revenue' && <RevenueChart />}
             {analyticsType === 'Projects' && <ProjectsChart />}
             {analyticsType === 'Quotes' && <div className="h-64 flex items-center justify-center text-slate-400">Quote Pipeline Chart Component</div>}
             {analyticsType === 'Team' && <TeamChart />}
           </div>
        </div>
      );
    }

    switch(activeView) {
      case 'people': return <PeopleView searchQuery={searchQuery} subCategory={subCategory} />;
      case 'quotes': return <QuotesView searchQuery={searchQuery} subCategory={subCategory} />;
      case 'jobs': return <JobsView subCategory={subCategory} />;
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

            {/* Minimalist Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <StatCard 
                  title="Revenue" 
                  value="$128.5k" 
                  trend="+12.5%" 
                  icon={DollarSign} 
                  onClick={() => setAnalyticsType('Revenue')}
               />
               <StatCard 
                  title="Active Projects" 
                  value="14" 
                  trend="+2" 
                  icon={Folder} 
                  onClick={() => setAnalyticsType('Projects')}
               />
               <StatCard 
                  title="Pending Quotes" 
                  value="8" 
                  icon={FileText} 
                  onClick={() => setAnalyticsType('Quotes')}
               />
               <StatCard 
                  title="Availability" 
                  value="85%" 
                  trend="-5%" 
                  icon={Clock} 
                  onClick={() => setAnalyticsType('Team')}
               />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Recent Activity Section */}
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                     {[1,2,3].map(i => (
                       <div key={i} className="flex gap-4 items-start border-b border-slate-50 dark:border-slate-800 pb-3 last:border-0">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-1 text-blue-500">
                             <Activity size={14} />
                          </div>
                          <div>
                             <p className="text-sm font-medium text-slate-800 dark:text-white">New Quote Approved</p>
                             <p className="text-xs text-slate-500">Smith Residence • 2 hours ago</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               {/* Quick Actions */}
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 border border-slate-700 flex flex-col justify-between">
                 <div>
                   <h3 className="font-bold text-lg mb-1">Quick Actions</h3>
                   <p className="text-slate-400 text-sm">Shortcuts for common tasks</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mt-6">
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-colors">
                       <Plus size={20} className="mb-2" />
                       <span className="text-sm font-bold">New Quote</span>
                    </button>
                    <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-colors">
                       <Users size={20} className="mb-2" />
                       <span className="text-sm font-bold">Add Contact</span>
                    </button>
                 </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      
      {/* Sidebar - Compact & Fixed */}
      <div 
        className={`
          w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          flex flex-col relative shrink-0 z-50
        `}
        style={{ overflow: 'visible' }}
      >
        <div className="p-4 pb-0 flex-1 flex flex-col">
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 pl-3">Main Menu</h2>
          <div className="space-y-0.5">
            <button 
              onClick={() => handleNavClick('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 ${activeView === 'overview' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : ''}`}
            >
               <div className="flex items-center gap-3">
                 <LayoutDashboard className="w-4 h-4" />
                 <span className="text-sm">Overview</span>
               </div>
            </button>

            {navItems.map((item) => (
              <div key={item.id} className="group relative">
                <button 
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 ${activeView === item.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
                
                {/* Flyout Menu with Invisible Bridge for Stability */}
                <div className="absolute left-full top-0 ml-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 hidden group-hover:block animate-in fade-in slide-in-from-left-1 duration-200 z-[60]">
                   {/* Invisible bridge to prevent closing when moving mouse */}
                   <div className="absolute -left-3 top-0 w-4 h-full bg-transparent"></div>
                   
                   <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800 mb-1">{item.label}</div>
                   {item.sub.map((subItem) => (
                     <button
                       key={subItem}
                       onClick={(e) => {
                         e.stopPropagation();
                         handleNavClick(item.id, subItem);
                       }}
                       className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between"
                     >
                       {subItem}
                     </button>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Compact User Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
             <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">JD</div>
             <div className="overflow-hidden">
               <div className="text-xs font-bold text-slate-900 dark:text-white truncate">John Doe</div>
               <div className="text-[10px] text-slate-400 truncate">Admin</div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
        <div className="max-w-7xl mx-auto">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

const CanvasEditor = ({ project, onClose }: { project: string, onClose: () => void }) => {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const symbols = [
    { id: 'light', label: 'Light', icon: Lightbulb, cost: 120, color: 'bg-yellow-500' },
    { id: 'sensor', label: 'Sensor', icon: Zap, cost: 180, color: 'bg-blue-500' },
    { id: 'shade', label: 'Shade', icon: Blinds, cost: 450, color: 'bg-orange-500' },
    { id: 'speaker', label: 'Speaker', icon: Speaker, cost: 250, color: 'bg-purple-500' },
  ];

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - 24; // Center offset
      const y = e.clientY - rect.top - 24;
      const symbol = symbols.find(s => s.id === type);
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

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    setDraggedItem(id);
    const item = items.find(i => i.id === id);
    if (item) {
      setOffset({ x: e.clientX - item.x, y: e.clientY - item.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedItem) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
         const x = e.clientX - rect.left - (offset.x - rect.left) + rect.left; // Simplified relative math
         // Actually, simplest is:
         const newX = e.clientX - offset.x;
         const newY = e.clientY - offset.y;

         setItems(items.map(i => i.id === draggedItem ? { ...i, x: e.clientX - offset.x, y: e.clientY - offset.y } : i));
      }
    }
  };

  // Simplified drag logic for this demo
  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedItem && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setItems(prev => prev.map(item => {
        if (item.id === draggedItem) {
           return {
             ...item,
             x: e.clientX - rect.left - 20, // roughly center
             y: e.clientY - rect.top - 20
           };
        }
        return item;
      }));
    }
  };

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 z-[60] flex flex-col">
      <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ArrowLeft size={20} /></button>
           <h2 className="font-bold text-lg">{project} - Canvas Editor</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <div className="text-xs text-slate-500">Estimated Cost</div>
             <div className="font-bold text-xl text-green-600">${totalCost.toLocaleString()}</div>
           </div>
           <button className="btn-primary bg-green-600 text-white px-4 py-2 rounded-lg">Save & Quote</button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox */}
        <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4">
           <h3 className="font-bold text-sm text-slate-500 uppercase">Component Library</h3>
           {symbols.map(sym => (
             <div 
               key={sym.id}
               draggable
               onDragStart={(e) => e.dataTransfer.setData('type', sym.id)}
               className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-3 cursor-grab hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
               <div className={`p-2 rounded-lg text-white ${sym.color}`}><sym.icon size={16} /></div>
               <div>
                 <div className="font-bold text-sm">{sym.label}</div>
                 <div className="text-xs text-slate-400">${sym.cost}</div>
               </div>
             </div>
           ))}
           <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
             Drag symbols onto the canvas to place them.
           </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden cursor-crosshair"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, e.dataTransfer.getData('type'))}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={() => setDraggedItem(null)}
        >
           {/* Grid Background */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           {items.map(item => (
             <div
               key={item.id}
               style={{ left: item.x, top: item.y }}
               className="absolute p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg cursor-move group active:scale-110 transition-transform z-10"
               onMouseDown={() => setDraggedItem(item.id)}
             >
               <div className="relative">
                 <Zap size={20} className="text-slate-700 dark:text-white" />
                 <button 
                    onClick={(e) => { e.stopPropagation(); setItems(items.filter(i => i.id !== item.id)); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <X size={8} />
                 </button>
               </div>
             </div>
           ))}

           {items.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
               <p>Drop floorplan here or start placing symbols</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const QuoteAutomation = () => {
  const [projectName, setProjectName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleAnalysis = (mode: 'ai' | 'manual') => {
    if (mode === 'ai') {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowCanvas(true);
      }, 2000);
    } else {
      setShowCanvas(true);
    }
  };

  const automationTypes = [
    { id: 'lighting', label: 'Lighting Control', icon: Lightbulb },
    { id: 'shading', label: 'Shading Control', icon: Blinds },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'climate', label: 'Climate Control', icon: Thermometer },
    { id: 'audio', label: 'Audio System', icon: Speaker },
  ];

  if (showCanvas) {
    return <CanvasEditor project={projectName || 'Untitled Project'} onClose={() => setShowCanvas(false)} />;
  }

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
          </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-4 border-t border-slate-100 dark:border-slate-700">
          <button 
             onClick={() => handleAnalysis('manual')}
             className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            Analysis
          </button>
          <button 
             onClick={() => handleAnalysis('ai')}
             disabled={isAnalyzing}
             className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2 min-w-[180px] justify-center"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Reasoning...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 fill-current" />
                AI Analysis
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', role: 'admin', status: 'Active', lastLogin: '21/11/2025', display: 'System Administrator' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    display: '', 
    code: '', 
    role: 'Viewer',
    permissions: [] as string[]
  });

  const permissionList = [
    'Admin Panel', 'AI Mapping', 'Board Builder', 'Canvas Editor', 'CRM Dashboard', 
    'Electrical CAD', 'Operations Board', 'AI Learning', 'Electrical Mapping', 
    'Quote Automation', 'Simpro Integration'
  ];

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleAddUser = () => {
    if (newUser.name) {
      setUsers([...users, {
        id: Date.now(),
        name: newUser.name,
        display: newUser.display || 'New User',
        role: newUser.role.toLowerCase(),
        status: 'Active',
        lastLogin: 'Never'
      }]);
      setShowModal(false);
      setNewUser({ name: '', display: '', code: '', role: 'Viewer', permissions: [] });
    }
  };

  const togglePermission = (perm: string) => {
    if (newUser.permissions.includes(perm)) {
      setNewUser({ ...newUser, permissions: newUser.permissions.filter(p => p !== perm) });
    } else {
      setNewUser({ ...newUser, permissions: [...newUser.permissions, perm] });
    }
  };

  return (
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
      <div className="flex-1 p-8 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Create and manage user accounts with role-based permissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Users', value: users.length },
              { label: 'Active Users', value: users.filter(u => u.status === 'Active').length },
              { label: 'Administrators', value: users.filter(u => u.role === 'admin').length }
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
              <button 
                 onClick={() => setShowModal(true)}
                 className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
              >
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
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.display}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold">{u.status}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.lastLogin}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => handleDelete(u.id)}
                             className="p-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 dark:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-[600px] shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 dark:text-white">Add New User</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Name *</label>
                    <input 
                      placeholder="e.g., John, Sarah"
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                      className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none dark:text-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">This is what the user enters to login</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Display Name *</label>
                    <input 
                      placeholder="e.g., John Smith"
                      value={newUser.display}
                      onChange={e => setNewUser({...newUser, display: e.target.value})}
                      className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Access Code *</label>
                  <input 
                    placeholder="4-6 digit code"
                    value={newUser.code}
                    onChange={e => setNewUser({...newUser, code: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Simple numeric code (e.g., 1234, 5678)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Role *</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none dark:text-white"
                  >
                    <option>Viewer</option>
                    <option>Editor</option>
                    <option>Manager</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Permissions</label>
                  <p className="text-xs text-slate-400 mb-3">Select role above to auto-fill permissions, or customize individually</p>
                  <div className="grid grid-cols-2 gap-3">
                    {permissionList.map(perm => (
                      <button 
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          newUser.permissions.includes(perm)
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                           newUser.permissions.includes(perm) ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-500'
                        }`}>
                          {newUser.permissions.includes(perm) && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm font-medium">{perm}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={handleAddUser} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all">
                   + Create User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---

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
      case 'admin': return <AdminPanel />;
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 dark:text-slate-500">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold text-slate-500 dark:text-slate-400">Module Under Construction</h2>
            <p className="text-sm mt-2">Check back soon or ask ALFRED for updates.</p>
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
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
               type="text" 
               placeholder="Search..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-green-500/50 outline-none transition-all w-64"
            />
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

      {/* Floating AI Button (When closed) - ICON ONLY */}
      {!isAIOpen && !isAIMinimized && (
        <button 
          onClick={() => { setIsAIOpen(true); setIsAIMinimized(false); }}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-full shadow-xl shadow-green-900/30 flex items-center justify-center transition-all hover:scale-110 hover:from-green-600 hover:to-green-700 z-50 ring-4 ring-white/20 backdrop-blur-sm"
          title="Open ALFRED AI"
        >
          <Brain size={24} className="fill-current" />
        </button>
      )}
    </div>
  );
}
