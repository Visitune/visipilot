import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AppData } from "../types";

export const generateDailyReport = (data: AppData) => {
  const doc = new jsPDF();
  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR");
  const company = data.companyName || "Mon Entreprise";
  const manager = data.managerName || "Responsable";

  // --- EN-TÊTE ---
  doc.setFillColor(30, 58, 138); // Blue-900
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("VISI-JN HACCP", 14, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(company, 14, 30);
  
  doc.setFontSize(10);
  doc.text(`Date : ${dateStr}`, 170, 20);
  doc.text(`Généré à : ${today.toLocaleTimeString()}`, 170, 26);
  doc.text(`Responsable : ${manager}`, 170, 32);

  let currentY = 50;

  // --- 1. RELEVÉS DE TEMPÉRATURE ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("1. Relevés de Températures (Stockage)", 14, currentY);
  currentY += 5;

  // Filter logs for today
  const todaysTemps = data.tempLogs.filter(l => 
    new Date(l.timestamp).toLocaleDateString() === dateStr
  );

  if (todaysTemps.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Heure', 'Équipement', 'T°C', 'Statut', 'Utilisateur']],
      body: todaysTemps.map(log => [
        new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        log.equipment,
        `${log.temperature}°C`,
        log.status.toUpperCase(),
        log.user
      ]),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // Blue-500
      styles: { fontSize: 9 },
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Aucun relevé de température enregistré ce jour.", 14, currentY + 5);
    currentY += 20;
  }

  // --- 2. RÉCEPTION MARCHANDISES ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("2. Réception Marchandises (Traçabilité)", 14, currentY);
  currentY += 5;

  const todaysDeliveries = data.deliveryLogs.filter(l => 
    new Date(l.timestamp).toLocaleDateString() === dateStr
  );

  if (todaysDeliveries.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Heure', 'Fournisseur', 'Produit', 'Lot', 'T°C', 'Photo', 'Statut']],
      body: todaysDeliveries.map(log => [
        new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        log.supplier,
        log.product,
        log.batchNumber,
        `${log.temperature}°C`,
        log.photoUrl ? "OUI" : "NON",
        log.status === 'ok' ? 'ACCEPTE' : 'REFUSE'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] }, // Green-600
      styles: { fontSize: 9 },
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Aucune livraison enregistrée ce jour.", 14, currentY + 5);
    currentY += 20;
  }

  // --- 3. REFROIDISSEMENT RAPIDE ---
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("3. Cycles de Refroidissement", 14, currentY);
  currentY += 5;

  const todaysCooling = data.coolingLogs.filter(l => 
    new Date(l.endTime).toLocaleDateString() === dateStr
  );

  if (todaysCooling.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Produit', 'Lot', 'Début', 'Fin', 'Durée', 'T° Start', 'T° End', 'Statut']],
      body: todaysCooling.map(log => [
        log.product,
        log.batchNumber,
        new Date(log.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        new Date(log.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        `${log.durationMinutes} min`,
        `${log.startTemp}°C`,
        `${log.endTemp}°C`,
        log.status === 'ok' ? 'CONFORME' : 'NON CONFORME'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [8, 145, 178] }, // Cyan-600
      styles: { fontSize: 9 },
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Aucun cycle de refroidissement ce jour.", 14, currentY + 5);
    currentY += 20;
  }

  // --- 4. HUILES DE FRITURE ---
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("4. Contrôle Huiles (TPM)", 14, currentY);
  currentY += 5;

  // For oils, we might want to see the last check even if not today, but let's stick to today's report
  // Or show if any critical status exists regardless of date (safety).
  // For daily report, let's show today's checks.
  const todaysOils = (data.oilLogs || []).filter(l => 
    new Date(l.date).toLocaleDateString() === dateStr
  );

  if (todaysOils.length > 0) {
     autoTable(doc, {
      startY: currentY,
      head: [['Équipement', 'Heure', 'TPM %', 'Changée ?', 'Opérateur', 'Statut']],
      body: todaysOils.map(log => [
        log.fryerName,
        new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        log.oilChanged ? "NEW" : `${log.tpmValue}%`,
        log.oilChanged ? "OUI" : "NON",
        log.signature,
        log.status.toUpperCase()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [202, 138, 4] }, // Yellow-600
      styles: { fontSize: 9 },
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Aucun contrôle d'huile effectué ce jour.", 14, currentY + 5);
    currentY += 20;
  }

  // --- 5. ÉTIQUETTES ---
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("5. Production & Étiquetage", 14, currentY);
  currentY += 5;

  const todaysLabels = data.labelHistory.filter(l => 
    new Date(l.prepDate).toLocaleDateString() === dateStr
  );

  if (todaysLabels.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Produit', 'Lot', 'Préparé le', 'DLC', 'Utilisateur']],
      body: todaysLabels.map(log => [
        log.productName,
        log.batchNumber,
        new Date(log.prepDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        new Date(log.expiryDate).toLocaleDateString(),
        log.user
      ]),
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234] }, // Purple-600
      styles: { fontSize: 9 },
    });
    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Aucune étiquette produite ce jour.", 14, currentY + 5);
    currentY += 20;
  }

  // --- 6. NETTOYAGE ---
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("6. Plan de Nettoyage", 14, currentY);
  currentY += 5;

  const doneTasks = data.cleaningTasks.filter(t => t.isDone);

  if (doneTasks.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Zone', 'Tâche', 'Fait par', 'Heure', 'Preuve Photo']],
      body: doneTasks.map(task => [
        task.area,
        task.taskName,
        task.user || '-',
        task.doneAt ? new Date(task.doneAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
        task.proofPhoto ? "OUI" : "-"
      ]),
      theme: 'grid',
      headStyles: { fillColor: [234, 88, 12] }, // Orange-600
      styles: { fontSize: 9 },
    });
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Aucune tâche de nettoyage validée pour le moment.", 14, currentY + 5);
  }

  // --- FOOTER ---
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} / ${pageCount} - VISI-JN HACCP - Document interne`, 105, 290, { align: 'center' });
  }

  doc.save(`Rapport_HACCP_${dateStr.replace(/\//g, '-')}.pdf`);
};
