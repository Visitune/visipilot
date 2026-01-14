import React, { useState, useRef } from 'react';
import { DeliveryLog } from '../types';
import { Truck, Plus, CheckCircle, AlertTriangle, Camera } from './Icons';

interface IncomingGoodsProps {
  logs: DeliveryLog[];
  onAddLog: (log: DeliveryLog) => void;
}

const IncomingGoods: React.FC<IncomingGoodsProps> = ({ logs, onAddLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [newLog, setNewLog] = useState<Partial<DeliveryLog>>({
    supplier: '',
    product: '',
    temperature: 0,
    batchNumber: '',
    photoUrl: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLog.supplier && newLog.product) {
      const logToAdd: DeliveryLog = {
        id: Date.now().toString(),
        supplier: newLog.supplier!,
        product: newLog.product!,
        temperature: Number(newLog.temperature),
        batchNumber: newLog.batchNumber || 'N/A',
        photoUrl: newLog.photoUrl,
        status: Number(newLog.temperature) > 4 ? 'refused' : 'ok',
        timestamp: new Date()
      };
      
      onAddLog(logToAdd);
      setShowForm(false);
      setNewLog({ supplier: '', product: '', temperature: 0, batchNumber: '', photoUrl: '' });
    }
  };

  const handleTakePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const photoUrl = URL.createObjectURL(file);
      setNewLog(prev => ({ ...prev, photoUrl }));
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Truck className="w-8 h-8 mr-3 text-blue-600" />
          Réception Marchandises
        </h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Livraison
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-xl border border-blue-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Contrôle à réception</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newLog.supplier}
                  onChange={e => setNewLog({...newLog, supplier: e.target.value})}
                  required
                  placeholder="Ex: Pomona"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newLog.product}
                  onChange={e => setNewLog({...newLog, product: e.target.value})}
                  required
                  placeholder="Ex: Bœuf haché"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Température à cœur (°C)</label>
                <input 
                  type="number"
                  step="0.1"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg"
                  value={newLog.temperature}
                  onChange={e => setNewLog({...newLog, temperature: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Lot</label>
                <input 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newLog.batchNumber}
                  onChange={e => setNewLog({...newLog, batchNumber: e.target.value})}
                  placeholder="Requis"
                  required
                />
              </div>
            </div>

             {/* Photo Button */}
             <div className="flex items-center space-x-4 pt-2">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button 
                type="button"
                onClick={handleTakePhotoClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  newLog.photoUrl 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">{newLog.photoUrl ? 'Photo BL/Camion Ajoutée' : 'Ajouter Photo BL/Camion'}</span>
                {newLog.photoUrl && <CheckCircle className="w-4 h-4 ml-2" />}
              </button>
              {newLog.photoUrl && (
                <img src={newLog.photoUrl} alt="Aperçu" className="w-16 h-16 rounded-lg object-cover" />
              )}
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
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-start space-x-4">
              {log.photoUrl && (
                <img src={log.photoUrl} alt="Preuve" className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-lg">{log.supplier}</span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-600 font-medium">{log.product}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Lot: <span className="font-mono bg-gray-100 px-1 rounded">{log.batchNumber}</span> • {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <div className={`text-2xl font-bold font-mono ${log.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                 {log.temperature}°C
               </div>
               {log.status === 'ok' ? (
                 <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full mt-1">
                   <CheckCircle className="w-3 h-3 mr-1" /> ACCEPTE
                 </span>
               ) : (
                 <span className="flex items-center text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full mt-1">
                   <AlertTriangle className="w-3 h-3 mr-1" /> REFUSE
                 </span>
               )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center p-8 text-gray-400 italic">Aucune réception enregistrée.</div>
        )}
      </div>
    </div>
  );
};

export default IncomingGoods;