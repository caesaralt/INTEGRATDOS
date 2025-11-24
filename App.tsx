
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
  ChevronDown,
  ChevronUp,
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
  Wrench,
  Shield,
  Key,
  History,
  Check,
  Import,
  MessageSquare,
  Video,
  BookOpen,
  Award,
  Type,
  UserCheck,
  Send,
  CalendarDays,
  PauseCircle,
  Repeat,
  ShoppingCart,
  Link,
  Loader,
  Sliders,
  ChevronLeft,
  Bot
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import { User, UserRole, CanvasItem } from './types';
import { analyzeFloorplan } from './services/geminiService';

// --- Types ---
type ViewState = 'dashboard' | 'crm' | 'quotes' | 'canvas' | 'mapping' | 'board' | 'cad' | 'learning' | 'ops' | 'admin';

// Updated CRM View State to match requested structure
type CRMViewState = 
  | 'overview' 
  // People
  | 'employees' | 'clients' | 'suppliers' | 'contractors' | 'contacts'
  // Quotes
  | 'quotes_open' | 'quotes_sent' | 'quotes_expired' | 'quotes_supplier'
  // Jobs
  | 'jobs_progress' | 'jobs_upcoming' | 'jobs_pending' | 'jobs_finished' | 'jobs_recurring'
  // Schedules
  | 'calendar'
  // Materials
  | 'inventory' | 'orders'
  // Payments
  | 'payments_suppliers' | 'payments_us'
  // System
  | 'integrations' | 'settings';

// --- Constants ---
const AVAILABLE_MODULES = [
  { id: 'crm', title: 'CRM Dashboard', icon: LayoutDashboard, desc: 'Manage customers, projects, scheduling, inventory, and more.', color: 'text-blue-600 bg-blue-600', permission: 'crm' },
  { id: 'quotes', title: 'Quote Automation', icon: FileText, desc: 'AI-powered quote generation from floorplans.', color: 'text-yellow-600 bg-yellow-600', permission: 'quotes' },
  { id: 'canvas', title: 'Canvas Editor', icon: PenTool, desc: 'Professional floor plan editor with symbol management.', color: 'text-orange-600 bg-orange-600', permission: 'canvas' },
  { id: 'mapping', title: 'Electrical Mapping', icon: Zap, desc: 'Circuit mapping and load calculation.', color: 'text-amber-500 bg-amber-500', permission: 'mapping' },
  { id: 'board', title: 'Loxone Board Builder', icon: Cpu, desc: 'Design Loxone cabinet layouts.', color: 'text-slate-700 bg-slate-700', permission: 'board_builder' },
  { id: 'cad', title: 'Electrical CAD', icon: Settings, desc: 'Schematic design and DXF export.', color: 'text-emerald-700 bg-emerald-700', permission: 'electrical_cad' },
  { id: 'learning', title: 'AI Learning', icon: Brain, desc: 'System training and knowledge base.', color: 'text-pink-600 bg-pink-600', permission: 'learning' },
  { id: 'ops', title: 'Operations Board', icon: ClipboardList, desc: 'Kanban project tracking.', color: 'text-indigo-600 bg-indigo-600', permission: 'kanban' },
  { id: 'admin', title: 'Admin Panel', icon: Users, desc: 'User and permission management.', color: 'text-cyan-600 bg-cyan-600', permission: 'admin' },
];

const PERMISSION_KEYS = [
  { key: 'admin', label: 'Admin Panel', desc: 'admin' },
  { key: 'crm', label: 'CRM Dashboard', desc: 'crm' },
  { key: 'quotes', label: 'Quote Automation', desc: 'quotes' },
  { key: 'canvas', label: 'Canvas Editor', desc: 'canvas' },
  { key: 'mapping', label: 'Electrical Mapping', desc: 'mapping' },
  { key: 'board_builder', label: 'Board Builder', desc: 'board_builder' },
  { key: 'electrical_cad', label: 'Electrical CAD', desc: 'electrical_cad' },
  { key: 'learning', label: 'AI Learning', desc: 'learning' },
  { key: 'kanban', label: 'Operations Board', desc: 'kanban' },
];

const CRM_SUB_PERMISSIONS = [
  { key: 'crm_calendar', label: 'Calendar' },
  { key: 'crm_communications', label: 'Communications' },
  { key: 'crm_customers', label: 'Customers' },
  { key: 'crm_inventory', label: 'Inventory' },
  { key: 'crm_projects', label: 'Projects' },
  { key: 'crm_reports', label: 'Reports & Analytics' },
  { key: 'crm_stock', label: 'Stock Management' },
  { key: 'crm_suppliers', label: 'Suppliers' },
  { key: 'crm_technicians', label: 'Technicians' },
];

const SYMBOLS = [
  { id: 'light', label: 'Light', icon: Lightbulb, cost: 120, color: 'bg-yellow-500' },
  { id: 'sensor', label: 'Sensor', icon: Zap, cost: 180, color: 'bg-blue-500' },
  { id: 'shade', label: 'Shade', icon: Blinds, cost: 450, color: 'bg-orange-500' },
  { id: 'speaker', label: 'Speaker', icon: Speaker, cost: 250, color: 'bg-purple-500' },
  { id: 'cam', label: 'Camera', icon: Lock, cost: 350, color: 'bg-red-500' },
  { id: 'thermo', label: 'Thermostat', icon: Thermometer, cost: 200, color: 'bg-red-400' },
];

// --- Loxone Components for Board Builder ---
interface LoxoneComponent {
  id: string;
  name: string;
  type: 'controller' | 'extension' | 'power' | 'accessory';
  width: number; // in TE units
  power: number; // in Watts
  color: string;
}

const LOXONE_CATALOG: LoxoneComponent[] = [
  { id: 'miniserver', name: 'Miniserver Gen2', type: 'controller', width: 9, power: 2.4, color: 'bg-green-600' },
  { id: 'miniserver_compact', name: 'Miniserver Compact', type: 'controller', width: 6, power: 2.1, color: 'bg-green-600' },
  { id: 'relay_ext', name: 'Relay Extension', type: 'extension', width: 9, power: 3.5, color: 'bg-slate-700' },
  { id: 'dimmer_ext', name: 'Dimmer Extension', type: 'extension', width: 9, power: 3.5, color: 'bg-slate-700' },
  { id: 'di_ext', name: 'DI Extension', type: 'extension', width: 2, power: 0.9, color: 'bg-slate-600' },
  { id: 'ai_ext', name: 'AI Extension', type: 'extension', width: 2, power: 0.9, color: 'bg-slate-600' },
  { id: 'tree_ext', name: 'Tree Extension', type: 'extension', width: 2, power: 0.6, color: 'bg-green-700' },
  { id: 'air_base', name: 'Air Base Extension', type: 'extension', width: 2, power: 0.6, color: 'bg-green-700' },
  { id: 'psu_10a', name: 'Power Supply 10A', type: 'power', width: 6, power: 15, color: 'bg-slate-800' },
  { id: 'psu_4a', name: 'Power Supply 4A', type: 'power', width: 3, power: 8, color: 'bg-slate-800' },
];

// --- Shared Modal Component ---
const ItemModal = ({ isOpen, onClose, title, fields, onSave, initialData }: any) => {
  if (!isOpen) return null;
  
  const [formData, setFormData] = useState(initialData || {});
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData, isOpen]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const linkOptions = [
    { type: 'Project', items: ['PRJ-001: Smith Residence', 'PRJ-002: Downtown Loft'] },
    { type: 'Customer', items: ['John Smith', 'Sarah Connor', 'TechCorp Inc.'] },
    { type: 'Quote', items: ['Q-1001: Lighting Upgrade', 'Q-1002: Full Automation'] },
    { type: 'Supplier', items: ['Loxone US', 'DigiKey', 'Rexel'] },
  ];
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-[600px] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
           <button 
             onClick={() => setActiveTab('details')}
             className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
           >
             Details
           </button>
           <button 
             onClick={() => setActiveTab('links')}
             className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'links' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
           >
             Linked Items
           </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
           {activeTab === 'details' ? (
             fields.map((field: any, idx: number) => (
               <div key={idx}>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wide">{field.label}</label>
                 {field.type === 'select' ? (
                   <select 
                      value={formData[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-700 dark:text-slate-200"
                   >
                     {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                 ) : field.type === 'textarea' ? (
                   <textarea 
                      value={formData[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-700 dark:text-slate-200 min-h-[100px]" 
                      placeholder={field.placeholder} 
                   />
                 ) : field.type === 'custom' ? (
                    field.render(formData, handleChange)
                 ) : (
                   <input 
                      type={field.type || 'text'} 
                      value={formData[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-700 dark:text-slate-200" 
                      placeholder={field.placeholder} 
                   />
                 )}
               </div>
             ))
           ) : (
             <div className="space-y-6">
               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                  Connect this item to other entities in the system. Links create relationships between jobs, people, and inventory.
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wide">Link Type</label>
                 <select 
                   className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-200 mb-4"
                   onChange={(e) => handleChange('tempLinkType', e.target.value)}
                 >
                    <option value="">Select Entity Type...</option>
                    {linkOptions.map(opt => <option key={opt.type} value={opt.type}>{opt.type}</option>)}
                 </select>
               </div>
               
               {formData.tempLinkType && (
                 <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wide">Select Item to Link</label>
                    <select 
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-200"
                      onChange={(e) => {
                         const currentLinks = formData.linkedItems || [];
                         handleChange('linkedItems', [...currentLinks, { type: formData.tempLinkType, value: e.target.value }]);
                         handleChange('tempLinkType', ''); // Reset after add
                      }}
                    >
                        <option value="">Choose item...</option>
                        {linkOptions.find(o => o.type === formData.tempLinkType)?.items.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                 </div>
               )}

               <div className="mt-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Active Links</h4>
                  {(formData.linkedItems || []).length === 0 ? (
                    <div className="text-sm text-slate-400 italic">No links created yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {formData.linkedItems.map((link: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                           <div className="flex items-center gap-3">
                              <Link size={16} className="text-blue-500" />
                              <div>
                                <span className="text-xs font-bold text-slate-500 uppercase mr-2">{link.type}</span>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">{link.value}</span>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleChange('linkedItems', formData.linkedItems.filter((_: any, idx: number) => idx !== i))}
                             className="text-red-500 hover:text-red-700 p-1"
                           >
                              <X size={14} />
                           </button>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
             </div>
           )}
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={() => onSave(formData)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const GenericCRMList = ({ title, type, icon: Icon }: { title: string, type: string, icon: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 animate-in fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add {type}
        </button>
      </div>
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-slate-100 dark:bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon size={40} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No {title} Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
          There are no {title.toLowerCase()} recorded in the system yet. Start by adding a new one.
        </p>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add New ${type}`}
        onSave={(data: any) => { alert('Item created successfully with links!'); setIsModalOpen(false); }}
        fields={[
          { key: 'name', label: 'Name / Title', placeholder: `Enter ${type} name` },
          { key: 'desc', label: 'Description', type: 'textarea', placeholder: 'Additional details...' }
        ]}
      />
    </div>
  );
};

const QuoteAutomation = ({ onSaveToCRM }: { onSaveToCRM: (data: any) => void }) => {
  // --- STATE FOR WIZARD & EDITOR ---
  const [step, setStep] = useState<'setup' | 'editor'>('setup');
  
  // Setup State
  const [projectName, setProjectName] = useState('');
  const [automationTypes, setAutomationTypes] = useState({
    lighting: false,
    shading: false,
    security: false,
    climate: false,
    audio: false
  });
  const [pricingTier, setPricingTier] = useState('Standard');
  const [skipAI, setSkipAI] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Editor State
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ACTIONS ---

  // Handle File Upload in Setup
  const handleSetupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Generate Quote -> Transition to Editor
  const handleGenerateQuote = () => {
    if (!projectName) {
      alert("Please enter a project name.");
      return;
    }
    if (!uploadedImage) {
      alert("Please upload a floor plan PDF or Image.");
      return;
    }

    setStep('editor');
    
    // Trigger "AI" Analysis simulation based on selections
    if (!skipAI) {
      setIsAnalyzing(true);
      setTimeout(() => {
        simulateAIPlacement();
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const simulateAIPlacement = () => {
    const newItems: CanvasItem[] = [];
    
    // Add items based on selected automation types
    if (automationTypes.lighting) {
      for(let i=0; i<5; i++) newItems.push(createRandomItem('light'));
      for(let i=0; i<3; i++) newItems.push(createRandomItem('sensor')); // Presence sensors usually go with lighting
    }
    if (automationTypes.shading) {
      for(let i=0; i<4; i++) newItems.push(createRandomItem('shade'));
    }
    if (automationTypes.security) {
      for(let i=0; i<3; i++) newItems.push(createRandomItem('cam'));
    }
    if (automationTypes.climate) {
      for(let i=0; i<3; i++) newItems.push(createRandomItem('thermo'));
    }
    if (automationTypes.audio) {
      for(let i=0; i<4; i++) newItems.push(createRandomItem('speaker'));
    }

    // Default items if nothing selected but not skipped (fallback)
    if (newItems.length === 0 && !skipAI) {
       newItems.push(createRandomItem('light'));
    }

    setItems(newItems);
  };

  const createRandomItem = (typeId: string) => {
    const symbol = SYMBOLS.find(s => s.id === typeId) || SYMBOLS[0];
    return {
      ...symbol,
      uid: Date.now() + Math.random(),
      type: typeId,
      x: 100 + Math.random() * 500,
      y: 100 + Math.random() * 400,
    } as CanvasItem;
  };

  // Editor Actions
  const handleDragStart = (e: React.DragEvent, uid: number) => {
    e.dataTransfer.setData('uid', uid.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
     e.preventDefault();
     const rect = containerRef.current?.getBoundingClientRect();
     if (!rect) return;
     
     const x = (e.clientX - rect.left) / zoom;
     const y = (e.clientY - rect.top) / zoom;
     
     const movedUid = e.dataTransfer.getData('uid');
     if (movedUid) {
         setItems(prev => prev.map(item => item.uid === Number(movedUid) ? { ...item, x, y } : item));
     }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
      if (selectedTool) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = (e.clientX - rect.left) / zoom;
          const y = (e.clientY - rect.top) / zoom;
          
          const symbol = SYMBOLS.find(s => s.id === selectedTool);
          if (symbol) {
              setItems(prev => [...prev, { ...symbol, uid: Date.now(), x, y } as CanvasItem]);
              setSelectedTool(null);
          }
      }
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + item.cost, 0);

  const handleSave = () => {
     const quoteData = {
         id: `Q-${Date.now()}`,
         projectName,
         items,
         total: calculateTotal(),
         date: new Date().toISOString().split('T')[0],
         status: 'Pending',
         image: uploadedImage,
         pricingTier
     };
     onSaveToCRM(quoteData);
     alert("Quote and Floorplan saved to CRM!");
  };

  // --- RENDER STEP 1: SETUP ---
  if (step === 'setup') {
    return (
      <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in p-8 overflow-y-auto">
         {/* Info Banner */}
         <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3 mb-8">
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full text-blue-600 dark:text-blue-300 shrink-0 mt-0.5">
               <Bot size={20} />
            </div>
            <div>
               <h3 className="font-bold text-blue-800 dark:text-blue-200 text-sm">How it works</h3>
               <p className="text-sm text-blue-600 dark:text-blue-300/80 mt-1">
                 Upload a floor plan PDF or image, select the automation types you want to include, and our AI will analyze the layout and generate an accurate quote instantly. You can then fine-tune the quote in the editor.
               </p>
            </div>
         </div>

         <div className="max-w-4xl mx-auto w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                   <Brain size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Floor Plan Analysis</h2>
                   <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your project parameters</p>
                </div>
             </div>
             
             <div className="p-8 space-y-8">
                {/* Project Name */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
                   <input 
                     type="text" 
                     value={projectName}
                     onChange={(e) => setProjectName(e.target.value)}
                     placeholder="Enter your project name"
                     className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-900 dark:text-white"
                   />
                </div>

                {/* File Upload */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Floor Plan PDF</label>
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${uploadedImage ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-green-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                   >
                      {uploadedImage ? (
                        <div className="flex flex-col items-center text-green-600">
                           <CheckCircle2 size={40} className="mb-2" />
                           <span className="font-bold">File Uploaded Successfully</span>
                           <span className="text-xs mt-1">Click to change</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                           <UploadCloud size={40} className="mb-4" />
                           <span className="font-bold text-slate-600 dark:text-slate-300">Drop your floor plan here, or <span className="text-green-600">browse</span></span>
                           <span className="text-xs mt-2">PDF, PNG, JPG files only (max 10MB)</span>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleSetupFile} />
                   </div>
                </div>

                {/* Automation Types */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Select Automation Types</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${automationTypes.lighting ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>
                         <input type="checkbox" checked={automationTypes.lighting} onChange={(e) => setAutomationTypes({...automationTypes, lighting: e.target.checked})} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                         <Lightbulb size={20} className="text-yellow-500" />
                         <span className="font-medium text-slate-700 dark:text-slate-200">Lighting Control</span>
                      </label>
                      <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${automationTypes.shading ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>
                         <input type="checkbox" checked={automationTypes.shading} onChange={(e) => setAutomationTypes({...automationTypes, shading: e.target.checked})} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                         <Blinds size={20} className="text-orange-500" />
                         <span className="font-medium text-slate-700 dark:text-slate-200">Shading Control</span>
                      </label>
                      <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${automationTypes.security ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>
                         <input type="checkbox" checked={automationTypes.security} onChange={(e) => setAutomationTypes({...automationTypes, security: e.target.checked})} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                         <Lock size={20} className="text-red-500" />
                         <span className="font-medium text-slate-700 dark:text-slate-200">Security & Access</span>
                      </label>
                      <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${automationTypes.climate ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>
                         <input type="checkbox" checked={automationTypes.climate} onChange={(e) => setAutomationTypes({...automationTypes, climate: e.target.checked})} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                         <Thermometer size={20} className="text-blue-500" />
                         <span className="font-medium text-slate-700 dark:text-slate-200">Climate Control</span>
                      </label>
                      <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${automationTypes.audio ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'}`}>
                         <input type="checkbox" checked={automationTypes.audio} onChange={(e) => setAutomationTypes({...automationTypes, audio: e.target.checked})} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                         <Speaker size={20} className="text-purple-500" />
                         <span className="font-medium text-slate-700 dark:text-slate-200">Audio System</span>
                      </label>
                   </div>
                </div>

                {/* Pricing Tier */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pricing Tier</label>
                   <select 
                      value={pricingTier}
                      onChange={(e) => setPricingTier(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                   >
                      <option>Basic - Standard Components</option>
                      <option>Standard - Smart Components</option>
                      <option>Premium - Luxury Finishes & Advanced Logic</option>
                   </select>
                </div>

                {/* Skip AI */}
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3">
                   <div className="pt-0.5">
                      <input type="checkbox" checked={skipAI} onChange={(e) => setSkipAI(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Skip AI Analysis - Manual Symbol Placement</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check this box to skip AI floor plan analysis and use random symbol placement based on selected automation types and package tier. This will be faster but less accurate.</p>
                   </div>
                </div>
             </div>

             <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                <button 
                   onClick={handleGenerateQuote}
                   className="w-full py-4 bg-green-700 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                >
                   <Zap className="fill-current" /> Generate Quote
                </button>
             </div>
         </div>
      </div>
    );
  }

  // --- RENDER STEP 2: EDITOR (Existing Logic) ---
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in">
        {/* Top Bar */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
            <div className="flex items-center gap-4">
               <button onClick={() => setStep('setup')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
                  <ArrowLeft size={20} />
               </button>
               <div>
                   <h2 className="text-lg font-bold text-slate-900 dark:text-white">{projectName}</h2>
                   <p className="text-xs text-slate-500">{pricingTier} Tier • {Object.keys(automationTypes).filter(k => (automationTypes as any)[k]).length} Systems</p>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
                 <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                     <Save size={16} /> Save to CRM
                 </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Breakdown & Tools */}
            <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 shadow-xl">
                 <div className="flex-1 overflow-y-auto p-4">
                     <div className="mb-6">
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Symbol Toolbox</h3>
                         <div className="grid grid-cols-2 gap-2">
                             {SYMBOLS.map(sym => (
                                 <button 
                                   key={sym.id}
                                   onClick={() => setSelectedTool(selectedTool === sym.id ? null : sym.id)}
                                   className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedTool === sym.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                                 >
                                     <div className={`p-2 rounded-full ${sym.color} text-white`}>
                                         <sym.icon size={16} />
                                     </div>
                                     <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{sym.label}</span>
                                     <span className="text-[10px] text-slate-500">${sym.cost}</span>
                                 </button>
                             ))}
                         </div>
                     </div>

                     <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quote Breakdown</h3>
                         <div className="space-y-2">
                             {items.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No items added yet.</p>}
                             {Object.values(items.reduce((acc: any, item) => {
                                 if (!acc[item.label]) acc[item.label] = { ...item, count: 0, totalCost: 0 };
                                 acc[item.label].count++;
                                 acc[item.label].totalCost += item.cost;
                                 return acc;
                             }, {})).map((group: any) => (
                                 <div key={group.label} className="flex justify-between items-center text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                     <div className="flex items-center gap-2">
                                         <span className="font-bold text-slate-700 dark:text-slate-200">{group.count}x</span>
                                         <span className="text-slate-600 dark:text-slate-400">{group.label}</span>
                                     </div>
                                     <span className="font-mono text-slate-700 dark:text-slate-200">${group.totalCost}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>

                 <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                     <div className="flex justify-between items-end mb-1">
                         <span className="text-sm text-slate-500 font-medium">Total Estimate</span>
                         <span className="text-2xl font-bold text-slate-900 dark:text-white">${calculateTotal().toLocaleString()}</span>
                     </div>
                 </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 bg-slate-200 dark:bg-black/40 relative overflow-hidden flex flex-col">
                 <div className="absolute top-4 right-4 z-20 flex bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1">
                    <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ZoomIn size={18}/></button>
                    <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ZoomOut size={18}/></button>
                 </div>

                 <div className="flex-1 overflow-auto flex items-center justify-center p-8 cursor-crosshair" onClick={handleCanvasClick}>
                     <div 
                       ref={containerRef}
                       className="relative shadow-2xl transition-transform duration-200 bg-white"
                       style={{ transform: `scale(${zoom})`, minWidth: uploadedImage ? 'auto' : '800px', minHeight: uploadedImage ? 'auto' : '600px' }}
                       onDragOver={(e) => e.preventDefault()}
                       onDrop={handleDrop}
                     >
                         {uploadedImage ? (
                             <img src={uploadedImage} alt="Floorplan" className="max-w-none pointer-events-none select-none" />
                         ) : (
                             <div className="w-[800px] h-[600px] bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                 <Grid size={64} className="mb-4 opacity-50" />
                                 <p className="text-lg font-medium">No floorplan loaded</p>
                             </div>
                         )}

                         {/* Render Items */}
                         {items.map(item => (
                             <div
                               key={item.uid}
                               draggable
                               onDragStart={(e) => handleDragStart(e, item.uid)}
                               onClick={(e) => { e.stopPropagation(); /* Prevent canvas click */ }}
                               style={{ left: item.x, top: item.y }}
                               className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg cursor-move active:scale-110 hover:ring-2 hover:ring-white transition-all group z-10 ${item.color} text-white`}
                             >
                                 {/* @ts-ignore */}
                                 <item.icon size={20} />
                                 
                                 {/* Tooltip / Delete Action */}
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                     {item.label} (${item.cost})
                                 </div>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); setItems(prev => prev.filter(i => i.uid !== item.uid)); }}
                                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
                                 >
                                    <X size={10} />
                                 </button>
                             </div>
                         ))}
                         
                         {/* Loading Overlay */}
                         {isAnalyzing && (
                             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
                                 <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl flex flex-col items-center animate-in zoom-in-95">
                                     <Brain size={48} className="text-purple-500 mb-4 animate-pulse" />
                                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">AI Analyzing Layout</h3>
                                     <p className="text-slate-500 text-sm">Detecting rooms and placing sensors...</p>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

const CanvasEditor = () => {
  const [items, setItems] = useState<any[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleAddItem = (symbol: any) => {
     const newItem = {
         ...symbol,
         uid: Date.now(),
         x: 350 + Math.random() * 100,
         y: 250 + Math.random() * 100
     };
     setItems([...items, newItem]);
  };

  const handleDragStart = (e: React.DragEvent, uid: number) => {
     e.dataTransfer.setData('uid', uid.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
     e.preventDefault();
     const uid = Number(e.dataTransfer.getData('uid'));
     const rect = e.currentTarget.getBoundingClientRect();
     const x = (e.clientX - rect.left) / zoom; // Adjust for zoom
     const y = (e.clientY - rect.top) / zoom;

     setItems(prev => prev.map(item => item.uid === uid ? { ...item, x, y } : item));
  };

  const handleSave = () => {
      alert(`Layout saved! ${items.length} items placed.`);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-300">
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
         <h2 className="text-xl font-bold text-slate-900 dark:text-white">Canvas Editor</h2>
         <div className="flex gap-2">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ZoomIn size={20}/></button>
            <span className="flex items-center text-xs font-mono text-slate-500 w-12 justify-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ZoomOut size={20}/></button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">Save Layout</button>
         </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
         <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 font-bold text-slate-500 text-xs uppercase">Toolbox</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
               {SYMBOLS.map(sym => (
                  <button 
                    key={sym.id} 
                    onClick={() => handleAddItem(sym)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                     <div className={`p-2 rounded ${sym.color} text-white`}>
                        <sym.icon size={16} />
                     </div>
                     <div>
                        <div className="font-bold text-sm text-slate-700 dark:text-slate-200">{sym.label}</div>
                        <div className="text-xs text-slate-500">${sym.cost}</div>
                     </div>
                  </button>
               ))}
            </div>
         </div>
         <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
            <div 
              className="w-[800px] h-[600px] bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoom})` }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
               <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               
               {items.length === 0 && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 pointer-events-none font-bold text-xl text-center">
                    Click items in toolbox to add <br/> Drag to move
                 </div>
               )}

               {items.map(item => (
                  <div 
                    key={item.uid}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.uid)}
                    style={{ left: item.x, top: item.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded shadow-lg cursor-move active:scale-110 transition-transform hover:ring-2 ring-blue-500 ${item.color} text-white`}
                  >
                     {/* @ts-ignore */}
                     <item.icon size={20} />
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const OperationsBoard = () => {
  const [tasks, setTasks] = useState<{ id: string, title: string, status: string }[]>([
    { id: '1', title: 'Order Loxone Miniserver', status: 'To Do' },
    { id: '2', title: 'Draft Circuit Plan', status: 'In Progress' },
  ]);

  const addTask = (status: string) => {
    const title = prompt("Enter task name:");
    if (title) {
        setTasks([...tasks, { id: Date.now().toString(), title, status }]);
    }
  };

  const moveTask = (id: string, newStatus: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="h-full p-6 overflow-x-auto whitespace-nowrap bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-300">
      <div className="flex gap-6 h-full">
         {['To Do', 'In Progress', 'Blocked', 'Completed'].map((status) => (
           <div key={status} className="w-80 h-full inline-block align-top whitespace-normal">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-xl h-full flex flex-col max-h-full border border-slate-200 dark:border-slate-700">
                 <div className="p-4 font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center sticky top-0 bg-inherit rounded-t-xl z-10">
                    {status}
                    <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs">
                        {tasks.filter(t => t.status === status).length}
                    </span>
                 </div>
                 <div className="p-4 pt-0 flex-1 overflow-y-auto space-y-3">
                    {tasks.filter(t => t.status === status).map(task => (
                        <div key={task.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group">
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">{task.title}</div>
                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                {status !== 'To Do' && <button onClick={() => moveTask(task.id, 'To Do')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Move to To Do"><ArrowLeft size={12} /></button>}
                                {status !== 'Completed' && <button onClick={() => moveTask(task.id, 'Completed')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Move to Completed"><Check size={12} /></button>}
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={() => addTask(status)}
                        className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                       + Add Task
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

const ElectricalCAD = () => {
   const [activeTool, setActiveTool] = useState('select');

   const handleToolClick = (tool: string) => {
     setActiveTool(tool);
   };

   const handleExport = () => {
     alert('Exporting current schematic to DXF...');
   };

   return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in">
       <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
         <h2 className="text-xl font-bold text-slate-900 dark:text-white">Electrical CAD</h2>
         <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Layers size={20}/></button>
            <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">Export DXF</button>
         </div>
      </div>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden cursor-crosshair">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="text-center relative z-10 p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-200 dark:border-slate-800">
             <Settings size={48} className="mx-auto text-blue-500 mb-4 animate-spin-slow" />
             <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">CAD Workstation</h2>
             <p className="text-slate-500 mb-4">Active Tool: <span className="font-mono font-bold uppercase">{activeTool}</span></p>
             <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => handleToolClick('draw')} 
                  className={`p-3 rounded-lg hover:scale-110 transition-transform ${activeTool === 'draw' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <PenTool size={20} />
                </button>
                <button 
                  onClick={() => handleToolClick('rect')} 
                  className={`p-3 rounded-lg hover:scale-110 transition-transform ${activeTool === 'rect' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <Square size={20} />
                </button>
                <button 
                  onClick={() => handleToolClick('text')} 
                  className={`p-3 rounded-lg hover:scale-110 transition-transform ${activeTool === 'text' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <Type size={20} />
                </button>
             </div>
          </div>
      </div>
    </div>
   );
};

const AILearning = () => {
    const modules = [
        { id: 1, title: 'Loxone Config Basics', type: 'Video', duration: '15 min', progress: 100 },
        { id: 2, title: 'Advanced Lighting Logic', type: 'Article', duration: '10 min', progress: 45 },
        { id: 3, title: 'Security Integration Protocols', type: 'Course', duration: '1 hr', progress: 0 },
        { id: 4, title: 'HVAC Control Systems', type: 'Video', duration: '25 min', progress: 0 },
    ];

    const handleModuleClick = (title: string) => {
        alert(`Launching course: ${title}`);
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Learning Center</h2>
                    <p className="text-slate-500 dark:text-slate-400">Enhance your skills with tailored courses</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Level 4 Technician</div>
                        <div className="text-xs text-slate-500">1,250 XP</div>
                    </div>
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                        <Award size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((mod) => (
                    <div 
                        key={mod.id} 
                        onClick={() => handleModuleClick(mod.title)}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${mod.type === 'Video' ? 'bg-red-100 text-red-600' : mod.type === 'Article' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                {mod.type === 'Video' ? <Video size={20} /> : mod.type === 'Article' ? <BookOpen size={20} /> : <Brain size={20} />}
                            </div>
                            {mod.progress === 100 && <div className="text-green-500"><CheckCircle2 size={20} /></div>}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{mod.title}</h3>
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-500">{mod.duration}</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{mod.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${mod.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ id: string, title: string, time: string, date: string, linkedTo?: { type: string, value: string } }[]>([
    { id: '1', title: 'Site Visit - Smith', time: '10:00 AM', date: new Date().toISOString().split('T')[0], linkedTo: { type: 'Project', value: 'PRJ-001' } },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const handleAddEvent = (data: any) => {
    const newEvent = {
        id: Date.now().toString(),
        title: data.title,
        time: data.time || '12:00 PM',
        date: data.date || new Date().toISOString().split('T')[0],
        linkedTo: data.linkedItems && data.linkedItems.length > 0 ? data.linkedItems[0] : undefined
    };
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-8 h-full flex flex-col animate-in fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar</h2>
            <div className="flex gap-2">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ChevronLeft size={20} /></button>
                <span className="text-lg font-bold min-w-[150px] text-center">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ChevronRight size={20} /></button>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={16} /> New Event
            </button>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-4 text-center font-bold text-slate-500 text-xs uppercase">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-r border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                    const dayEvents = events.filter(e => e.date === dateStr);
                    
                    return (
                        <div key={day} className="border-r border-b border-slate-100 dark:border-slate-700/50 p-2 min-h-[100px] relative hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                            <span className={`text-sm font-bold ${dayEvents.length > 0 ? 'text-blue-600' : 'text-slate-400'}`}>{day}</span>
                            <div className="mt-2 space-y-1">
                                {dayEvents.map(event => (
                                    <div key={event.id} className="text-xs p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800/50 truncate cursor-pointer hover:scale-105 transition-transform">
                                        <div className="font-bold">{event.time}</div>
                                        <div>{event.title}</div>
                                        {event.linkedTo && (
                                            <div className="mt-1 pt-1 border-t border-blue-200 dark:border-blue-800/50 flex items-center gap-1 text-[9px] opacity-80">
                                                <Link size={8} /> {event.linkedTo.value}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button 
                              onClick={() => { setIsModalOpen(true); }}
                              className="absolute top-2 right-2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Plus size={14} className="text-slate-400" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

        <ItemModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Schedule New Event"
            onSave={handleAddEvent}
            fields={[
                { key: 'title', label: 'Event Title', placeholder: 'e.g. Client Meeting' },
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'time', label: 'Time', type: 'time' },
                { key: 'description', label: 'Description', type: 'textarea' }
            ]}
        />
    </div>
  );
};

const ProjectsView = () => {
  const [projects, setProjects] = useState([
    { id: 'PRJ-001', name: 'Smith Residence Automation', client: 'John Smith', status: 'In Progress', deadline: '2025-06-15', progress: 45 },
    { id: 'PRJ-002', name: 'Downtown Loft Reno', client: 'Sarah Connor', status: 'Planning', deadline: '2025-07-01', progress: 10 },
    { id: 'PRJ-003', name: 'Westside Office Security', client: 'TechCorp Inc.', status: 'Completed', deadline: '2025-04-20', progress: 100 },
    { id: 'PRJ-004', name: 'Lakeside Villa Lighting', client: 'Bruce Wayne', status: 'In Progress', deadline: '2025-08-30', progress: 60 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveProject = (data: any) => {
      const newProject = {
          id: `PRJ-00${projects.length + 1}`,
          name: data.name,
          client: data.client,
          status: 'Planning',
          deadline: data.deadline || '2025-12-31',
          progress: 0
      };
      setProjects([...projects, newProject]);
      setIsModalOpen(false);
  };

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Projects In Progress</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-600/20 transition-all">
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                <Briefcase size={20} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {project.status}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{project.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{project.client} • {project.id}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center text-xs text-slate-500">
                <CalendarIcon size={14} className="mr-1.5" />
                {project.deadline}
              </div>
              <button onClick={() => alert(`Opening ${project.name}`)} className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                View Details <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        onSave={handleSaveProject}
        fields={[
            { key: 'name', label: 'Project Name', placeholder: 'e.g. Miller Renovation' },
            { key: 'client', label: 'Client Name', placeholder: 'e.g. Alice Miller' },
            { key: 'deadline', label: 'Target Deadline', type: 'date' }
        ]}
      />
    </div>
  );
};

const InventoryView = () => {
  const [items, setItems] = useState([
      {name: 'Miniserver', stock: 12, sku: 'LX-1001'}, 
      {name: 'Relay Extension', stock: 4, sku: 'LX-2004'}, 
      {name: 'Dimmer', stock: 8, sku: 'LX-2005'}
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = (data: any) => {
      setItems([...items, { name: data.name, stock: Number(data.stock), sku: data.sku }]);
      setIsModalOpen(false);
  };

  return (
    <div className="p-8 animate-in fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Stock</h2>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition-colors">Add Item</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
                <div key={item.sku} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${item.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {item.stock} in stock
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">SKU: {item.sku}</div>
                </div>
            ))}
        </div>
        <ItemModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add Inventory Item"
            onSave={handleAddItem}
            fields={[
                { key: 'name', label: 'Item Name', placeholder: 'e.g. Touch Switch' },
                { key: 'stock', label: 'Initial Stock', type: 'number', placeholder: '0' },
                { key: 'sku', label: 'SKU', placeholder: 'LX-XXXX' }
            ]}
        />
    </div>
  );
};

const ModuleCard: React.FC<{
  title: string;
  icon: React.ElementType;
  desc: string;
  color: string;
  onClick: () => void;
}> = ({ title, icon: Icon, desc, color, onClick }) => (
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

const ElectricalMapping = ({ onBack }: { onBack: () => void }) => {
  const [circuits, setCircuits] = useState(Array.from({ length: 42 }, (_, i) => ({
    id: i + 1,
    label: i % 2 === 0 ? 'Spare' : i % 3 === 0 ? 'Lighting' : 'Power',
    amps: i % 3 === 0 ? 15 : 20,
    pole: 1,
    phase: ['A', 'B', 'C'][i % 3]
  })));
  const [zoom, setZoom] = useState(1);

  const handleRowAction = (id: number) => {
    alert(`Options for Circuit #${id}`);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-300">
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Electrical Mapping</h2>
            <p className="text-xs text-slate-500">Panel Schedule & Load Calculation</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 overflow-y-auto p-6">
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                 <h3 className="font-bold text-slate-900 dark:text-white">Main Distribution Board</h3>
                 <span className="text-xs font-mono text-slate-400">MDB-01</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 w-24">Amps</th>
                      <th className="px-4 py-3 w-20">Pole</th>
                      <th className="px-4 py-3 w-20">Phase</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {circuits.map((c) => (
                      <tr key={c.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-2 font-mono text-slate-400">#{c.id}</td>
                        <td className="px-4 py-2">
                          <input 
                            className="bg-transparent w-full outline-none text-slate-700 dark:text-slate-200 font-medium placeholder-slate-300" 
                            defaultValue={c.label} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${c.amps > 20 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                            {c.amps}A
                          </span>
                        </td>
                        <td className="px-4 py-2 text-slate-500">{c.pole}P</td>
                        <td className="px-4 py-2">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${c.phase === 'A' ? 'bg-red-500' : c.phase === 'B' ? 'bg-white border border-slate-300' : 'bg-blue-500'}`}></div>
                             <span className="text-slate-500">{c.phase}</span>
                           </div>
                        </td>
                        <td className="px-4 py-2">
                          <button onClick={() => handleRowAction(c.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all text-slate-400">
                            <MoreVertical size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
        <div className="w-full lg:w-96 bg-slate-100 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
           <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider">Visual Board</h3>
              <div className="flex gap-2">
                <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))} className="p-1.5 bg-white dark:bg-slate-800 rounded shadow-sm hover:bg-slate-50"><ZoomIn size={14} className="text-slate-500" /></button>
                <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} className="p-1.5 bg-white dark:bg-slate-800 rounded shadow-sm hover:bg-slate-50"><ZoomOut size={14} className="text-slate-500" /></button>
              </div>
           </div>
           
           <div 
             className="bg-slate-300 dark:bg-slate-800 p-4 rounded-xl shadow-inner border-4 border-slate-400 dark:border-slate-700 mx-auto max-w-xs transition-transform origin-top"
             style={{ transform: `scale(${zoom})` }}
           >
              <div className="bg-slate-200 dark:bg-slate-900 rounded-lg p-2 space-y-1">
                 {Array.from({ length: Math.ceil(circuits.length / 2) }).map((_, rowIdx) => {
                    const left = circuits[rowIdx * 2];
                    const right = circuits[rowIdx * 2 + 1];
                    return (
                      <div key={rowIdx} className="flex items-center justify-between gap-4 h-8">
                         <div className="flex-1 h-full flex items-center justify-end">
                            {left && (
                              <div className={`h-full w-full rounded-l flex items-center justify-center text-[10px] font-bold text-white border-r border-slate-900/20 ${left.label === 'Spare' ? 'bg-slate-400' : 'bg-slate-800'}`}>
                                {left.amps}
                              </div>
                            )}
                         </div>
                         <div className="w-4 h-full bg-slate-400 dark:bg-slate-700 flex flex-col justify-center items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                            <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                         </div>
                         <div className="flex-1 h-full flex items-center justify-start">
                           {right && (
                              <div className={`h-full w-full rounded-r flex items-center justify-center text-[10px] font-bold text-white border-l border-slate-900/20 ${right.label === 'Spare' ? 'bg-slate-400' : 'bg-slate-800'}`}>
                                {right.amps}
                              </div>
                           )}
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const BoardBuilder = ({ onBack }: { onBack: () => void }) => {
  const [rails, setRails] = useState<{ id: number; items: { comp: LoxoneComponent; instanceId: string }[] }[]>([
    { id: 1, items: [] },
    { id: 2, items: [] },
    { id: 3, items: [] },
    { id: 4, items: [] },
  ]);
  const [zoom, setZoom] = useState(1);

  const handleDrop = (railId: number, componentId: string) => {
     const component = LOXONE_CATALOG.find(c => c.id === componentId);
     if (!component) return;
     setRails(prev => prev.map(rail => {
       if (rail.id === railId) {
         const currentWidth = rail.items.reduce((sum, item) => sum + item.comp.width, 0);
         if (currentWidth + component.width > 24) {
            alert('Not enough space on this rail (Max 24 TE).');
            return rail;
         }
         return { ...rail, items: [...rail.items, { comp: component, instanceId: Date.now().toString() }] };
       }
       return rail;
     }));
  };

  const removeFromRail = (railId: number, instanceId: string) => {
      setRails(prev => prev.map(rail => {
          if (rail.id === railId) return { ...rail, items: rail.items.filter(i => i.instanceId !== instanceId) };
          return rail;
      }));
  };

  const totalPower = rails.flatMap(r => r.items).reduce((sum, i) => sum + i.comp.power, 0);
  const totalModules = rails.flatMap(r => r.items).length;

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-300">
       <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
               <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Loxone Board Builder</h2>
          </div>
          <div className="flex gap-4 text-sm items-center">
             <div className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
                <span className="font-bold">{totalModules}</span> Modules
             </div>
             <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg">
                <span className="font-bold">{totalPower.toFixed(1)}W</span> Consumption
             </div>
             <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                 <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><ZoomIn size={16}/></button>
                 <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><ZoomOut size={16}/></button>
             </div>
          </div>
       </div>
       <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4">
             <h3 className="font-bold text-slate-500 uppercase text-xs mb-4">Components</h3>
             <div className="space-y-3">
                {LOXONE_CATALOG.map(comp => (
                   <div 
                     key={comp.id} 
                     draggable 
                     onDragStart={(e) => e.dataTransfer.setData('componentId', comp.id)}
                     className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 cursor-grab active:cursor-grabbing hover:border-green-500 transition-colors group"
                   >
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-sm text-slate-900 dark:text-white">{comp.name}</span>
                         <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">{comp.width} TE</span>
                      </div>
                      <div className="text-xs text-slate-500">{comp.type} • {comp.power}W</div>
                   </div>
                ))}
             </div>
          </div>
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 overflow-y-auto flex justify-center">
             <div className="w-full max-w-4xl" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
                 <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-300 dark:border-slate-700 overflow-hidden">
                    <div className="bg-slate-200 dark:bg-slate-800 p-3 border-b border-slate-300 dark:border-slate-700 text-center font-bold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-widest">
                       Main Automation Cabinet (4 Row / 96 TE)
                    </div>
                    <div className="p-8 space-y-8 bg-slate-100 dark:bg-slate-950/50 relative">
                       <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                       {rails.map(rail => (
                          <div 
                            key={rail.id}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(rail.id, e.dataTransfer.getData('componentId'))}
                            className="relative h-32 bg-slate-200/50 dark:bg-slate-800/30 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center px-4 transition-all hover:border-green-400"
                          >
                             <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-6 bg-slate-300 dark:bg-slate-600 shadow-inner border-y border-slate-400 dark:border-slate-500"></div>
                             <div className="relative z-10 flex h-24 items-center">
                                {rail.items.map((item, idx) => (
                                   <div 
                                     key={item.instanceId}
                                     className={`h-full ${item.comp.color} text-white rounded shadow-lg flex flex-col items-center justify-center relative group border-b-4 border-black/20 hover:scale-105 transition-transform z-10`}
                                     style={{ width: `${item.comp.width * 18}px`, marginRight: '1px' }}
                                     title={item.comp.name}
                                   >
                                      <div className="text-[9px] font-bold text-center leading-tight px-1 truncate w-full opacity-80">{item.comp.name}</div>
                                      <div className="w-2 h-2 bg-black/30 rounded-full mt-2"></div>
                                      <button 
                                        onClick={() => removeFromRail(rail.id, item.instanceId)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20"
                                      >
                                        <X size={10} />
                                      </button>
                                   </div>
                                ))}
                             </div>
                             <div className="absolute right-2 bottom-2 text-[10px] text-slate-400 font-mono">Row {rail.id}</div>
                          </div>
                       ))}
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const AdminPanel = ({ users, setUsers, currentUser }: { users: User[], setUsers: any, currentUser: User }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'activity'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const activeUsers = users.filter(u => u.status === 'Active').length;
  const adminUsers = users.filter(u => u.role === UserRole.ADMIN).length;

  const handleSaveUser = (formData: any) => {
    // Generate permissions based on role if not customizing
    const defaultPermissions = AVAILABLE_MODULES.map(m => ({
      module: m.permission,
      access: formData.role === 'ADMIN' || (formData.role === 'MANAGER' && m.id !== 'admin') || (formData.role === 'TECHNICIAN' && ['crm', 'canvas', 'mapping', 'cad'].includes(m.id)) || (formData.role === 'SALES' && ['crm', 'quotes'].includes(m.id))
    }));

    // Add sub-permissions based on role
    if (formData.role === 'ADMIN') {
        defaultPermissions.push({ module: 'admin', access: true });
    }
    
    // Merge custom permissions if provided (handling the checkboxes from modal)
    const finalPermissions = PERMISSION_KEYS.map(pk => ({
       module: pk.desc,
       access: formData[`perm_${pk.key}`] !== undefined ? formData[`perm_${pk.key}`] : defaultPermissions.find(dp => dp.module === pk.desc)?.access || false
    }));

    if (editingUser) {
      setUsers(users.map((u) => u.id === editingUser.id ? { ...u, ...formData, permissions: finalPermissions } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email || `${formData.name.toLowerCase().replace(' ', '.')}@integratdliving.com`,
        role: formData.role,
        status: 'Active',
        lastLogin: 'Never',
        permissions: finalPermissions
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const renderPermissionsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Available Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERMISSION_KEYS.map((perm) => (
             <div key={perm.key} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
               <div className="font-bold text-slate-900 dark:text-white">{perm.label}</div>
               <div className="text-xs text-slate-500 font-mono">{perm.desc}</div>
             </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">CRM Sub-Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CRM_SUB_PERMISSIONS.map((perm) => (
             <div key={perm.key} className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
               <div className="font-bold text-slate-900 dark:text-white">{perm.label}</div>
               <div className="text-xs text-slate-500 font-mono">{perm.key}</div>
             </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Role Definitions</h3>
        <div className="space-y-4">
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <span className="font-bold text-slate-900 dark:text-white">Administrator (admin)</span>
              <p className="text-sm text-slate-500 mt-1">Full access to all modules including Admin Panel.</p>
           </div>
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <span className="font-bold text-slate-900 dark:text-white">Manager (manager)</span>
              <p className="text-sm text-slate-500 mt-1">Access to all operational modules, no access to Admin Panel or Global Settings.</p>
           </div>
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <span className="font-bold text-slate-900 dark:text-white">Technician (technician)</span>
              <p className="text-sm text-slate-500 mt-1">Restricted access to technical modules (Canvas, Mapping, CAD) and limited CRM view.</p>
           </div>
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <span className="font-bold text-slate-900 dark:text-white">Viewer (viewer)</span>
              <p className="text-sm text-slate-500 mt-1">Read-only access to dashboards.</p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-300">
       {/* Admin Sidebar */}
       <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-lg">
             <UserCircle className="w-6 h-6" />
             Admin Panel
          </div>
          <nav className="p-4 space-y-1 flex-1">
             <div className="text-xs font-bold text-slate-400 uppercase mb-2 px-3 tracking-wider">Management</div>
             <button 
               onClick={() => setActiveTab('users')}
               className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'users' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
               <Users size={18} /> User Management
             </button>
             <button 
               onClick={() => setActiveTab('permissions')}
               className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'permissions' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
               <Key size={18} /> Permissions
             </button>
             <button 
               onClick={() => setActiveTab('activity')}
               className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'activity' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
               <BarChart3 size={18} /> Activity Log
             </button>
          </nav>
       </div>

       {/* Main Admin Content */}
       <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'users' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                   <h2 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h2>
                   <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage user accounts with role-based permissions</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{users.length}</div>
                      <div className="text-sm text-slate-500">Total Users</div>
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{activeUsers}</div>
                      <div className="text-sm text-slate-500">Active Users</div>
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{adminUsers}</div>
                      <div className="text-sm text-slate-500">Administrators</div>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                   <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">All Users</h3>
                      <button onClick={openCreateModal} className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20">
                         <Plus size={16} /> Create User
                      </button>
                   </div>
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                         <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Display Name</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                         {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                               <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{user.name}</td>
                               <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.name}</td>
                               <td className="px-6 py-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {user.role.toLowerCase()}
                                  </span>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     {user.status}
                                  </span>
                               </td>
                               <td className="px-6 py-4 text-slate-500 text-sm">{user.lastLogin}</td>
                               <td className="px-6 py-4 flex gap-2">
                                  <button onClick={() => openEditModal(user)} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Edit</button>
                                  <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === 'permissions' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Permissions Overview</h2>
                 <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage system permissions</p>
              </div>
              {renderPermissionsTab()}
            </div>
          )}
          
          {activeTab === 'activity' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Activity Log</h2>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center text-slate-400 border border-slate-200 dark:border-slate-700">
                   <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                   <p>No recent activity to display</p>
                </div>
             </div>
          )}
       </div>

       {/* Modal for User Edit/Create */}
       <ItemModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title={editingUser ? "Edit User" : "Create New User"}
         initialData={editingUser ? {
            name: editingUser.name,
            role: editingUser.role,
            ...editingUser.permissions.reduce((acc, p) => ({ ...acc, [`perm_${PERMISSION_KEYS.find(k => k.desc === p.module)?.key || p.module}`]: p.access }), {})
         } : { role: 'Viewer' }}
         onSave={handleSaveUser}
         fields={[
           { key: 'name', label: 'Name *', placeholder: 'e.g., John Doe' },
           { key: 'displayName', label: 'Display Name *', placeholder: 'e.g., John Smith' },
           { key: 'accessCode', label: 'Access Code *', placeholder: '4-6 digit code' },
           { key: 'role', label: 'Role *', type: 'select', options: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'SALES', 'VIEWER'] },
           { 
              key: 'permissions', 
              label: 'Permissions', 
              type: 'custom', 
              render: (data: any, handleChange: any) => (
                 <div className="space-y-2">
                    <div className="text-xs text-slate-500 mb-2">Select role above to auto-fill permissions, or customize individually</div>
                    <div className="grid grid-cols-2 gap-3">
                       {PERMISSION_KEYS.map(perm => (
                          <label key={perm.key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer">
                             <input 
                               type="checkbox" 
                               checked={data[`perm_${perm.key}`] || false}
                               onChange={(e) => handleChange(`perm_${perm.key}`, e.target.checked)}
                               className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                             />
                             <span className="text-sm text-slate-700 dark:text-slate-300">{perm.label}</span>
                          </label>
                       ))}
                    </div>
                 </div>
              )
           }
         ]}
       />
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currentCrmView, setCurrentCrmView] = useState<CRMViewState>('overview');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Main');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAIMinimized, setIsAIMinimized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulated Auth State
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Admin',
    email: 'admin@integratdliving.com',
    role: UserRole.ADMIN,
    status: 'Active',
    lastLogin: '21/11/2025',
    permissions: AVAILABLE_MODULES.map(m => ({ module: m.permission, access: true })).concat([{ module: 'admin', access: true }])
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin',
      email: 'admin@integratdliving.com',
      role: UserRole.ADMIN,
      status: 'Active',
      lastLogin: '21/11/2025',
      permissions: AVAILABLE_MODULES.map(m => ({ module: m.permission, access: true })).concat([{ module: 'admin', access: true }])
    }
  ]);

  // Global Lists for "Database" Simulation
  const [savedQuotes, setSavedQuotes] = useState<any[]>([]);
  const [crmProjects, setCrmProjects] = useState<any[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check permissions helper
  const hasAccess = (permissionKey: string) => {
    if (permissionKey === 'dashboard') return true;
    // Admins always have access
    if (currentUser.role === UserRole.ADMIN) return true;
    
    const perm = currentUser.permissions.find(p => p.module === permissionKey);
    return perm ? perm.access : false;
  };

  const handleLogout = () => {
    alert("Logged out successfully.");
    // In real app, clear token and redirect
  };
  
  const handleSaveQuoteToCRM = (quoteData: any) => {
      // 1. Save to Quotes List
      setSavedQuotes(prev => [...prev, quoteData]);
      
      // 2. Create/Update Project in CRM
      // For simplicity, we create a new project with the same name
      const newProject = {
          id: `PRJ-${Date.now().toString().slice(-4)}`,
          name: quoteData.projectName,
          client: 'New Client', // Placeholder
          status: 'Planning',
          deadline: new Date(Date.now() + 7776000000).toISOString().split('T')[0], // +90 days
          progress: 10
      };
      
      // This is local state for demo purposes, would be passed to ProjectsView if lifted or using context
      console.log("Saved Quote:", quoteData);
      console.log("Created Project:", newProject);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const renderContent = () => {
    // If checking CRM view specially
    if (currentView === 'crm') {
       if (!hasAccess('crm')) return <div className="p-10 text-center">Access Denied</div>;
       
       const CRM_NAV_ITEMS = [
        {
          category: 'Main',
          items: [
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard }
          ]
        },
        {
          category: 'People',
          items: [
            { id: 'employees', label: 'Employees', icon: UserCheck },
            { id: 'clients', label: 'Customers', icon: Users },
            { id: 'suppliers', label: 'Suppliers', icon: Truck },
            { id: 'contractors', label: 'Contractors', icon: HardHat },
            { id: 'contacts', label: 'Contacts', icon: Contact },
          ]
        },
        {
          category: 'Quotes',
          items: [
            { id: 'quotes_open', label: 'Open', icon: FileText },
            { id: 'quotes_sent', label: 'Sent', icon: Send },
            { id: 'quotes_expired', label: 'Expired', icon: Clock },
            { id: 'quotes_supplier', label: 'Supplier Quotes', icon: Download },
          ]
        },
        {
          category: 'Jobs',
          items: [
            { id: 'jobs_progress', label: 'In Progress', icon: Loader },
            { id: 'jobs_upcoming', label: 'Upcoming', icon: CalendarDays },
            { id: 'jobs_pending', label: 'Pending', icon: PauseCircle },
            { id: 'jobs_finished', label: 'Finished', icon: CheckSquare },
            { id: 'jobs_recurring', label: 'Recurring', icon: Repeat },
          ]
        },
        {
          category: 'Schedules',
          items: [
            { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
          ]
        },
        {
          category: 'Materials',
          items: [
            { id: 'inventory', label: 'Stock', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
          ]
        },
        {
          category: 'Payments',
          items: [
            { id: 'payments_suppliers', label: 'To Suppliers', icon: ArrowUpRight },
            { id: 'payments_us', label: 'To Us', icon: ArrowDownLeft },
          ]
        },
        {
          category: 'System',
          items: [
            { id: 'integrations', label: 'Integrations', icon: Link },
            { id: 'settings', label: 'Settings', icon: Sliders },
          ]
        }
      ];

       return (
         <div className="h-full flex bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-300">
            {/* CRM Sidebar */}
            <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
               {/* Simplified Sidebar Header / Removal of specific "CRM [X]" per request, kept simple back */}
               <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-bold">
                     <ArrowLeft size={16} /> Back to Dashboard
                  </button>
               </div>
               
               <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {CRM_NAV_ITEMS.map((section, idx) => (
                    <div key={idx} className="mb-2">
                      {section.category !== 'Main' ? (
                        <button 
                          onClick={() => toggleCategory(section.category)}
                          className="w-full px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                           {section.category}
                           {expandedCategory === section.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      ) : null}
                      
                      {/* Accordion Logic: Show if Main (always) or Expanded */}
                      {(section.category === 'Main' || expandedCategory === section.category) && (
                        <div className="space-y-0.5 mt-1 animate-in slide-in-from-top-1 duration-200">
                            {section.items.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setCurrentCrmView(item.id as CRMViewState)} 
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentCrmView === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                <item.icon size={18} /> {item.label}
                            </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
               </nav>
            </div>
            
            {/* CRM Content Area */}
            <div className="flex-1 overflow-y-auto relative">
               {currentCrmView === 'overview' && (
                  <div className="p-8">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard Overview</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Revenue" value="$124,500" trend="+12.5%" icon={DollarSign} onClick={() => alert("Viewing Revenue Reports")} />
                        <StatCard title="Active Projects" value="12" trend="+2" icon={Briefcase} onClick={() => setCurrentCrmView('jobs_progress')} />
                        <StatCard title="New Leads" value="24" trend="+5" icon={UserCircle} onClick={() => setCurrentCrmView('clients')} />
                        <StatCard title="Pending Quotes" value="8" icon={FileText} onClick={() => setCurrentView('quotes')} />
                     </div>
                  </div>
               )}
               {/* Jobs */}
               {currentCrmView === 'jobs_progress' && <ProjectsView />}
               
               {/* People */}
               {currentCrmView === 'clients' && (
                   <div className="p-8 animate-in fade-in">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Customers</h2>
                       <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                           <table className="w-full text-left">
                               <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-bold text-slate-500">
                                   <tr>
                                       <th className="px-6 py-4">Name</th>
                                       <th className="px-6 py-4">Email</th>
                                       <th className="px-6 py-4">Status</th>
                                       <th className="px-6 py-4">Projects</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                   {['John Smith', 'Sarah Connor', 'Bruce Wayne'].map(name => (
                                       <tr key={name} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer" onClick={() => alert(`Opening profile for ${name}`)}>
                                           <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{name}</td>
                                           <td className="px-6 py-4 text-slate-500">{name.toLowerCase().replace(' ', '.')}@email.com</td>
                                           <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Active</span></td>
                                           <td className="px-6 py-4 text-slate-500">2 Active</td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )}

               {/* Schedules */}
               {currentCrmView === 'calendar' && <CalendarView />}

               {/* Materials */}
               {currentCrmView === 'inventory' && <InventoryView />}
               
               {/* Generic Views for unimplemented sections */}
               {['employees', 'suppliers', 'contractors', 'contacts'].includes(currentCrmView) && (
                 <GenericCRMList title={currentCrmView.charAt(0).toUpperCase() + currentCrmView.slice(1)} type={currentCrmView} icon={Users} />
               )}
               
               {['quotes_open', 'quotes_sent', 'quotes_expired', 'quotes_supplier'].includes(currentCrmView) && (
                 <GenericCRMList title={currentCrmView.replace('quotes_', '').charAt(0).toUpperCase() + currentCrmView.replace('quotes_', '').slice(1) + ' Quotes'} type="quote" icon={FileText} />
               )}
               
               {['jobs_upcoming', 'jobs_pending', 'jobs_finished', 'jobs_recurring'].includes(currentCrmView) && (
                 <GenericCRMList title={currentCrmView.replace('jobs_', '').charAt(0).toUpperCase() + currentCrmView.replace('jobs_', '').slice(1) + ' Jobs'} type="job" icon={Briefcase} />
               )}
               
               {currentCrmView === 'orders' && <GenericCRMList title="Orders" type="order" icon={ShoppingCart} />}
               
               {['payments_suppliers', 'payments_us'].includes(currentCrmView) && (
                 <GenericCRMList title={currentCrmView === 'payments_suppliers' ? 'Payments to Suppliers' : 'Incoming Payments'} type="payment" icon={DollarSign} />
               )}
               
               {currentCrmView === 'integrations' && <GenericCRMList title="Integrations" type="integration" icon={Link} />}
               {currentCrmView === 'settings' && <GenericCRMList title="CRM Settings" type="setting" icon={Sliders} />}
            </div>
         </div>
       );
    }

    switch (currentView) {
      case 'mapping': return <ElectricalMapping onBack={() => setCurrentView('dashboard')} />;
      case 'board': return <BoardBuilder onBack={() => setCurrentView('dashboard')} />;
      case 'quotes': return <QuoteAutomation onSaveToCRM={handleSaveQuoteToCRM} />;
      case 'canvas': return <CanvasEditor />;
      case 'ops': return <OperationsBoard />;
      case 'cad': return <ElectricalCAD />;
      case 'learning': return <AILearning />;
      case 'admin': 
        if (!hasAccess('admin')) return <div className="p-10 text-center">Access Denied</div>;
        return <AdminPanel users={users} setUsers={setUsers} currentUser={currentUser} />;
      case 'dashboard':
      default:
        // Dashboard Main Grid
        const allowedModules = AVAILABLE_MODULES.filter(mod => 
          hasAccess(mod.permission)
        );
        const filteredModules = allowedModules.filter(m => 
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          m.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
             {filteredModules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredModules.map((mod) => (
                      <ModuleCard 
                         key={mod.id}
                         title={mod.title}
                         icon={mod.icon}
                         desc={mod.desc}
                         color={mod.color}
                         onClick={() => setCurrentView(mod.id as ViewState)}
                      />
                   ))}
                </div>
             ) : (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                   <Shield className="w-16 h-16 text-slate-300 mb-4" />
                   <h3 className="text-xl font-bold text-slate-500 mb-2">Access Restricted or No Results</h3>
                   <p className="text-slate-400 max-w-md">
                      You either don't have permission to view these modules, or no modules matched your search for "{searchQuery}".
                   </p>
                </div>
             )}
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Sidebar - Drawer Mode Global */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
               Integratd Living
            </span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
               <X size={20} className="text-slate-500"/>
            </button>
          </div>
          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
            <button 
               onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }}
               className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
               <LayoutDashboard size={18} /> Dashboard
            </button>
            
            <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Modules</div>
            
            {AVAILABLE_MODULES.filter(m => hasAccess(m.permission)).map(mod => (
              <button 
                 key={mod.id}
                 onClick={() => { setCurrentView(mod.id as ViewState); setIsSidebarOpen(false); }}
                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === mod.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                 <mod.icon size={18} /> {mod.title}
              </button>
            ))}
          </nav>
      </div>

      {/* Backdrop for Sidebar */}
      {isSidebarOpen && (
         <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-20">
          <div className="flex items-center gap-4">
             {/* Menu Button - Always visible now to toggle sidebar */}
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <Menu size={20} className="text-slate-600 dark:text-slate-300" />
             </button>
             
             {/* Home Button if deep in nav */}
             {currentView !== 'dashboard' && (
                 <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hidden md:block" title="Back to Dashboard">
                    <LayoutDashboard size={20} />
                 </button>
             )}
             
             {/* Center Search (visible on dashboard) */}
             {currentView === 'dashboard' && (
                <div className="hidden md:flex items-center w-96 relative">
                    <Search className="absolute left-3 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..." 
                      className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                    />
                </div>
             )}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* User Profile / Switcher for Demo */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-xs text-slate-500">{currentUser.role}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                {currentUser.name.charAt(0)}
              </div>
              
              {/* Quick Role Switcher for Testing */}
              <div className="flex flex-col gap-1 ml-2">
                 <button onClick={() => {
                    setCurrentUser({ ...currentUser, role: UserRole.ADMIN, name: 'Admin', permissions: AVAILABLE_MODULES.map(m => ({ module: m.permission, access: true })).concat([{ module: 'admin', access: true }]) });
                    setCurrentView('dashboard');
                 }} className="text-[10px] bg-slate-200 px-1 rounded hover:bg-slate-300">Admin</button>
                 <button onClick={() => {
                    setCurrentUser({ ...currentUser, role: UserRole.TECHNICIAN, name: 'Tech', permissions: AVAILABLE_MODULES.map(m => ({ module: m.permission, access: ['crm', 'canvas', 'mapping', 'cad'].includes(m.id) })) });
                    setCurrentView('dashboard');
                 }} className="text-[10px] bg-slate-200 px-1 rounded hover:bg-slate-300">Tech</button>
              </div>

              <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                 <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-950">
           {/* Background Elements */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/20 via-transparent to-transparent dark:from-green-900/10"></div>
           </div>
           
           <div className="h-full relative z-10 overflow-auto scrollbar-thin">
             {renderContent()}
           </div>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => { setIsAIAssistantOpen(false); setIsAIMinimized(false); }}
        onMinimize={() => { setIsAIAssistantOpen(false); setIsAIMinimized(true); }}
        isMinimized={isAIMinimized}
      />
      
      {/* AI Toggle Button (if closed) */}
      {!isAIAssistantOpen && !isAIMinimized && (
        <button 
          onClick={() => setIsAIAssistantOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-slate-900 to-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all group z-50 border border-white/10"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform text-green-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
        </button>
      )}
      
      {/* Minimized AI Bubble */}
      {isAIMinimized && (
        <AIAssistant 
          isOpen={true}
          onClose={() => { setIsAIAssistantOpen(false); setIsAIMinimized(false); }}
          onMinimize={() => { setIsAIMinimized(false); setIsAIAssistantOpen(true); }}
          isMinimized={true}
        />
      )}
    </div>
  );
};

export default App;
