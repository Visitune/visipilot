import React, { useState, useRef } from 'react';
import { DocItem } from '../types';
import { Folder, Upload, FileText, Trash, Plus, Search } from './Icons';
import { fileToBase64 } from '../utils/helpers';

interface DigitalSafeProps {
  documents: DocItem[];
  onAddDoc: (doc: DocItem) => void;
  onDeleteDoc: (id: string) => void;
}

const DigitalSafe: React.FC<DigitalSafeProps> = ({ documents, onAddDoc, onDeleteDoc }) => {
  const [filter, setFilter] = useState('Tous');
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [docCategory, setDocCategory] = useState<'Formation' | 'Analyses' | 'Nuisibles' | 'Autre'>('Analyses');
  const [docTitle, setDocTitle] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && docTitle) {
      try {
        const base64 = await fileToBase64(file);
        const newDoc: DocItem = {
          id: Date.now().toString(),
          category: docCategory,
          title: docTitle,
          uploadDate: new Date(),
          fileData: base64
        };
        onAddDoc(newDoc);
        
        // Reset
        setDocTitle('');
        setShowUpload(false);
      } catch (err) {
        alert("Erreur lors de l'upload");
      }
    } else if (!docTitle) {
      alert("Veuillez donner un nom au document avant de sélectionner le fichier.");
    }
  };

  const categories = ['Tous', 'Formation', 'Analyses', 'Nuisibles', 'Autre'];
  const filteredDocs = filter === 'Tous' ? documents : documents.filter(d => d.category === filter);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Folder className="w-8 h-8 mr-3 text-indigo-600" />
          Classeur Numérique
        </h2>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center shadow-md font-bold transition-transform active:scale-95"
        >
          <Upload className="w-5 h-5 mr-2" />
          Ajouter un Document
        </button>
      </div>

      {showUpload && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-500 animate-in fade-in slide-in-from-top-4">
           <h3 className="text-lg font-bold mb-4 text-gray-900">Nouveau Document</h3>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
               <select 
                 value={docCategory}
                 onChange={(e) => setDocCategory(e.target.value as any)}
                 style={{ colorScheme: 'light' }}
                 className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium outline-none focus:ring-2 focus:ring-indigo-500"
               >
                 <option value="Analyses">Rapports d'Analyses Labo</option>
                 <option value="Formation">Attestations Formation</option>
                 <option value="Nuisibles">Rapports Dératisation</option>
                 <option value="Autre">Autre Document</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Nom du document</label>
               <input 
                 value={docTitle}
                 onChange={(e) => setDocTitle(e.target.value)}
                 placeholder="Ex: Analyse Eau Octobre 2023"
                 style={{ colorScheme: 'light' }}
                 className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
               />
             </div>
             
             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => docTitle ? fileInputRef.current?.click() : alert("Nom requis")}>
               <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
               <p className="text-sm text-gray-500 font-medium">Cliquez pour sélectionner un fichier (PDF, Image)</p>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileSelect} />
             </div>
             <button onClick={() => setShowUpload(false)} className="text-gray-500 text-sm hover:underline w-full text-center">Annuler</button>
           </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              filter === cat 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
            <div className="p-3 bg-gray-100 rounded-lg">
               <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
               <h4 className="font-bold text-gray-900 truncate">{doc.title}</h4>
               <p className="text-xs text-gray-500 mb-2">{doc.uploadDate.toLocaleDateString()}</p>
               <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100">
                 {doc.category}
               </span>
               <div className="flex mt-3 space-x-3">
                 <button 
                    onClick={() => {
                        const w = window.open("");
                        if(doc.fileData?.startsWith('data:image')) {
                             w?.document.write(`<img src="${doc.fileData}" style="max-width:100%"/>`);
                        } else {
                             w?.document.write(`<iframe src="${doc.fileData}" style="width:100%;height:100%;border:none;"></iframe>`);
                        }
                    }}
                    className="text-indigo-600 text-sm font-medium hover:underline"
                 >
                   Voir
                 </button>
                 <button onClick={() => onDeleteDoc(doc.id)} className="text-red-400 text-sm font-medium hover:text-red-600">
                   Supprimer
                 </button>
               </div>
            </div>
          </div>
        ))}
        {filteredDocs.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Aucun document dans ce dossier.
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalSafe;
