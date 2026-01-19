import React, { useState, useRef } from 'react';
import { DeliveryLog } from '../types';
import { Truck, Plus, CheckCircle, AlertTriangle, Camera, Edit } from './Icons';
import { fileToBase64 } from '../utils/helpers';

interface IncomingGoodsProps {
  logs: DeliveryLog[];
  onAddLog: (log: DeliveryLog) => void;
  onEditLog: (log: DeliveryLog) => void;
}

const IncomingGoods: React.FC<IncomingGoodsProps> = ({ logs, onAddLog, onEditLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [supplier, setSupplier] = useState('');
  const [product, setProduct] = useState('');
  const [temp, setTemp] = useState(2.0); // Slider value
  const [batchNumber, setBatchNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditable = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  };

  const resetForm = () => {
    setSupplier('');
    setProduct('');
    setTemp(2.0);
    setBatchNumber('');
    setPhotoUrl('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (log: DeliveryLog) => {
      setEditingId(log.id);
      setSupplier(log.supplier);
      setProduct(log.product);
      setTemp(log.temperature);
      setBatchNumber(log.batchNumber);
      setPhotoUrl(log.photoUrl || '');
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supplier && product) {
      
      const status = temp > 4 ? 'refused' : 'ok';
      
      if (editingId) {
          const originalLog = logs.find(l => l.id === editingId);
          if (originalLog) {
              const updatedLog: DeliveryLog = {
                  ...originalLog,
                  supplier,
                  product,
                  temperature: temp,
                  batchNumber: batchNumber || 'N/A',
                  photoUrl,
                  status
              };
              onEditLog(updatedLog);
          }
      } else {
        const logToAdd: DeliveryLog = {
            id: Date.now().toString(),
            supplier,
            product,
            temperature: temp,
            batchNumber: batchNumber || 'N/A',
            photoUrl,
            status,
            timestamp: new Date()
        };
        onAddLog(logToAdd);
      }
      resetForm();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPhotoUrl(base64);
      } catch (err) {
        console.error("Error converting file", err);
        alert("Impossible de traiter l'image");
      }
    }
  };

  const getTempColor = (t: number) => {
      if(t <= 4) return 'text-green-600';
      return 'text-red-600';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Truck className="w-8 h-8 mr-3 text-blue-600" />
          Réception Marchandises
        </h2>
        {!showForm && (
            <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center shadow-lg active:scale-95 transition-transform font-bold"
            >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Livraison
            </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-blue-500 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xl font-bold mb-6 text-gray-900">
              {editingId ? 'Modifier la réception' : 'Contrôle à réception'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fournisseur</label>
                <input 
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 shadow-sm placeholder-gray-400"
                  style={{ colorScheme: 'light' }}
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                  required
                  placeholder="Ex: Pomona"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Produit</label>
                <input 
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 shadow-sm placeholder-gray-400"
                  style={{ colorScheme: 'light' }}
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  required
                  placeholder="Ex: Bœuf haché"
                />
              </div>

               {/* Temp Slider */}
              <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-4 flex justify-between">
                    <span>Température à cœur</span>
                    <span className={`text-2xl font-black ${getTempColor(temp)}`}>{temp}°C</span>
                </label>
                <input 
                    type="range"
                    min="-18"
                    max="15"
                    step="0.5"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                    className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                    <span>-18°C (Surgelé)</span>
                    <span>0°C</span>
                    <span>+4°C (Limite)</span>
                    <span>+15°C</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Numéro de Lot</label>
                <input 
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-gray-900 shadow-sm placeholder-gray-400"
                  style={{ colorScheme: 'light' }}
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                  placeholder="Numéro sur l'étiquette..."
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
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 transition-colors font-bold ${
                  photoUrl 
                    ? 'bg-green-100 border-green-500 text-green-800' 
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Camera className="w-6 h-6" />
                <span>{photoUrl ? 'Photo BL/Camion OK' : 'Prendre Photo BL/Camion'}</span>
                {photoUrl && <CheckCircle className="w-5 h-5 ml-2" />}
              </button>
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
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg text-lg"
              >
                {editingId ? 'Mettre à jour' : 'Valider'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-start space-x-4">
              {log.photoUrl ? (
                <div 
                  className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0 cursor-pointer"
                  onClick={() => {
                    const w = window.open("");
                    w?.document.write(`<img src="${log.photoUrl}" style="max-width:100%"/>`);
                  }}
                >
                  <img src={log.photoUrl} alt="Preuve" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 border border-gray-200 shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
              )}
              
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-lg">{log.supplier}</span>
                  <span className="hidden md:inline text-gray-400 text-sm">•</span>
                  <span className="text-gray-700 font-medium">{log.product}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-mono bg-gray-100 px-1 rounded border border-gray-200 text-xs text-gray-600">Lot: {log.batchNumber}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <div className={`text-2xl font-black font-mono ${log.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                 {log.temperature}°C
               </div>
               {log.status === 'ok' ? (
                 <span className="flex items-center text-xs font-bold text-white bg-green-600 px-3 py-1 rounded-full mt-1 shadow-sm">
                   <CheckCircle className="w-3 h-3 mr-1" /> ACCEPTE
                 </span>
               ) : (
                 <span className="flex items-center text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-full mt-1 shadow-sm">
                   <AlertTriangle className="w-3 h-3 mr-1" /> REFUSE
                 </span>
               )}
               <div className="mt-2">
                 {isEditable(log.timestamp) && (
                    <button 
                        onClick={() => handleEditClick(log)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-lg transition-colors"
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
          <div className="text-center p-8 text-gray-500 italic">Aucune réception enregistrée.</div>
        )}
      </div>
    </div>
  );
};

export default IncomingGoods;