
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff';
}

export interface TempLog {
  id: string;
  equipment: string;
  temperature: number;
  timestamp: Date;
  status: 'ok' | 'warning' | 'critical';
  user: string;
}

export interface CoolingLog {
  id: string;
  product: string;
  batchNumber: string;
  startTime: Date;
  startTemp: number;
  endTime: Date;
  endTemp: number;
  durationMinutes: number;
  status: 'ok' | 'critical'; // Must be < 110 mins usually to reach target
  user: string;
}

export interface LabelLog {
  id: string;
  productName: string;
  batchNumber: string;
  prepDate: Date;
  expiryDate: Date;
  user: string;
}

export interface CleaningTask {
  id: string;
  area: string;
  taskName: string;
  frequency: 'Quotidien' | 'Hebdo';
  isDone: boolean;
  doneAt?: Date;
  user?: string;
  proofPhoto?: string; // Base64 string
}

export interface DeliveryLog {
  id: string;
  supplier: string;
  product: string;
  temperature: number;
  batchNumber: string;
  photoUrl?: string; // Base64 string
  status: 'ok' | 'refused';
  timestamp: Date;
  comment?: string;
}

export interface OilLog {
  id: string;
  fryerName: string;
  tpmValue: number; // Taux Composés Polaires
  oilChanged: boolean;
  signature: string; // Nom de l'employé
  date: Date;
  status: 'ok' | 'warning' | 'critical';
}

export interface DocItem {
  id: string;
  category: 'Formation' | 'Analyses' | 'Nuisibles' | 'Autre';
  title: string;
  uploadDate: Date;
  fileData?: string; // Base64 placeholder
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  pin?: string;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  TEMPERATURES = 'TEMPERATURES',
  COOLING = 'COOLING',
  LABELS = 'LABELS',
  CLEANING = 'CLEANING',
  DELIVERIES = 'DELIVERIES',
  OILS = 'OILS',
  DOCS = 'DOCS',
  ASSISTANT = 'ASSISTANT',
  GUIDE = 'GUIDE',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// Global App State Interface for Backup/Restore
export interface AppData {
  tempLogs: TempLog[];
  deliveryLogs: DeliveryLog[];
  cleaningTasks: CleaningTask[];
  coolingLogs: CoolingLog[];
  labelHistory: LabelLog[];
  oilLogs?: OilLog[];
  documents?: DocItem[];
  teamMembers?: TeamMember[];
  // Configuration
  equipmentList?: string[];
  cleaningSchedule?: CleaningTask[]; // Template for tasks
  // Settings
  apiKey?: string;
  companyName?: string;
  managerName?: string;
}
