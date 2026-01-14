import React, { useState } from 'react';
import { CoolingLog } from '../types';
import { Snowflake, Plus, CheckCircle, AlertTriangle, Thermometer } from './Icons';

interface CoolingLogProps {
  logs: CoolingLog[];
  onAddLog: (log: CoolingLog) => void;
}

const CoolingLogComponent: React.FC<CoolingLogProps> = ({ logs, onAddLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState<Partial<CoolingLog>>({
    product: '',
    batchNumber: '',
    startTemp: 63,
    endTemp: 10,
    durationMinutes: 90
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLog.product && newLog.durationMinutes && newLog.startTemp && newLog.endTemp) {
      // Logic: Cooling from >63 to <10 in less than 120 mins
      const isCompliant = newLog.durationMinutes <= 120 && newLog.endTemp <= 10;
      
      const logToAdd: CoolingLog = {
        id: Date.now().toString(),
        product: newLog.product!,
        batchNumber: newLog.batchNumber || 'N/A',
        startTime: new Date(Date.now() - (newLog.durationMinutes * 60000)),
        startTemp: Number(newLog.startTemp),
        endTime: new Date(),
        endTemp: Number(newLog.endTemp),
        durationMinutes: Number(newLog.durationMinutes),
        status: isCompliant ? 'ok' : 'critical',
        user: 'Chef Michel'
      };
      
      onAddLog(logToAdd);
      setShowForm(false);
      setNewLog({ product: '', batchNumber: '', startTemp: 63, endTemp: 10, durationMinutes: 90 });
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Snowflake className="w-8 h-8 mr-3 text-cyan-600" />
          Refroidissement Rapide
        </h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-xl flex items-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Cycle
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 flex items-start">
         <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
         <p>Règle HACCP : Le refroidissement de <strong>+63°C à +10°C</strong> doit s'effectuer en moins de <strong>2 heures</strong>.</p>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-xl border border-cyan-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Enregistrement Cellule de Refroidissement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit / Préparation</label>
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={newLog.product}
                  onChange={e => setNewLog({...newLog, product: e.target.value})}
                  required
                  placeholder="Ex: Blanquette de Veau"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Lot</label>
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-mono"
                  value={newLog.batchNumber}
                  onChange={e => setNewLog({...newLog, batchNumber: e.target.value})}
                  placeholder="Facultatif"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
                <input 
                  type="number"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-bold"
                  value={newLog.durationMinutes}
                  onChange={e => setNewLog({...newLog, durationMinutes: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Température DÉBUT (°C)</label>
                <input 
                  type="number"
                  step="0.1"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={newLog.startTemp}
                  onChange={e => setNewLog({...newLog, startTemp: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Température FIN (°C)</label>
                <input 
                  type="number"
                  step="0.1"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={newLog.endTemp}
                  onChange={e => setNewLog({...newLog, endTemp: Number(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-bold shadow-md"
              >
                Valider le Cycle
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-lg">{log.product}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                   <span className="bg-gray-100 px-2 rounded font-mono text-xs">Lot: {log.batchNumber}</span>
                   <span>•</span>
                   <span>{log.startTime.toLocaleTimeString()} → {log.endTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <div className="flex items-center space-x-2 mb-1">
                 <span className="text-gray-500 font-medium text-sm">{log.startTemp}°C</span>
                 <span className="text-gray-400">→</span>
                 <span className={`text-xl font-bold ${log.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                   {log.endTemp}°C
                 </span>
               </div>
               
               {log.status === 'ok' ? (
                 <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                   <CheckCircle className="w-3 h-3 mr-1" /> {log.durationMinutes} min
                 </span>
               ) : (
                 <span className="flex items-center text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                   <AlertTriangle className="w-3 h-3 mr-1" /> ECHEC ({log.durationMinutes} min)
                 </span>
               )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center p-8 text-gray-400 italic">Aucun cycle de refroidissement enregistré.</div>
        )}
      </div>
    </div>
  );
};

export default CoolingLogComponent;