import React from 'react';
import { BookOpen, Thermometer, Truck, ClipboardCheck, Tag, Snowflake, Bot, Download, AlertTriangle, Trash, Folder } from './Icons';

const UserGuide: React.FC = () => {
  return (
    <div className="space-y-8 pb-32 md:pb-10 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-16 -mb-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-inner border border-white/20">
                    <BookOpen className="w-10 h-10 text-indigo-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Guide Utilisateur</h1>
                    <p className="text-slate-300 text-lg font-medium mt-1">Maîtrisez votre conformité HACCP</p>
                </div>
            </div>
            <div className="text-sm font-medium bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                Version 2.4 • Mode Hors-Ligne
            </div>
        </div>
      </div>

      {/* CORE FEATURE: LE PACKAGE */}
      <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-emerald-50/50 p-8 border-b border-emerald-100">
           <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-200">
                   <Download className="w-8 h-8" />
               </div>
               <div>
                   <h3 className="text-2xl font-bold text-slate-800">Le système de "Package"</h3>
                   <p className="text-emerald-700 font-medium">Comprendre la sauvegarde et la gestion mémoire</p>
               </div>
           </div>
           <p className="text-slate-600 max-w-3xl leading-relaxed">
               VISI-JN est une application <strong>sécurisée et autonome</strong> : vos données (photos, relevés) sont stockées directement dans votre tablette. 
               Pour garantir la pérennité de vos données, nous utilisons des "Packages" (archives compressées).
           </p>
        </div>
        
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Etape 1 */}
                <div className="group relative p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform">1</div>
                    <div className="flex flex-col items-center text-center mb-6 mt-2">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
                            <Download className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-lg text-slate-800">Exporter le Package</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-center">
                        Dans l'onglet <strong>Paramètres</strong>, cliquez sur "Télécharger le Package". 
                        L'app génère un fichier unique contenant <strong>tout votre historique</strong> et <strong>toutes vos photos</strong>.
                    </p>
                </div>

                {/* Etape 2 */}
                <div className="group relative p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg -rotate-3 group-hover:rotate-0 transition-transform">2</div>
                    <div className="flex flex-col items-center text-center mb-6 mt-2">
                         <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                            <Folder className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-lg text-slate-800">Archiver en sécurité</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-center">
                        Une fois téléchargé, ce fichier est votre <strong>archive légale</strong>. 
                        Stockez-le sur une clé USB, un disque dur externe ou envoyez-le par email à la direction.
                    </p>
                </div>

                {/* Etape 3 */}
                <div className="group relative p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform">3</div>
                    <div className="flex flex-col items-center text-center mb-6 mt-2">
                         <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                            <Trash className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-lg text-slate-800">Faire place nette</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-center">
                        Si la tablette est pleine (alerte mémoire), et <strong>seulement après avoir sécurisé le package</strong>, 
                        utilisez le bouton "Réinitialiser" pour vider l'application.
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                <div>
                    <h5 className="font-bold text-indigo-900">Fréquence recommandée</h5>
                    <p className="text-sm text-indigo-700 mt-1">
                        Nous recommandons de créer un Package <strong>à la fin de chaque mois</strong> ou dès que vous recevez une alerte de stockage. 
                        C'est la garantie de ne jamais perdre vos relevés en cas de panne de tablette.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* MODULES GRID */}
      <h3 className="text-xl font-bold text-slate-800 pl-2 border-l-4 border-indigo-500">Modules Opérationnels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Relevés T° */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Thermometer className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">Relevés de Température</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></span>
                    <span>2 relevés par jour (Matin/Soir) recommandés.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></span>
                    <span>Zone verte : 0°C à 4°C. Zone rouge : {'>'} 8°C.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></span>
                    <span>Actions correctives obligatoires en cas d'alerte.</span>
                </li>
            </ul>
        </div>

        {/* Réception */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Truck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">Réception Marchandises</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                    <span>Photo du BL ou du camion obligatoire si anomalie.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                    <span>Saisissez le N° de Lot pour la traçabilité.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                    <span>Refusez si T° {'>'} 4°C (frais) ou -15°C (surgelé).</span>
                </li>
            </ul>
        </div>

        {/* Refroidissement */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                    <Snowflake className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">Cellule de Refroidissement</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 shrink-0"></span>
                    <span>Objectif : +63°C à +10°C en {'<'} 2 heures.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 shrink-0"></span>
                    <span>Chronomètre automatique de la durée.</span>
                </li>
            </ul>
        </div>

        {/* Étiquettes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Tag className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">Étiquettes DLC</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 shrink-0"></span>
                    <span>Calcul automatique de la DLC (J+3 par défaut).</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 shrink-0"></span>
                    <span>Prenez en photo l'étiquette d'origine fournisseur.</span>
                </li>
            </ul>
        </div>

        {/* Nettoyage */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <ClipboardCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">Plan de Nettoyage</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 shrink-0"></span>
                    <span>Liste des tâches quotidiennes et hebdo.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 shrink-0"></span>
                    <span>Possibilité d'ajouter une "Preuve Photo".</span>
                </li>
            </ul>
        </div>

         {/* IA & Modifs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                    <Bot className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">Assistant & Modifications</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></span>
                    <span>Modifications possibles uniquement le jour J (crayon).</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 shrink-0"></span>
                    <span>Assistant IA disponible pour questions réglementaires.</span>
                </li>
            </ul>
        </div>

      </div>
    </div>
  );
};

export default UserGuide;