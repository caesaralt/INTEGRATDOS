
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
  ExternalLink
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

const PeopleView = () => {
  const tabs = ['All', 'Employees', 'Customers', 'Suppliers', 'Contractors', 'Contacts'];
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">People Directory</h2>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          <Plus size={18} /> Add New
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
            {[1, 2, 3].map((_, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">JD</div>
                  John Doe
                </td>
                <td className="px-6 py-4">Customer</td>
                <td className="px-6 py-4">Acme Corp</td>
                <td className="px-6 py-4">john@example.com</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-500"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const QuotesView = () => {
  const tabs = ['Open', 'Expired', 'Sent', 'Supplier Quotes'];
  const [activeTab, setActiveTab] = useState('Open');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quote Management</h2>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 text-white hover:bg-yellow-700">
          <Plus size={18} /> Create Quote
        </button>
      </div>
      
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600 dark:text-yellow-500">
                <FileText size={20} />
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Pending
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Smart Home Upgrade</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Client: Smith Residence</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">$14,250</span>
              <div className="flex gap-2">
                 <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Edit2 size={16} /></button>
                 <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Download size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JobsView = () => {
  const statuses = ['In Progress', 'Upcoming', 'Pending', 'Finished', 'Recurring'];
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Board</h2>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          <Plus size={18} /> New Job
        </button>
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full pb-4">
          {statuses.map(status => (
            <div key={status} className="w-80 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">{status}</h3>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs font-bold">2</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase">Install</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Living Room Automation</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Clock size={12} /> Due Tomorrow
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalendarView = () => {
  const views = ['Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Annually'];
  const [view, setView] = useState('Monthly');

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Schedule</h2>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
             {views.map(v => (
               <button 
                 key={v}
                 onClick={() => setView(v)}
                 className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${view === v ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
               >
                 {v}
               </button>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-500 flex items-center gap-2 hover:text-blue-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Google Calendar Synced
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 relative overflow-hidden">
         {/* Mock Calendar Grid */}
         <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-bold text-slate-500">{day}</div>
            ))}
            {Array.from({length: 35}).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-2 min-h-[80px] relative hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className={`text-xs ${i === 14 ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>{i + 1}</span>
                {i === 14 && (
                  <div className="mt-1 p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] rounded border border-blue-200 dark:border-blue-800 truncate">
                    Site Visit: 10 AM
                  </div>
                )}
                {i === 16 && (
                  <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] rounded border border-green-200 dark:border-green-800 truncate">
                    Install Due
                  </div>
                )}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const MaterialsView = () => {
  const [mode, setMode] = useState<'Stock' | 'Orders'>('Stock');
  const [location, setLocation] = useState<'Sydney' | 'Melbourne'>('Sydney');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Materials & Inventory</h2>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button onClick={() => setMode('Stock')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'Stock' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}>Stock</button>
            <button onClick={() => setMode('Orders')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'Orders' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}>Orders</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value as any)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm"
          >
            <option>Sydney</option>
            <option>Melbourne</option>
          </select>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus size={18} /> {mode === 'Stock' ? 'Add Item' : 'New Order'}
          </button>
        </div>
      </div>

      {mode === 'Stock' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="h-32 bg-slate-100 dark:bg-slate-700 relative flex items-center justify-center">
                <Package className="text-slate-300 dark:text-slate-600 w-12 h-12" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                  Qty: 45
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 dark:text-white">Loxone Miniserver</h3>
                  <span className="text-xs text-slate-400">Ref: LX-001</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Automation Controllers</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600">Assign</button>
                  <button className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Linked To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {[1, 2].map(i => (
                 <tr key={i}>
                   <td className="px-6 py-4 font-medium">#ORD-2025-{i}0</td>
                   <td className="px-6 py-4">Rexel Electrical</td>
                   <td className="px-6 py-4">12 Items</td>
                   <td className="px-6 py-4"><span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">To Order</span></td>
                   <td className="px-6 py-4 text-xs text-slate-500">Project: Smith House</td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const PaymentsView = () => {
  const [direction, setDirection] = useState<'In' | 'Out'>('In');
  const statuses = ['All', 'Upcoming', 'Pending', 'Due', 'Paid', 'Credits', 'Retentions'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payments & Invoicing</h2>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
           <button onClick={() => setDirection('In')} className={`px-6 py-1.5 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${direction === 'In' ? 'bg-white dark:bg-slate-600 shadow-sm text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
             <ArrowLeft className="rotate-45" size={16} /> To Us
           </button>
           <button onClick={() => setDirection('Out')} className={`px-6 py-1.5 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${direction === 'Out' ? 'bg-white dark:bg-slate-600 shadow-sm text-red-500 dark:text-red-400' : 'text-slate-500'}`}>
             <ArrowLeft className="-rotate-135" size={16} /> To Suppliers
           </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {statuses.map(status => (
          <button key={status} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap">
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">
             {direction === 'In' ? 'Invoices Sent' : 'Bills to Pay'}
          </h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
            <Download size={16} /> Export PDF Report
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice #</th>
              <th className="px-6 py-4 font-medium">Entity</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
            {[1, 2, 3].map(i => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-6 py-4 font-medium">INV-2025-00{i}</td>
                <td className="px-6 py-4">{direction === 'In' ? 'Client: John Doe' : 'Supplier: Rexel'}</td>
                <td className="px-6 py-4">Nov 25, 2025</td>
                <td className="px-6 py-4 font-bold">$2,450.00</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">Due</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline text-xs">PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CRMDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<string>('overview');

  // Detailed Navigation Structure
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
      icon: Calendar, 
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
      sub: ['To Us', 'To Suppliers', 'Invoices'] 
    },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'people': return <PeopleView />;
      case 'quotes': return <QuotesView />;
      case 'jobs': return <JobsView />;
      case 'schedules': return <CalendarView />;
      case 'stock': return <MaterialsView />;
      case 'payments': return <PaymentsView />;
      default: 
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
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
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      
      {/* Sidebar */}
      <div 
        className={`
          ${isSidebarOpen ? 'w-72' : 'w-0'} 
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          flex flex-col transition-all duration-300 ease-in-out relative shrink-0
          ${isSidebarOpen ? 'z-50 overflow-visible' : 'overflow-hidden'} 
        `}
      >
        {/* Toggle Button - Positioned on the RIGHT side of the sidebar header */}
        <div className="absolute top-4 -right-4 translate-x-full z-[60]">
          <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
             title={isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
          >
             {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        <div className="p-6 pb-4 mt-2">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Main Menu</h2>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveView('overview')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 border border-transparent ${activeView === 'overview' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : ''}`}
            >
               <div className="flex items-center gap-3">
                 <LayoutDashboard className="w-5 h-5" />
                 <span className="font-medium">Overview</span>
               </div>
            </button>

            {navItems.map((item) => (
              <div key={item.id} className="group relative">
                <button 
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 border border-transparent ${activeView === item.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
                
                {/* Hover Submenu - Fixed positioning using high z-index and absolute placement outside sidebar */}
                <div className="absolute left-full top-0 ml-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block animate-in fade-in slide-in-from-left-2 duration-200 z-[100]">
                   <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800 mb-1">{item.label}</div>
                   {item.sub.map((subItem) => (
                     <div key={subItem} className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors flex items-center justify-between group/sub">
                       {subItem}
                       <ExternalLink size={12} className="opacity-0 group-hover/sub:opacity-50" />
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
               JD
             </div>
             <div>
               <div className="text-sm font-bold text-slate-900 dark:text-white">John Doe</div>
               <div className="text-xs text-slate-400">Admin Access</div>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button (Visible when sidebar is closed) */}
      {!isSidebarOpen && (
        <div className="absolute top-4 left-4 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <PanelLeftOpen size={20} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
        <div className="max-w-7xl mx-auto">
           {renderContent()}
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
          ALFRED
        </button>
      )}
    </div>
  );
}
