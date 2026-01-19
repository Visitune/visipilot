import React, { useRef, useState, useEffect } from 'react';
import { AppData, CleaningTask } from '../types';
import { Download, Upload, Trash, CheckCircle, AlertTriangle, Settings as SettingsIcon, Bot, User, Plus, FileText } from './Icons';
import { dateReviver } from '../utils/helpers';

interface SettingsProps {
  data: AppData;
  apiKey: string;
  companyName: string;
  managerName: string;
  onRestore: (data: AppData) => void;
  onReset: () => void;
  onSaveApiKey: (key: string) => void;
  onSaveCompanyInfo: (name: string, manager: string) => void;
  onUpdateConfig: (equipment: string[], cleaningTasks: CleaningTask[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  data, 
  apiKey, 
  companyName, 
  managerName, 
  onRestore, 
  onReset, 
  onSaveApiKey, 
  onSaveCompanyInfo,
  onUpdateConfig
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvEquipInputRef = useRef<HTMLInputElement>(null);
  const csvCleanInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'package' | 'config' | 'company'>('package');

  // General Settings State
  const [localKey, setLocalKey] = useState(apiKey || '');
  const [localCompany, setLocalCompany] = useState(companyName || '');
  const [localManager, setLocalManager] = useState(managerName || '');
  const [saved, setSaved] = useState(false);

  // Config State
  const [equipments, setEquipments] = useState<string[]>(data.equipmentList || []);
  const [newEquip, setNewEquip] = useState('');

  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>(data.cleaningTasks || []);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskArea, setNewTaskArea] = useState('Cuisine');
  const [newTaskFreq, setNewTaskFreq] = useState<'Quotidien' | 'Hebdo'>('Quotidien');

  useEffect(() => {
    setLocalKey(apiKey);
    setLocalCompany(companyName);
    setLocalManager(managerName);
    if(data.equipmentList) setEquipments(data.equipmentList);
    if(data.cleaningTasks) setCleaningTasks(data.cleaningTasks);
  }, [apiKey, companyName, managerName, data.equipmentList, data.cleaningTasks]);

  // --- Handlers General ---
  const handleSaveAll = () => {
      onSaveApiKey(localKey);
      onSaveCompanyInfo(localCompany, localManager);
      onUpdateConfig(equipments, cleaningTasks);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
  };

  const handleDownloadPackage = () => {
    // "Package" logic: Bundle EVERYTHING
    const backupData = { 
        ...data, 
        apiKey: localKey,
        companyName: localCompany,
        managerName: localManager,
        equipmentList: equipments,
        cleaningTasks: cleaningTasks
    };
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PACKAGE_VISIJN_${localCompany.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadPackage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const parsedData = JSON.parse(json, dateReviver) as AppData;
        onRestore(parsedData);
      } catch (error) {
        alert("Erreur : Ce fichier n'est pas un package VISI-JN valide.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Handlers Equipment ---
  const addEquipment = () => {
      if (newEquip.trim()) {
          const updated = [...equipments, newEquip.trim()];
          setEquipments(updated);
          setNewEquip('');
      }
  };
  const removeEquipment = (index: number) => {
      const updated = equipments.filter((_, i) => i !== index);
      setEquipments(updated);
  };
  
  const handleCSVImportEquipment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        setEquipments(prev => [...prev, ...lines]);
        alert(`${lines.length} équipements ajoutés au package !`);
    };
    reader.readAsText(file);
    if (csvEquipInputRef.current) csvEquipInputRef.current.value = '';
  };

  // --- Handlers Cleaning ---
  const addCleaningTask = () => {
      if (newTaskName.trim()) {
          const task: CleaningTask = {
              id: Date.now().toString(),
              area: newTaskArea,
              taskName: newTaskName.trim(),
              frequency: newTaskFreq,
              isDone: false
          };
          setCleaningTasks([...cleaningTasks, task]);
          setNewTaskName('');
      }
  };
  const removeCleaningTask = (id: string) => {
      setCleaningTasks(cleaningTasks.filter(t => t.id !== id));
  };

  const handleCSVImportCleaning = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result as string;
          const lines = text.split(/\r?\n/);
          let addedCount = 0;
          const newTasks: CleaningTask[] = [];
          
          lines.forEach(line => {
             const parts = line.split(',');
             if (parts.length >= 2) {
                 const freqStr = parts[2]?.trim().toLowerCase();
                 // Map both English and French CSV terms
                 const frequency = (freqStr === 'weekly' || freqStr === 'hebdo') ? 'Hebdo' : 'Quotidien';
                 
                 newTasks.push({
                     id: Math.random().toString(36).substr(2, 9),
                     area: parts[0].trim(),
                     taskName: parts[1].trim(),
                     frequency: frequency,
                     isDone: false
                 });
                 addedCount++;
             }
          });
          setCleaningTasks(prev => [...prev, ...newTasks]);
          alert(`${addedCount} tâches ajoutées au package !`);
      };
      reader.readAsText(file);
      if (csvCleanInputRef.current) csvCleanInputRef.current.value = '';
  };

  const dataSize = JSON.stringify(data).length;
  const sizeInMB = (dataSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center space-x-3 mb-2">
        <SettingsIcon className="w-8 h-8 text-gray-800" />
        <h2 className="text-2xl font-bold text-gray-900">Paramétrage Global</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 space-x-1 bg-gray-200 rounded-xl">
          <button 
            onClick={() => setActiveTab('package')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'package' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            Package & Données
          </button>
          <button 
            onClick={() => setActiveTab('company')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'company' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            Entreprise & IA
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'config' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            Listes (Équip/Nettoyage)
          </button>
      </div>

      {/* --- TAB: PACKAGE --- */}
      {activeTab === 'package' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
              {/* Export */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Download className="w-6 h-6 mr-2 text-blue-600" /> 
                    Exporter le Package
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Générez un fichier complet contenant :
                    <br/>• Vos listes (équipements, tâches)
                    <br/>• Votre historique (relevés, photos)
                    <br/>• Vos paramètres (clé API, nom)
                </p>
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900 font-medium mb-4">
                    Poids du package : {sizeInMB} MB
                </div>
                <button 
                    onClick={handleDownloadPackage} 
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform active:scale-95 flex justify-center items-center"
                >
                    <FileText className="w-5 h-5 mr-2" /> TÉLÉCHARGER LE PACKAGE
                </button>
              </div>

              {/* Import */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Upload className="w-6 h-6 mr-2 text-green-600" /> 
                    Charger un Package
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Restaurez une sauvegarde complète provenant d'un autre appareil ou d'une session précédente.
                    <br/><span className="text-red-600 font-bold">Attention : Remplace les données actuelles.</span>
                </p>
                <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleUploadPackage} />
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg transition-transform active:scale-95 flex justify-center items-center"
                >
                    <Upload className="w-5 h-5 mr-2" /> IMPORTER UN PACKAGE
                </button>
              </div>

              {/* Danger Zone */}
              <div className="md:col-span-2 bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col items-center">
                <h3 className="text-red-800 font-bold flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 mr-2" /> Zone de Danger
                </h3>
                <button 
                    onClick={() => { if(window.confirm('Voulez-vous vraiment effacer TOUTES les données et repartir à zéro ?')) onReset(); }} 
                    className="px-6 py-2 bg-white border border-red-300 text-red-600 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-colors"
                >
                    Réinitialiser l'Application (Zéro Donnée)
                </button>
              </div>
          </div>
      )}

      {/* --- TAB: COMPANY & IA --- */}
      {activeTab === 'company' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in space-y-6">
               <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-600" /> Identité Établissement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Nom Entreprise</label>
                          <input 
                            type="text" 
                            value={localCompany} 
                            onChange={(e) => setLocalCompany(e.target.value)} 
                            style={{ colorScheme: 'light' }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-400" 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Responsable HACCP</label>
                          <input 
                            type="text" 
                            value={localManager} 
                            onChange={(e) => setLocalManager(e.target.value)} 
                            style={{ colorScheme: 'light' }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-400" 
                          />
                      </div>
                  </div>
               </div>
               
               <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-indigo-600" /> Intelligence Artificielle (Gemini)
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">Clé API Google Gemini (requise pour l'assistant)</p>
                  <input 
                    type="password" 
                    value={localKey} 
                    onChange={(e) => setLocalKey(e.target.value)} 
                    style={{ colorScheme: 'light' }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white font-mono placeholder-gray-400" 
                    placeholder="AIzaSy..." 
                  />
               </div>

               <button 
                onClick={handleSaveAll} 
                className={`w-full py-4 rounded-xl font-bold text-white shadow-md text-lg transition-colors ${saved ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
               >
                  {saved ? <><CheckCircle className="w-6 h-6 inline mr-2" /> Paramètres Enregistrés !</> : 'Enregistrer les Modifications'}
               </button>
          </div>
      )}

      {/* --- TAB: CONFIG LISTS --- */}
      {activeTab === 'config' && (
          <div className="space-y-8 animate-in fade-in">
              
              {/* Equipment Config */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                          <h3 className="text-lg font-bold text-gray-900">Liste des Équipements</h3>
                          <p className="text-sm text-gray-500">Définissez vos frigos, congélateurs...</p>
                      </div>
                      <div className="flex space-x-2">
                           <input type="file" accept=".csv,.txt" ref={csvEquipInputRef} className="hidden" onChange={handleCSVImportEquipment} />
                           <button onClick={() => csvEquipInputRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-bold hover:bg-gray-200 border border-gray-300">
                               Importer Excel/CSV
                           </button>
                           <button onClick={handleSaveAll} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                               Sauvegarder
                           </button>
                      </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                      <input 
                        value={newEquip} 
                        onChange={e => setNewEquip(e.target.value)}
                        placeholder="Ajouter équipement (ex: Vitrine Desserts)"
                        style={{ colorScheme: 'light' }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                        onKeyDown={e => e.key === 'Enter' && addEquipment()}
                      />
                      <button onClick={addEquipment} className="px-5 bg-green-600 text-white rounded-lg hover:bg-green-700"><Plus className="w-6 h-6"/></button>
                  </div>

                  <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200">
                      {equipments.map((item, idx) => (
                          <li key={idx} className="py-3 px-4 flex justify-between items-center group hover:bg-gray-100">
                              <span className="font-semibold text-gray-700">{item}</span>
                              <button onClick={() => removeEquipment(idx)} className="text-gray-400 hover:text-red-600 p-1"><Trash className="w-5 h-5"/></button>
                          </li>
                      ))}
                      {equipments.length === 0 && <li className="py-4 text-center text-gray-500 italic">Liste vide.</li>}
                  </ul>
              </div>

              {/* Cleaning Config */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                          <h3 className="text-lg font-bold text-gray-900">Plan de Nettoyage</h3>
                          <p className="text-sm text-gray-500">Définissez les tâches récurrentes.</p>
                      </div>
                      <div className="flex space-x-2">
                           <input type="file" accept=".csv,.txt" ref={csvCleanInputRef} className="hidden" onChange={handleCSVImportCleaning} />
                           <button onClick={() => csvCleanInputRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-bold hover:bg-gray-200 border border-gray-300">
                               Importer Excel/CSV
                           </button>
                           <button onClick={handleSaveAll} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                               Sauvegarder
                           </button>
                      </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2 mb-4">
                      <select 
                        value={newTaskArea}
                        onChange={e => setNewTaskArea(e.target.value)}
                        style={{ colorScheme: 'light' }}
                        className="p-3 border border-gray-300 rounded-lg outline-none bg-white text-gray-900 font-medium"
                      >
                          <option>Cuisine</option>
                          <option>Plonge</option>
                          <option>Stockage</option>
                          <option>Salle</option>
                          <option>Toilettes</option>
                      </select>
                      
                      <input 
                        value={newTaskName} 
                        onChange={e => setNewTaskName(e.target.value)}
                        placeholder="Nouvelle tâche (ex: Laver le sol)"
                        style={{ colorScheme: 'light' }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                      />

                       <select 
                        value={newTaskFreq}
                        onChange={e => setNewTaskFreq(e.target.value as 'Quotidien' | 'Hebdo')}
                        style={{ colorScheme: 'light' }}
                        className="p-3 border border-gray-300 rounded-lg outline-none bg-white text-gray-900 font-medium"
                      >
                          <option value="Quotidien">Quotidien</option>
                          <option value="Hebdo">Hebdo</option>
                      </select>

                      <button onClick={addCleaningTask} className="px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold">Ajouter</button>
                  </div>

                  <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200">
                      {cleaningTasks.map((task) => (
                          <li key={task.id} className="py-3 px-4 flex justify-between items-center group hover:bg-gray-100">
                              <div>
                                  <span className="font-bold text-gray-800 block">{task.taskName}</span>
                                  <div className="flex space-x-2 mt-1">
                                    <span className="text-xs text-gray-600 uppercase font-bold bg-white border border-gray-200 px-2 py-0.5 rounded">{task.area}</span>
                                    <span className="text-xs text-blue-600 uppercase font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">{task.frequency}</span>
                                  </div>
                              </div>
                              <button onClick={() => removeCleaningTask(task.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash className="w-5 h-5"/></button>
                          </li>
                      ))}
                      {cleaningTasks.length === 0 && <li className="py-4 text-center text-gray-500 italic">Aucune tâche définie.</li>}
                  </ul>
                  
                  <div className="mt-4 bg-yellow-50 text-yellow-800 p-3 rounded-lg text-xs border border-yellow-100">
                      <strong>Format CSV pour Import :</strong> Zone, Tâche, Fréquence (Quotidien/Hebdo)
                      <br/>Exemple : <code>Cuisine, Nettoyer la hotte, Hebdo</code>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Settings;