import React, { useRef } from 'react';
import { CleaningTask } from '../types';
import { CheckCircle, ClipboardCheck, Camera } from './Icons';

interface CleaningPlanProps {
  tasks: CleaningTask[];
  onUpdateTask: (id: string, isDone: boolean, photoUrl?: string) => void;
}

const CleaningPlan: React.FC<CleaningPlanProps> = ({ tasks, onUpdateTask }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentlySelectedTaskId = useRef<string | null>(null);

  const progress = Math.round((tasks.filter(t => t.isDone).length / tasks.length) * 100);

  const handleTakePhotoClick = (taskId: string) => {
    currentlySelectedTaskId.current = taskId;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentlySelectedTaskId.current) {
      const file = e.target.files[0];
      const photoUrl = URL.createObjectURL(file);
      onUpdateTask(currentlySelectedTaskId.current, true, photoUrl);
      currentlySelectedTaskId.current = null;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ClipboardCheck className="w-8 h-8 mr-3 text-blue-600" />
          Plan de Nettoyage
        </h2>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Progression Journée</div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
              task.isDone 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-gray-100 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => !task.isDone && onUpdateTask(task.id, true)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                task.isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white hover:border-blue-400'
              }`}>
                {task.isDone && <CheckCircle className="w-5 h-5" />}
              </div>
              <div>
                <h4 className={`font-semibold text-lg ${task.isDone ? 'text-blue-900 line-through opacity-70' : 'text-gray-800'}`}>
                  {task.taskName}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide font-bold">{task.area}</span>
                  <span>•</span>
                  <span>{task.frequency === 'Daily' ? 'Quotidien' : 'Hebdomadaire'}</span>
                  {task.isDone && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">Fait par {task.user} à {task.doneAt?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-100">
               {!task.isDone ? (
                 <button 
                    onClick={(e) => { e.stopPropagation(); handleTakePhotoClick(task.id); }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Valider avec Photo"
                 >
                   <Camera className="w-6 h-6" />
                 </button>
               ) : (
                 <div className="flex items-center space-x-2">
                   {task.proofPhoto && (
                     <img src={task.proofPhoto} alt="Preuve" className="w-10 h-10 rounded-md object-cover" />
                   )}
                   <button
                    onClick={(e) => { e.stopPropagation(); onUpdateTask(task.id, false); }}
                    className="text-xs text-gray-400 hover:text-red-500 underline"
                   >
                     Annuler
                   </button>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleaningPlan;