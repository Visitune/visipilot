import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TempLog, DeliveryLog, CleaningTask, CoolingLog, LabelLog } from '../types';
import { CheckCircle, AlertTriangle, Thermometer, FileText, Download, Truck, ClipboardCheck } from './Icons';
import { generateDailyReport } from '../utils/pdfGenerator';

interface DashboardProps {
  tempLogs: TempLog[];
  deliveryLogs: DeliveryLog[];
  cleaningTasks: CleaningTask[];
  coolingLogs: CoolingLog[];
  labelHistory?: LabelLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ tempLogs, deliveryLogs, cleaningTasks, coolingLogs, labelHistory = [] }) => {
  // --- CALCULATE REAL STATS ---
  
  // 1. Compliance Rate Calculation
  const tempCompliance = tempLogs.filter(l => l.status === 'ok').length;
  const deliveryCompliance = deliveryLogs.filter(l => l.status === 'ok').length;
  const cleaningCompliance = cleaningTasks.filter(t => t.isDone).length;
  const coolingCompliance = coolingLogs.filter(l => l.status === 'ok').length;
  
  const totalActions = tempLogs.length + deliveryLogs.length + cleaningTasks.length + coolingLogs.length;
  const totalCompliant = tempCompliance + deliveryCompliance + cleaningCompliance + coolingCompliance;
  
  const complianceRate = totalActions > 0 ? Math.round((totalCompliant / totalActions) * 100) : 100;

  // 2. Charts Data
  const recentTemps = tempLogs.slice(0, 10).reverse().map(log => ({
    name: log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: log.temperature,
    status: log.status
  }));

  const activityData = [
    { name: 'Temp', value: tempLogs.length },
    { name: 'Froid', value: coolingLogs.length },
    { name: 'Livraisons', value: deliveryLogs.length },
    { name: 'Nettoyage', value: cleaningTasks.filter(t => t.isDone).length },
  ];

  const handleExport = () => {
    // We retrieve the settings from localStorage directly here to avoid prop drilling complex state for now,
    // or rely on the fact that App calls the generator.
    // However, since Dashboard triggers the action, let's grab the persisted data for company name.
    const savedData = localStorage.getItem('visipilot_haccp_data_v1');
    let companyName = "Mon Entreprise";
    let managerName = "Responsable";
    
    if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.companyName) companyName = parsed.companyName;
        if (parsed.managerName) managerName = parsed.managerName;
    }

    generateDailyReport({
      tempLogs,
      deliveryLogs,
      cleaningTasks,
      coolingLogs,
      labelHistory,
      companyName,
      managerName
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      {/* Action Bar */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900">Rapport Journalier</h3>
            <p className="text-sm text-indigo-600">Générer le PDF officiel de la journée (Traçabilité & Contrôles)</p>
          </div>
        </div>
        <button 
          onClick={handleExport}
          className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center font-bold transition-transform active:scale-95"
        >
          <Download className="w-5 h-5 mr-2" />
          Télécharger le PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${complianceRate >= 90 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Taux de Conformité</p>
            <h3 className={`text-2xl font-bold ${complianceRate >= 90 ? 'text-green-700' : 'text-orange-600'}`}>
              {complianceRate}%
            </h3>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Actions Réalisées</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalActions}</h3>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Alertes / Refus</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {tempLogs.filter(l => l.status !== 'ok').length + deliveryLogs.filter(l => l.status === 'refused').length + coolingLogs.filter(l => l.status !== 'ok').length}
            </h3>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION - HIDDEN ON MOBILE (Simplified View), VISIBLE ON TABLET/DESKTOP */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Dernières Températures</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentTemps}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition des Activités</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Mobile-Only Message */}
      <div className="block md:hidden text-center text-sm text-gray-500 mt-4 italic">
         Affichage simplifié pour mobile. Utilisez les onglets ci-dessous pour la saisie.
      </div>
    </div>
  );
};

export default Dashboard;