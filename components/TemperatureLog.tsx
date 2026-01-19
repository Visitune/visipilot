import React, { useState, useEffect } from 'react';
import { TempLog } from '../types';
import { Plus, Thermometer, AlertTriangle, CheckCircle, Edit } from './Icons';

interface TemperatureLogProps {
  logs: TempLog[];
  equipmentList?: string[]; // New prop
  onAddLog: (log: TempLog) => void;
  onEditLog: (log: TempLog) => void;
}

const TemperatureLog: React.FC<TemperatureLogProps> = ({ logs, equipmentList = [], onAddLog, onEditLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEquipment, setNewEquipment] = useState('');
  
  // Initialize newEquipment when list changes
  useEffect(() => {
      if (equipmentList.length > 0 && !newEquipment) {
          setNewEquipment(equipmentList[0]);
      }
  }, [equipmentList]);

  // Slider values
  const [sliderValue, setSliderValue] = useState(3.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempVal = Number(sliderValue);
    
    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (tempVal > 4 && tempVal <= 8) status = 'warning';
    if (tempVal > 8) status = 'critical';

    // Fallback if list is empty
    const eqName = newEquipment || "Équipement Inconnu";

    if (editingId) {
        const originalLog = logs.find(l => l.id === editingId);
        if (originalLog) {
            const updatedLog: TempLog = {
                ...originalLog,
                equipment: eqName,
                temperature: tempVal,
                status: status,
            };
            onEditLog(updatedLog);
        }
    } else {
        const newLog: TempLog = {
            id: Math.random().toString(36).substr(2, 9),
            equipment: eqName,
            temperature: tempVal,
            timestamp: new Date(),
            status: status,
            user: 'Utilisateur'
        };
        onAddLog(newLog);
    }

    resetForm();
  };

  const handleEditClick = (log: TempLog) => {
      setEditingId(log.id);
      setNewEquipment(log.equipment);
      setSliderValue(log.temperature);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setSliderValue(3.0);
      setEditingId(null);
      setShowForm(false);
      if(equipmentList.length > 0) setNewEquipment(equipmentList[0]);
  };

  const isEditable = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  };

  const getTempColor = (t: number) => {
      if(t <= 4) return 'text-green-600';
      if(t <= 8) return 'text-orange-600';
      return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Relevés de Température</h2>
        {!showForm && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Relevé
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-500 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Modifier le relevé' : 'Nouveau Relevé de Température'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Équipement</label>
              {equipmentList.length > 0 ? (
                  <select 
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    style={{ colorScheme: 'light' }}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 shadow-sm"
                  >
                    {equipmentList.map((eq, idx) => (
                        <option key={idx} value={eq}>{eq}</option>
                    ))}
                  </select>
              ) : (
                  <input 
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Nom de l'équipement"
                    style={{ colorScheme: 'light' }}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 shadow-sm placeholder-gray-400"
                  />
              )}
            </div>
            
            {/* Slider Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-4 flex justify-between">
                    <span>Température Relevée</span>
                    <span className={`text-2xl font-black ${getTempColor(sliderValue)}`}>{sliderValue}°C</span>
                </label>
                
                <div className="relative h-12 flex items-center">
                   <input 
                      type="range"
                      min="-18"
                      max="10"
                      step="0.5"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                      className="w-full h-4 rounded-lg appearance-none cursor-pointer z-10 relative"
                      style={{
                        background: `linear-gradient(to right, 
                          #bfdbfe 0%, 
                          #bfdbfe 64.2%, 
                          #86efac 64.2%, 
                          #86efac 78.5%, 
                          #fca5a5 78.5%, 
                          #fca5a5 100%)`
                      }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-0 font-mono font-bold">
                    <span className="text-blue-400">-18°C</span>
                    <div className="flex space-x-12 md:space-x-24">
                       <span className="text-green-600 relative right-2">0°C</span>
                       <span className="text-green-600 relative left-2">+4°C</span>
                    </div>
                    <span className="text-red-400">+10°C</span>
                </div>
                <div className="text-center mt-2">
                   <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold border border-green-200">
                     Zone Sécurité (0°C - 4°C)
                   </span>
                </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button 
                type="button" 
                onClick={resetForm}
                className="flex-1 py-4 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg font-bold text-lg"
              >
                {editingId ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Heure</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Équipement</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">T°C</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.slice().reverse().map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.status === 'ok' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-sm">
                            <CheckCircle className="w-3 h-3 mr-1"/> OK
                        </span>
                    )}
                    {log.status === 'warning' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm">
                            <AlertTriangle className="w-3 h-3 mr-1"/> ATT
                        </span>
                    )}
                    {log.status === 'critical' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1"/> ALERTE
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap font-medium">
                    {log.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {log.equipment}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900 whitespace-nowrap">
                    {log.temperature}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      {isEditable(log.timestamp) ? (
                          <button 
                            onClick={() => handleEditClick(log)}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-lg transition-colors"
                            title="Modifier"
                          >
                              <Edit className="w-5 h-5" />
                          </button>
                      ) : (
                          <span className="text-gray-300 cursor-not-allowed">
                              <Edit className="w-5 h-5 opacity-30" />
                          </span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-10 text-center text-gray-500 font-medium">
              Aucun relevé aujourd'hui.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemperatureLog;