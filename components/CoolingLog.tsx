import React, { useState } from 'react';
import { CoolingLog } from '../types';
import { Snowflake, Plus, CheckCircle, AlertTriangle, Thermometer, Edit } from './Icons';

interface CoolingLogProps {
  logs: CoolingLog[];
  onAddLog: (log: CoolingLog) => void;
  onEditLog: (log: CoolingLog) => void;
}

const CoolingLogComponent: React.FC<CoolingLogProps> = ({ logs, onAddLog, onEditLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [product, setProduct] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [startTemp, setStartTemp] = useState(63.0);
  const [endTemp, setEndTemp] = useState(10.0);
  const [duration, setDuration] = useState(90);

  const isEditable = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  };

  const resetForm = () => {
    setProduct('');
    setBatchNumber('');
    setStartTemp(63.0);
    setEndTemp(10.0);
    setDuration(90);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (log: CoolingLog) => {
      setEditingId(log.id);
      setProduct(log.product);
      setBatchNumber(log.batchNumber);
      setStartTemp(log.startTemp);
      setEndTemp(log.endTemp);
      setDuration(log.durationMinutes);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && duration) {
      // Logic: Cooling from >63 to <10 in less than 120 mins
      const isCompliant = duration <= 120 && endTemp <= 10;
      
      if (editingId) {
          const originalLog = logs.find(l => l.id === editingId);
          if (originalLog) {
              const updatedLog: CoolingLog = {
                  ...originalLog,
                  product,
                  batchNumber: batchNumber || 'N/A',
                  startTemp,
                  endTemp,
                  durationMinutes: duration,
                  status: isCompliant ? 'ok' : 'critical'
              };
              onEditLog(updatedLog);
          }
      } else {
        const logToAdd: CoolingLog = {
            id: Date.now().toString(),
            product,
            batchNumber: batchNumber || 'N/A',
            startTime: new Date(Date.now() - (duration * 60000)),
            startTemp,
            endTime: new Date(),
            endTemp,
            durationMinutes: duration,
            status: isCompliant ? 'ok' : 'critical',
            user: 'Utilisateur'
        };
        onAddLog(logToAdd);
      }
      resetForm();
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Snowflake className="w-8 h-8 mr-3 text-cyan-600" />
          Refroidissement Rapide
        </h2>
        {!showForm && (
            <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-xl flex items-center shadow-lg active:scale-95 transition-transform font-bold"
            >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Cycle
            </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-900 flex items-start">
         <AlertTriangle className="w-5 h-5 mr-2 shrink-0 text-blue-700" />
         <p>Règle HACCP : Le refroidissement de <strong>+63°C à +10°C</strong> doit s'effectuer en moins de <strong>2 heures</strong> (120 min).</p>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-cyan-500 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xl font-bold mb-6 text-gray-900">
              {editingId ? 'Modifier le cycle' : 'Enregistrement Cellule de Refroidissement'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Produit / Préparation</label>
                <input 
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-gray-900 shadow-sm placeholder-gray-400"
                  style={{ colorScheme: 'light' }}
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  required
                  placeholder="Ex: Blanquette de Veau"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Numéro de Lot</label>
                <input 
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-mono text-gray-900 shadow-sm placeholder-gray-400"
                  style={{ colorScheme: 'light' }}
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                  placeholder="Facultatif"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                    <span>Durée du cycle</span>
                    <span className="font-black text-xl text-cyan-700">{duration} min</span>
                </label>
                <input 
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                 <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
                    <span>0 min</span>
                    <span>60 min</span>
                    <span>120 min (Limite)</span>
                    <span>180 min</span>
                </div>
              </div>

              {/* Start Temp Slider */}
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <label className="block text-sm font-bold text-orange-900 mb-2 flex justify-between">
                    <span>T° Chaud (Début)</span>
                    <span className="text-xl font-black">{startTemp}°C</span>
                </label>
                <input 
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={startTemp}
                  onChange={e => setStartTemp(Number(e.target.value))}
                  className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="text-xs text-orange-800 mt-1 text-right">Doit être {'>'} 63°C</div>
              </div>

              {/* End Temp Slider */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-bold text-blue-900 mb-2 flex justify-between">
                    <span>T° Froid (Fin)</span>
                    <span className="text-xl font-black">{endTemp}°C</span>
                </label>
                 <input 
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={endTemp}
                  onChange={e => setEndTemp(Number(e.target.value))}
                  className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-xs text-blue-800 mt-1 text-right">Doit être {'<'} 10°C</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
              <button 
                type="button" 
                onClick={resetForm}
                className="flex-1 py-4 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="flex-1 py-4 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 font-bold shadow-lg text-lg"
              >
                {editingId ? 'Mettre à jour' : 'Valider le Cycle'}
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
                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                   <span className="bg-gray-100 px-2 rounded font-mono text-xs border border-gray-200 w-fit text-gray-700">Lot: {log.batchNumber}</span>
                   <span className="hidden md:inline">•</span>
                   <span>{log.startTime.toLocaleTimeString()} → {log.endTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <div className="flex items-center space-x-2 mb-1 bg-gray-100 px-2 py-1 rounded">
                 <span className="text-gray-600 font-bold text-sm">{log.startTemp}°C</span>
                 <span className="text-gray-400">→</span>
                 <span className={`text-xl font-black ${log.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                   {log.endTemp}°C
                 </span>
               </div>
               
               <div className="flex items-center gap-2 mt-1">
                   {log.status === 'ok' ? (
                     <span className="flex items-center text-xs font-bold text-white bg-green-600 px-3 py-1 rounded-full shadow-sm">
                       <CheckCircle className="w-3 h-3 mr-1" /> {log.durationMinutes} min
                     </span>
                   ) : (
                     <span className="flex items-center text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-full shadow-sm animate-pulse">
                       <AlertTriangle className="w-3 h-3 mr-1" /> ECHEC ({log.durationMinutes} min)
                     </span>
                   )}
                   
                   {isEditable(log.endTime) && (
                        <button 
                            onClick={() => handleEditClick(log)}
                            className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 p-2 rounded-lg transition-colors ml-1"
                            title="Modifier"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                   )}
               </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center p-8 text-gray-500 italic">Aucun cycle de refroidissement enregistré.</div>
        )}
      </div>
    </div>
  );
};

export default CoolingLogComponent;