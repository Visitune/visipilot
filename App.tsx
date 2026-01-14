import React, { useState } from 'react';
import { TabView, TempLog, DeliveryLog, CleaningTask, LabelLog, CoolingLog } from './types';
import { LayoutDashboard, Thermometer, Tag, ClipboardCheck, Truck, Snowflake } from './components/Icons';
import Dashboard from './components/Dashboard';
import TemperatureLog from './components/TemperatureLog';
import LabelPrinter from './components/LabelPrinter';
import CleaningPlan from './components/CleaningPlan';
import IncomingGoods from './components/IncomingGoods';
import CoolingLogComponent from './components/CoolingLog';
import useLocalStorage from './hooks/useLocalStorage';

// --- INITIAL DATA (Simulating Database) ---
const INITIAL_TEMP_LOGS: TempLog[] = [
  { id: '1', equipment: 'Chambre Froide 1', temperature: 3.2, timestamp: new Date(Date.now() - 3600000 * 2), status: 'ok', user: 'Chef Michel' },
  { id: '2', equipment: 'Congélateur A', temperature: -21.0, timestamp: new Date(Date.now() - 3600000 * 4), status: 'ok', user: 'Chef Michel' },
  { id: '3', equipment: 'Vitrine', temperature: 5.8, timestamp: new Date(Date.now() - 3600000 * 6), status: 'warning', user: 'Sophie' },
];

const INITIAL_DELIVERY_LOGS: DeliveryLog[] = [
  { id: '1', supplier: 'Metro', product: 'Saumon Frais', temperature: 2.1, batchNumber: 'BATCH-001', status: 'ok', timestamp: new Date(Date.now() - 86400000) }
];

const INITIAL_CLEANING_TASKS: CleaningTask[] = [
  { id: '1', area: 'Cuisine', taskName: 'Désinfection Plans de travail', frequency: 'Daily', isDone: false },
  { id: '2', area: 'Cuisine', taskName: 'Nettoyage Sols', frequency: 'Daily', isDone: true, doneAt: new Date(), user: 'Chef', proofPhoto: 'mock' },
  { id: '3', area: 'Plonge', taskName: 'Vidange Lave-Vaisselle', frequency: 'Daily', isDone: false },
  { id: '4', area: 'Stockage', taskName: 'Nettoyage Étagères', frequency: 'Weekly', isDone: false },
];

const INITIAL_COOLING_LOGS: CoolingLog[] = [
  { id: '1', product: 'Bolognaise', batchNumber: 'LOT-99', startTime: new Date(Date.now() - 7200000), startTemp: 65, endTime: new Date(Date.now() - 3600000), endTemp: 8, durationMinutes: 60, status: 'ok', user: 'Chef Michel' }
];

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.DASHBOARD);
  
  // --- CENTRALIZED STATE ---
  const [tempLogs, setTempLogs] = useLocalStorage<TempLog[]>('tempLogs', INITIAL_TEMP_LOGS);
  const [deliveryLogs, setDeliveryLogs] = useLocalStorage<DeliveryLog[]>('deliveryLogs', INITIAL_DELIVERY_LOGS);
  const [cleaningTasks, setCleaningTasks] = useLocalStorage<CleaningTask[]>('cleaningTasks', INITIAL_CLEANING_TASKS);
  const [coolingLogs, setCoolingLogs] = useLocalStorage<CoolingLog[]>('coolingLogs', INITIAL_COOLING_LOGS);
  const [labelHistory, setLabelHistory] = useLocalStorage<LabelLog[]>('labelHistory', []);

  // --- HANDLERS (Business Logic) ---
  const handleAddTempLog = (log: TempLog) => {
    setTempLogs(prev => [log, ...prev]);
  };

  const handleAddDeliveryLog = (log: DeliveryLog) => {
    setDeliveryLogs(prev => [log, ...prev]);
  };

  const handleUpdateCleaningTask = (taskId: string, isDone: boolean, photoUrl?: string) => {
    setCleaningTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (!isDone) {
          // Reset task
          return { ...t, isDone: false, doneAt: undefined, user: undefined, proofPhoto: undefined };
        }
        // Complete task
        return { 
          ...t, 
          isDone: true, 
          doneAt: new Date(), 
          user: 'Chef Michel', // Simulated current user
          proofPhoto: photoUrl
        };
      }
      return t;
    }));
  };

  const handleAddLabel = (label: LabelLog) => {
    setLabelHistory(prev => [label, ...prev]);
  };

  const handleAddCoolingLog = (log: CoolingLog) => {
    setCoolingLogs(prev => [log, ...prev]);
  };

  const navItems = [
    { id: TabView.DASHBOARD, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: TabView.TEMPERATURES, label: 'Relevés Temp.', icon: Thermometer },
    { id: TabView.COOLING, label: 'Refroidissement', icon: Snowflake },
    { id: TabView.LABELS, label: 'Étiquettes', icon: Tag },
    { id: TabView.CLEANING, label: 'Nettoyage', icon: ClipboardCheck },
    { id: TabView.DELIVERIES, label: 'Réception', icon: Truck },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20 shadow-2xl">
        <div className="p-5 flex items-center justify-center border-b border-slate-800">
          <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center mr-3 text-white font-black text-lg shadow-lg transform rotate-3">
            V
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Visipilot
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg transition-all duration-200 group font-semibold text-sm ${
                currentTab === item.id
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${currentTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
             <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-500">CM</div>
             <div>
               <p className="text-white text-sm font-semibold">Chef Michel</p>
               <p className="text-slate-400 text-xs">Administrateur</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Mobile Top Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-3 flex md:hidden items-center justify-between z-20 sticky top-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center mr-2 text-white font-bold shadow-sm">V</div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Visipilot</span>
          </div>
          <div className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
            {navItems.find(i => i.id === currentTab)?.label}
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-6 pb-28 md:pb-8">
            
            {/* Context Header (Desktop Only) */}
            <div className="hidden md:flex mb-6 justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {navItems.find(i => i.id === currentTab)?.label}
                </h1>
                <p className="text-slate-500 mt-0.5 text-sm">Gestion HACCP • La Belle Assiette</p>
              </div>
              <div className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>

            {/* View Switcher with Passed Props for State Management */}
            <div className="animate-in fade-in duration-300">
              {currentTab === TabView.DASHBOARD && (
                <Dashboard 
                  tempLogs={tempLogs} 
                  deliveryLogs={deliveryLogs} 
                  cleaningTasks={cleaningTasks} 
                  coolingLogs={coolingLogs}
                />
              )}
              {currentTab === TabView.TEMPERATURES && (
                <TemperatureLog 
                  logs={tempLogs} 
                  onAddLog={handleAddTempLog} 
                />
              )}
              {currentTab === TabView.COOLING && (
                <CoolingLogComponent 
                  logs={coolingLogs}
                  onAddLog={handleAddCoolingLog}
                />
              )}
              {currentTab === TabView.LABELS && (
                <LabelPrinter 
                  onAddLabel={handleAddLabel} 
                  history={labelHistory}
                />
              )}
              {currentTab === TabView.CLEANING && (
                <CleaningPlan 
                  tasks={cleaningTasks} 
                  onUpdateTask={handleUpdateCleaningTask} 
                />
              )}
              {currentTab === TabView.DELIVERIES && (
                <IncomingGoods 
                  logs={deliveryLogs} 
                  onAddLog={handleAddDeliveryLog} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar - Octopus Style */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 px-2 pt-1 pb-safe shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-start">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex-1 min-w-[50px] flex flex-col items-center justify-center pt-1.5 pb-1 rounded-lg transition-colors duration-200 ${
                currentTab === item.id ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-6 h-6 mb-0.5 transition-all ${currentTab === item.id ? 'text-sky-500' : 'text-slate-400'}`} />
                {currentTab === item.id && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-sky-500 rounded-full"></span>
                )}
              </div>
              <span className="text-[10px] font-bold truncate w-full text-center leading-tight">
                {item.label.replace('Tableau de bord', 'Accueil').replace('Relevés Temp.', 'Temp').replace('Refroidissement', 'Froid').replace('Réception', 'Reçu')}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;