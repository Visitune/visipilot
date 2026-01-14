import React, { useState, useEffect } from 'react';
import { Printer, Camera, CheckCircle } from './Icons';
import { LabelLog } from '../types';

interface LabelPrinterProps {
  onAddLabel?: (label: LabelLog) => void;
  history?: LabelLog[];
}

const LabelPrinter: React.FC<LabelPrinterProps> = ({ onAddLabel, history = [] }) => {
  const [productName, setProductName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [shelfLifeDays, setShelfLifeDays] = useState(3);
  const [prepDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    const exp = new Date(prepDate);
    exp.setDate(exp.getDate() + shelfLifeDays);
    setExpiryDate(exp);
  }, [shelfLifeDays, prepDate]);

  const handlePrint = () => {
    if (!batchNumber) {
      alert("Le numéro de lot est obligatoire pour la traçabilité !");
      return;
    }
    
    if (onAddLabel) {
      const newLabel: LabelLog = {
        id: Date.now().toString(),
        productName,
        batchNumber,
        prepDate: new Date(),
        expiryDate,
        user: 'Chef Michel'
      };
      onAddLabel(newLabel);
      
      // Reset form slightly but keep shelf life
      setProductName('');
      setBatchNumber('');
      setHasPhoto(false);
    }
  };

  const handleTakePhoto = () => {
    setHasPhoto(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-24 md:pb-0">
      {/* Input Form */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Création d'Étiquette</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          
          {/* Photo Capture Section */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-200 text-blue-700 rounded-lg">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-blue-900 text-sm">Traçabilité Origine</p>
                <p className="text-xs text-blue-600">Photo étiquette fournisseur</p>
              </div>
            </div>
            <button 
              onClick={handleTakePhoto}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                hasPhoto 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              {hasPhoto ? 'Photo OK' : 'Prendre Photo'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Produit <span className="text-red-500">*</span></label>
            <input 
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="ex: Sauce Tomate Maison"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Lot (Interne/Fournisseur) <span className="text-red-500">*</span></label>
            <input 
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="ex: LOT-2023-10-24"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée de vie (Jours)</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 5, 7].map(day => (
                <button
                  key={day}
                  onClick={() => setShelfLifeDays(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    shelfLifeDays === day 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  J+{day}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
             <button 
              onClick={handlePrint}
              disabled={!productName || !batchNumber}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-transform active:scale-95"
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimer & Enregistrer
            </button>
            {!batchNumber && <p className="text-xs text-red-500 text-center mt-2">Le numéro de lot est requis.</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Live Preview */}
        <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-xl border-2 border-dashed border-gray-300">
          <h3 className="text-gray-500 font-medium mb-6 uppercase tracking-wider text-sm">Aperçu Impression</h3>
          
          <div className="bg-white w-80 h-auto p-6 shadow-xl rounded-sm border border-gray-200 relative overflow-hidden">
            <div className="border-b-2 border-black pb-2 mb-2">
              <h1 className="text-2xl font-black text-gray-900 uppercase leading-tight break-words">
                {productName || "NOM DU PRODUIT"}
              </h1>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Préparé le</p>
                <p className="font-mono text-lg font-bold">
                  {prepDate.toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">{prepDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">DLC / EXP</p>
                <p className="font-mono text-lg font-bold text-red-600">
                  {expiryDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-300 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-400">Lot / Batch</p>
                <p className="font-bold text-sm font-mono">{batchNumber || '----'}</p>
              </div>
              <div className="text-right">
                 <div className="h-8 w-24 bg-gray-800 flex items-center justify-center text-white text-[10px] tracking-widest">
                   |||||||||||||
                 </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Format: 60x40mm Thermique</p>
        </div>

        {/* History List */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-3">Dernières étiquettes</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map(label => (
                <div key={label.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                  <div>
                    <span className="font-medium text-gray-900">{label.productName}</span>
                    <span className="text-gray-500 text-xs ml-2">Exp: {label.expiryDate.toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono text-xs text-gray-400">{label.batchNumber}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelPrinter;