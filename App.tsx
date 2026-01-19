import React, { useState, useEffect } from 'react';
import { TabView, TempLog, DeliveryLog, CleaningTask, LabelLog, CoolingLog, AppData, OilLog, DocItem } from './types';
import { LayoutDashboard, Thermometer, Tag, Bot, ClipboardCheck, Truck, Snowflake, Settings as SettingsIcon, BookOpen, Droplet, Folder, AlertTriangle } from './components/Icons';
import Dashboard from './components/Dashboard';
import TemperatureLog from './components/TemperatureLog';
import LabelPrinter from './components/LabelPrinter';
import AIAssistant from './components/AIAssistant';
import CleaningPlan from './components/CleaningPlan';
import IncomingGoods from './components/IncomingGoods';
import CoolingLogComponent from './components/CoolingLog';
import OilControl from './components/OilControl';
import DigitalSafe from './components/DigitalSafe';
import Settings from './components/Settings';
import UserGuide from './components/UserGuide';
import { dateReviver } from './utils/helpers';

// --- INITIAL DATA (Fallbacks) ---
const INITIAL_TEMP_LOGS: TempLog[] = [];
const INITIAL_DELIVERY_LOGS: DeliveryLog[] = [];

// Default lists if nothing is saved
const DEFAULT_EQUIPMENT = [
  'Chambre Froide Positive',
  'Chambre Froide Négative',
  'Timbre Office',
  'Vitrine Service',
  'Cellule Refroidissement'
];

const INITIAL_CLEANING_TASKS: CleaningTask[] = [
  { id: '1', area: 'Cuisine', taskName: 'Désinfection Plans de travail', frequency: 'Quotidien', isDone: false },
  { id: '2', area: 'Cuisine', taskName: 'Nettoyage Sols', frequency: 'Quotidien', isDone: false },
  { id: '3', area: 'Plonge', taskName: 'Vidange Lave-Vaisselle', frequency: 'Quotidien', isDone: false },
  { id: '4', area: 'Stockage', taskName: 'Nettoyage Étagères', frequency: 'Hebdo', isDone: false },
];

const INITIAL_COOLING_LOGS: CoolingLog[] = [];
const INITIAL_LABEL_HISTORY: LabelLog[] = [];
const INITIAL_OIL_LOGS: OilLog[] = [];
const INITIAL_DOCS: DocItem[] = [];

const LOCAL_STORAGE_KEY = 'visipilot_haccp_data_v1';
const LOGO_URL = "https://raw.githubusercontent.com/M00N69/RAPPELCONSO/main/logo%2004%20copie.jpg";

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.DASHBOARD);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  
  // --- STATE ---
  const [tempLogs, setTempLogs] = useState<TempLog[]>(INITIAL_TEMP_LOGS);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>(INITIAL_DELIVERY_LOGS);
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>(INITIAL_CLEANING_TASKS);
  const [coolingLogs, setCoolingLogs] = useState<CoolingLog[]>(INITIAL_COOLING_LOGS);
  const [labelHistory, setLabelHistory] = useState<LabelLog[]>(INITIAL_LABEL_HISTORY);
  const [oilLogs, setOilLogs] = useState<OilLog[]>(INITIAL_OIL_LOGS);
  const [documents, setDocuments] = useState<DocItem[]>(INITIAL_DOCS);
  
  // --- CONFIG STATE ---
  const [equipmentList, setEquipmentList] = useState<string[]>(DEFAULT_EQUIPMENT);

  // --- SETTINGS STATE ---
  const [apiKey, setApiKey] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('Mon Entreprise');
  const [managerName, setManagerName] = useState<string>('Responsable');

  // --- PERSISTENCE ---
  
  // Load on startup
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: AppData = JSON.parse(savedData, dateReviver);
        setTempLogs(parsed.tempLogs || []);
        setDeliveryLogs(parsed.deliveryLogs || []);
        setCoolingLogs(parsed.coolingLogs || []);
        setLabelHistory(parsed.labelHistory || []);
        setOilLogs(parsed.oilLogs || []);
        setDocuments(parsed.documents || []);
        
        if (parsed.cleaningTasks && parsed.cleaningTasks.length > 0) {
           setCleaningTasks(parsed.cleaningTasks);
        }
        
        // Load config lists
        if (parsed.equipmentList && parsed.equipmentList.length > 0) {
            setEquipmentList(parsed.equipmentList);
        }

        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.managerName) setManagerName(parsed.managerName);
      } catch (e) {
        console.error("Failed to load local storage data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (!isLoaded) return;
    
    const dataToSave: AppData = {
      tempLogs,
      deliveryLogs,
      cleaningTasks,
      coolingLogs,
      labelHistory,
      oilLogs,
      documents,
      equipmentList,
      apiKey,
      companyName,
      managerName
    };
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      setStorageWarning(false);
    } catch (e) {
      console.error("LocalStorage limit reached or error saving", e);
      setStorageWarning(true);
    }
  }, [tempLogs, deliveryLogs, cleaningTasks, coolingLogs, labelHistory, oilLogs, documents, equipmentList, apiKey, companyName, managerName, isLoaded]);


  // --- HANDLERS ---
  const handleAddTempLog = (log: TempLog) => setTempLogs(prev => [log, ...prev]);
  const handleEditTempLog = (updatedLog: TempLog) => {
      setTempLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleAddDeliveryLog = (log: DeliveryLog) => setDeliveryLogs(prev => [log, ...prev]);
  const handleEditDeliveryLog = (updatedLog: DeliveryLog) => {
      setDeliveryLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleAddLabel = (label: LabelLog) => setLabelHistory(prev => [label, ...prev]);
  
  const handleAddCoolingLog = (log: CoolingLog) => setCoolingLogs(prev => [log, ...prev]);
  const handleEditCoolingLog = (updatedLog: CoolingLog) => {
      setCoolingLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleAddOilLog = (log: OilLog) => setOilLogs(prev => [log, ...prev]);
  const handleDeleteOilLog = (id: string) => setOilLogs(prev => prev.filter(l => l.id !== id));

  const handleAddDoc = (doc: DocItem) => setDocuments(prev => [doc, ...prev]);
  const handleDeleteDoc = (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));

  const handleUpdateCleaningTask = (taskId: string, isDone: boolean, photo?: string) => {
    setCleaningTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (!isDone) {
          return { ...t, isDone: false, doneAt: undefined, user: undefined, proofPhoto: undefined };
        }
        return { 
          ...t, 
          isDone: true, 
          doneAt: new Date(), 
          user: managerName, 
          proofPhoto: photo 
        };
      }
      return t;
    }));
  };

  const handleUpdateConfig = (newEquipment: string[], newCleaningTasks: CleaningTask[]) => {
      setEquipmentList(newEquipment);
      setCleaningTasks(newCleaningTasks);
  };

  const handleRestoreData = (data: AppData) => {
    setTempLogs(data.tempLogs);
    setDeliveryLogs(data.deliveryLogs);
    setCleaningTasks(data.cleaningTasks);
    setCoolingLogs(data.coolingLogs);
    setLabelHistory(data.labelHistory);
    setOilLogs(data.oilLogs || []);
    setDocuments(data.documents || []);

    if (data.apiKey) setApiKey(data.apiKey);
    if (data.companyName) setCompanyName(data.companyName);
    if (data.managerName) setManagerName(data.managerName);
    if (data.equipmentList) setEquipmentList(data.equipmentList);
    
    // Attempt immediate save to check quota
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        setStorageWarning(false);
        alert("Données restaurées avec succès !");
    } catch (e) {
        setStorageWarning(true);
        alert("Données restaurées mais mémoire saturée ! Exportez un package de sécurité immédiatement.");
    }
  };

  const handleResetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setTempLogs(INITIAL_TEMP_LOGS);
    setDeliveryLogs(INITIAL_DELIVERY_LOGS);
    setCleaningTasks(INITIAL_CLEANING_TASKS);
    setCoolingLogs(INITIAL_COOLING_LOGS);
    setLabelHistory(INITIAL_LABEL_HISTORY);
    setOilLogs(INITIAL_OIL_LOGS);
    setDocuments(INITIAL_DOCS);
    setEquipmentList(DEFAULT_EQUIPMENT);
    setApiKey('');
    setCompanyName('Mon Entreprise');
    setManagerName('Responsable');
    setStorageWarning(false);
    window.location.reload();
  };
  
  const handleSaveApiKey = (key: string) => {
      setApiKey(key);
  };

  const handleSaveCompanyInfo = (name: string, manager: string) => {
      setCompanyName(name);
      setManagerName(manager);
  };

  const navItems = [
    { id: TabView.DASHBOARD, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: TabView.TEMPERATURES, label: 'Relevés Temp.', icon: Thermometer },
    { id: TabView.COOLING, label: 'Refroidissement', icon: Snowflake },
    { id: TabView.OILS, label: 'Huiles de Friture', icon: Droplet },
    { id: TabView.LABELS, label: 'Étiquettes', icon: Tag },
    { id: TabView.CLEANING, label: 'Nettoyage', icon: ClipboardCheck },
    { id: TabView.DELIVERIES, label: 'Réception', icon: Truck },
    { id: TabView.DOCS, label: 'Classeur', icon: Folder },
    { id: TabView.ASSISTANT, label: 'Assistant IA', icon: Bot },
  ];

  const bottomNavItems = [
    { id: TabView.GUIDE, label: 'Guide', icon: BookOpen },
    { id: TabView.SETTINGS, label: 'Paramètres', icon: SettingsIcon },
  ];

  if (!isLoaded) return <div className="flex items-center justify-center h-screen">Chargement...</div>;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      
      {/* Storage Warning Banner */}
      {storageWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 shadow-lg flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="font-bold text-sm">
                MEMOIRE PLEINE : Vos dernières modifications ne sont pas sauvegardées ! 
                Veuillez "Exporter le Package" dans les Paramètres puis "Réinitialiser" pour faire de la place.
            </span>
        </div>
      )}

      {/* Desktop Sidebar - Tablet & Desktop Mode */}
      <aside className={`w-64 bg-slate-900 border-r border-gray-800 hidden md:flex flex-col z-20 shadow-xl ${storageWarning ? 'mt-10' : ''}`}>
        <div className="p-6 flex items-center justify-center border-b border-gray-800">
          <div className="mr-3 shadow-lg transform rotate-3 bg-white rounded-xl overflow-hidden w-10 h-10">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            VISI-JN
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${
                currentTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${currentTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
              {item.label}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-800">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${
                  currentTab === item.id
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${currentTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 bg-slate-950">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                 {managerName.substring(0,2).toUpperCase()}
             </div>
             <div>
               <p className="text-white text-sm font-semibold truncate w-32">{managerName}</p>
               <p className="text-gray-500 text-xs truncate w-32">{companyName}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-screen overflow-hidden relative w-full ${storageWarning ? 'pt-10' : ''}`}>
        {/* Mobile Top Header - Mobile Mode */}
        <header className="bg-white border-b border-gray-200 p-4 flex md:hidden items-center justify-between shadow-sm z-20 sticky top-0">
          <div className="flex items-center">
             <div className="mr-2 w-8 h-8 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
             </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">VISI-JN</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentTab(TabView.SETTINGS)} className="p-2 text-gray-600">
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-8 pb-32 md:pb-8">
            
            {/* Context Header (Desktop Only) */}
            <div className="hidden md:flex mb-8 justify-between items-end">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {[...navItems, ...bottomNavItems].find(i => i.id === currentTab)?.label}
                </h1>
                <p className="text-gray-500 mt-1 font-medium">Gestion HACCP • {companyName}</p>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>

            {/* View Switcher */}
            <div className="animate-in fade-in duration-300">
              {currentTab === TabView.DASHBOARD && (
                <Dashboard 
                  tempLogs={tempLogs} 
                  deliveryLogs={deliveryLogs} 
                  cleaningTasks={cleaningTasks} 
                  coolingLogs={coolingLogs}
                  labelHistory={labelHistory}
                />
              )}
              {currentTab === TabView.TEMPERATURES && (
                <TemperatureLog 
                  logs={tempLogs} 
                  equipmentList={equipmentList}
                  onAddLog={handleAddTempLog} 
                  onEditLog={handleEditTempLog}
                />
              )}
              {currentTab === TabView.COOLING && (
                <CoolingLogComponent 
                  logs={coolingLogs}
                  onAddLog={handleAddCoolingLog}
                  onEditLog={handleEditCoolingLog}
                />
              )}
              {currentTab === TabView.OILS && (
                <OilControl
                  logs={oilLogs}
                  onAddLog={handleAddOilLog}
                  onDeleteLog={handleDeleteOilLog}
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
                  onEditLog={handleEditDeliveryLog}
                />
              )}
              {currentTab === TabView.DOCS && (
                <DigitalSafe
                  documents={documents}
                  onAddDoc={handleAddDoc}
                  onDeleteDoc={handleDeleteDoc}
                />
              )}
              {currentTab === TabView.ASSISTANT && <AIAssistant apiKey={apiKey} />}
              {currentTab === TabView.GUIDE && <UserGuide />}
              {currentTab === TabView.SETTINGS && (
                <Settings 
                  data={{ tempLogs, deliveryLogs, cleaningTasks, coolingLogs, labelHistory, oilLogs, documents, equipmentList }}
                  apiKey={apiKey}
                  companyName={companyName}
                  managerName={managerName}
                  onRestore={handleRestoreData}
                  onReset={handleResetData}
                  onSaveApiKey={handleSaveApiKey}
                  onSaveCompanyInfo={handleSaveCompanyInfo}
                  onUpdateConfig={handleUpdateConfig}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar - Scrollable */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center safe-bottom overflow-x-auto no-scrollbar">
          {[...navItems, {id: TabView.GUIDE, label: 'Guide', icon: BookOpen}].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex-1 min-w-[60px] flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                currentTab === item.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${currentTab === item.id ? 'fill-current opacity-20 stroke-2' : ''}`} />
              <span className="text-[9px] font-medium truncate w-full text-center leading-tight">
                {item.label
                  .replace('Tableau de bord', 'Accueil')
                  .replace('Relevés Temp.', 'Temp')
                  .replace('Assistant IA', 'IA')
                  .replace('Refroidissement', 'Froid')
                  .replace('Réception', 'Reçu')
                  .replace('Huiles de Friture', 'Huiles')
                  .replace('Classeur', 'Docs')
                }
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;