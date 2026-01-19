import React, { useState } from 'react';
import { OilLog } from '../types';
import { Droplet, Plus, AlertTriangle, CheckCircle, Trash } from './Icons';

interface OilControlProps {
  logs: OilLog[];
  onAddLog: (log: OilLog) => void;
  onDeleteLog?: (id: string) => void;
  staffList?: string[]; // Liste simple pour démo
}

const OilControl: React.FC<OilControlProps> = ({ logs, onAddLog, onDeleteLog, staffList = ['Chef Michel', 'Thomas', 'Sophie'] }) => {
  const [showForm, setShowForm] = useState(false);
  const [fryerName, setFryerName] = useState('Friteuse 1');
  const [tpmValue, setTpmValue] = useState(15);
  const [oilChanged, setOilChanged] = useState(false);
  const [user, setUser] = useState(staffList[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Détermination statut
    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (tpmValue >= 20 && tpmValue < 24) status = 'warning';
    if (tpmValue >= 24) status = 'critical';
    if (oilChanged) status = 'ok'; // Reset si huile changée

    const newLog: OilLog = {
      id: Date.now().toString(),
      fryerName,
      tpmValue: oilChanged ? 0 : tpmValue,
      oilChanged,
      signature: user,
      date: new Date(),
      status
    };

    onAddLog(newLog);
    
    // Reset form
    setTpmValue(15);
    setOilChanged(false);
    setShowForm(false);
  };

  const getTpmColor = (val: number) => {
    if (val < 20) return 'text-green-600';
    if (val < 24) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Droplet className="w-8 h-8 mr-3 text-yellow-600" />
          Huiles de Friture
        </h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl flex items-center shadow-lg active:scale-95 transition-transform font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Contrôle
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-yellow-500 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Contrôle Qualité Huile (Testeur TPM)</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Équipement</label>
              <select 
                value={fryerName}
                onChange={e => setFryerName(e.target.value)}
                style={{ colorScheme: 'light' }}
                className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-gray-900 shadow-sm"
              >
                <option value="Friteuse 1 (Gauche)">Friteuse 1 (Gauche)</option>
                <option value="Friteuse 2 (Droite)">Friteuse 2 (Droite)</option>
                <option value="Friteuse Poissons">Friteuse Poissons</option>
              </select>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
               <div className="flex items-center justify-between mb-4">
                 <label className="block text-sm font-bold text-gray-700">Taux Composés Polaires (TPM %)</label>
                 <div className="flex items-center space-x-2">
                   <span className={`text-3xl font-black ${oilChanged ? 'text-green-600' : getTpmColor(tpmValue)}`}>
                     {oilChanged ? 'NEW' : `${tpmValue}%`}
                   </span>
                 </div>
               </div>
               
               {!oilChanged && (
                 <>
                   <input 
                      type="range"
                      min="5"
                      max="35"
                      step="0.5"
                      value={tpmValue}
                      onChange={(e) => setTpmValue(parseFloat(e.target.value))}
                      className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono font-bold">
                      <span className="text-green-600">5% (Neuve)</span>
                      <span className="text-orange-500">20% (A surveiller)</span>
                      <span className="text-red-600">24% (CHANGER)</span>
                  </div>
                 </>
               )}

               <div className="mt-6 flex items-center">
                 <input 
                    type="checkbox" 
                    id="oilChange"
                    checked={oilChanged}
                    onChange={e => setOilChanged(e.target.checked)}
                    className="w-6 h-6 text-yellow-600 rounded focus:ring-yellow-500 border-gray-300"
                 />
                 <label htmlFor="oilChange" className="ml-3 font-bold text-gray-800">
                   J'ai changé l'huile complètement aujourd'hui
                 </label>
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Opérateur</label>
              <select 
                value={user}
                onChange={e => setUser(e.target.value)}
                style={{ colorScheme: 'light' }}
                className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-gray-900 shadow-sm"
              >
                {staffList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="flex-1 py-4 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="flex-1 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 font-bold shadow-lg text-lg"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {logs.slice().reverse().map(log => (
          <div key={log.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${log.oilChanged ? 'bg-green-500' : (log.status === 'ok' ? 'bg-yellow-500' : 'bg-red-500')}`}>
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-lg">{log.fryerName}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{log.signature}</span>
                  <span className="mx-2">•</span>
                  <span>{log.date.toLocaleDateString()} à {log.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               {log.oilChanged ? (
                 <span className="flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" /> HUILE NEUVE
                 </span>
               ) : (
                 <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-500">TPM</span>
                    <span className={`text-2xl font-black ${getTpmColor(log.tpmValue)}`}>{log.tpmValue}%</span>
                 </div>
               )}
               {log.status === 'warning' && !log.oilChanged && (
                   <span className="text-xs text-orange-600 font-bold mt-1">Prévoir changement</span>
               )}
               {log.status === 'critical' && !log.oilChanged && (
                   <span className="text-xs text-red-600 font-black mt-1 animate-pulse">CHANGEMENT OBLIGATOIRE</span>
               )}
               
               {onDeleteLog && (
                   <button onClick={() => onDeleteLog(log.id)} className="mt-2 text-gray-300 hover:text-red-500">
                       <Trash className="w-4 h-4" />
                   </button>
               )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center p-8 text-gray-500 italic">Aucun relevé d'huile.</div>
        )}
      </div>
    </div>
  );
};

export default OilControl;
