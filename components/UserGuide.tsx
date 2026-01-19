import React from 'react';
import { BookOpen, Thermometer, Truck, ClipboardCheck, Tag, Snowflake, Edit, Bot, Download } from './Icons';

const UserGuide: React.FC = () => {
  return (
    <div className="space-y-8 pb-20 md:pb-0 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center space-x-3 mb-2">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Guide Utilisateur</h2>
      </div>
      <p className="text-gray-600">
        Bienvenue dans VISI-JN. Ce guide vous explique comment utiliser chaque module pour garantir votre conformité HACCP.
      </p>

      <div className="grid grid-cols-1 gap-6">

        {/* Module Sauvegarde (Package) - NOUVEAU */}
        <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100">
            <div className="flex items-center mb-4">
                <div className="p-2 bg-emerald-200 text-emerald-800 rounded-lg mr-3">
                    <Download className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Sauvegarde & "Package" (Important)</h3>
            </div>
             <ul className="list-disc ml-5 space-y-3 text-gray-700 text-sm">
                <li><strong>Qu'est-ce qu'un Package ?</strong> C'est un fichier unique (<code>.json</code>) qui contient <strong>l'intégralité</strong> de vos données : l'historique des relevés, vos paramètres, mais aussi toutes vos <strong>photos et documents PDF</strong> du classeur numérique.</li>
                <li><strong>Comment sauvegarder ?</strong> Allez dans l'onglet <em>Paramètres</em>, section "Package", et cliquez sur <strong>"Télécharger le Package"</strong>. Conservez ce fichier précieusement (Cloud, Clé USB, Disque Dur).</li>
                <li><strong>Inclusion des Photos/Docs :</strong> Pas besoin de sauvegarder les images séparément. Elles sont encodées à l'intérieur du fichier Package.</li>
                <li><strong>Alerte Mémoire :</strong> Le navigateur de votre tablette a une mémoire limitée. Si l'application vous signale "Mémoire Pleine", exportez un Package immédiatement pour sécuriser vos données, puis réinitialisez l'application pour faire de la place.</li>
                <li><strong>Restauration :</strong> Pour changer de tablette ou récupérer vos données, il suffit d'utiliser le bouton <strong>"Charger un Package"</strong> dans les paramètres.</li>
            </ul>
        </div>

        {/* Modification des données */}
        <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-200 text-indigo-700 rounded-lg mr-3">
                    <Edit className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Modification des Données</h3>
            </div>
             <ul className="list-disc ml-5 space-y-2 text-gray-700 text-sm">
                <li>Vous pouvez modifier un enregistrement (T°, Livraison, Refroidissement) en cliquant sur l'icône <strong>Crayon</strong> à droite de la ligne.</li>
                <li><strong>Règle de sécurité :</strong> La modification n'est possible que pour les enregistrements effectués <strong>le jour même</strong>.</li>
                <li>Une fois la journée terminée (date passée), les enregistrements deviennent définitifs et inaltérables pour garantir l'intégrité de la traçabilité.</li>
            </ul>
        </div>

        {/* Assistant IA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg mr-3">
                    <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Configuration IA</h3>
            </div>
             <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
                <li>Pour activer l'Assistant Expert, rendez-vous dans l'onglet <strong>Paramètres</strong>.</li>
                <li>Saisissez votre <strong>Clé API Google Gemini</strong> (gratuite).</li>
                <li>L'assistant peut alors répondre à vos questions techniques (réglementation, DLC, allergènes) 24h/24.</li>
            </ul>
        </div>
        
        {/* Module Relevés T° */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
              <Thermometer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Relevés de Température</h3>
          </div>
          <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
            <li>Effectuez vos relevés <strong>2 fois par jour</strong> (matin et soir).</li>
            <li>Si une température est hors norme (> 4°C pour frigo), une alerte est créée.</li>
            <li>En cas d'alerte, ajoutez une action corrective (ex: "Porte mal fermée", "Maintenance appelée").</li>
          </ul>
        </div>

        {/* Module Réception */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Réception Marchandises</h3>
          </div>
          <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
            <li>Contrôlez la température à cœur des produits sensibles (viande, poisson).</li>
            <li><strong>Obligatoire :</strong> Prenez en photo le BL ou l'état du camion en cas de doute.</li>
            <li>Refusez la marchandise si T° > 4°C (frais) ou -15°C (surgelé).</li>
            <li>Le numéro de lot est crucial pour la traçabilité ascendante.</li>
          </ul>
        </div>

        {/* Module Refroidissement */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg mr-3">
              <Snowflake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Cellule de Refroidissement</h3>
          </div>
          <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
            <li>La règle d'or : passer de <strong>+63°C à +10°C en moins de 2 heures</strong>.</li>
            <li>Enregistrez la température de début (sortie four) et de fin (sortie cellule).</li>
            <li>Si le temps dépasse 2h, le lot doit être jeté ou consommé immédiatement (selon procédure interne).</li>
          </ul>
        </div>

        {/* Module Étiquettes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Étiquettes & Traçabilité</h3>
          </div>
          <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
            <li>Pour chaque préparation entamée ou transformée, créez une étiquette.</li>
            <li>Utilisez le bouton <strong>Photo</strong> pour capturer l'étiquette d'origine du fournisseur (numéro de lot, origine).</li>
            <li>La DLC est calculée automatiquement selon vos paramètres (J+3 par défaut).</li>
          </ul>
        </div>

        {/* Module Nettoyage */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-3">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Plan de Nettoyage</h3>
          </div>
          <ul className="list-disc ml-5 space-y-2 text-gray-600 text-sm">
            <li>Suivez le plan quotidien.</li>
            <li>Pour valider une tâche critique, prenez une <strong>photo de preuve</strong> (ex: sol propre, lave-vaisselle vide).</li>
            <li>L'avancement se remet à zéro chaque jour à minuit (simulation).</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default UserGuide;