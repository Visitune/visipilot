import React, { useState } from 'react';
import { TempLog } from '../types';
import { Plus, Thermometer, AlertTriangle, CheckCircle } from './Icons';

interface TemperatureLogProps {
  logs: TempLog[];
  onAddLog: (log: TempLog) => void;
}

const TemperatureLog: React.FC<TemperatureLogProps> = ({ logs, onAddLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState('Chambre Froide 1');
  const [newTemp, setNewTemp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempVal = parseFloat(newTemp);
    
    // Simple logic for demo purposes
    let status: 'ok' | 'warning' | 'critical' = 'ok';
    if (tempVal > 4 && tempVal <= 8) status = 'warning';
    if (tempVal > 8) status = 'critical';

    const newLog: TempLog = {
      id: Math.random().toString(36).substr(2, 9),
      equipment: newEquipment,
      temperature: tempVal,
      timestamp: new Date(),
      status: status,
      user: 'Admin'
    };

    onAddLog(newLog);
    setNewTemp('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Relevés de Température</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Relevé
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Saisir une température</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Équipement</label>
              <select 
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option>Chambre Froide 1</option>
                <option>Chambre Froide 2</option>
                <option>Congélateur A</option>
                <option>Vitrine Réfrigérée</option>
                <option>Lave-Vaisselle (Rinçage)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Température (°C)</label>
              <input 
                type="number" 
                step="0.1"
                value={newTemp}
                onChange={(e) => setNewTemp(e.target.value)}
                required
                placeholder="Ex: 3.5"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Équipement</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Température</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.slice().reverse().map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.status === 'ok' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> OK</span>}
                    {log.status === 'warning' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1"/> Attention</span>}
                    {log.status === 'critical' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1"/> CRITIQUE</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {log.timestamp.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {log.equipment}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {log.temperature}°C
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {log.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              Aucun relevé disponible. Commencez par en ajouter un.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemperatureLog;