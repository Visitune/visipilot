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
  frequency: 'Daily' | 'Weekly';
  isDone: boolean;
  doneAt?: Date;
  user?: string;
  proofPhoto?: string;
}

export interface DeliveryLog {
  id: string;
  supplier: string;
  product: string;
  temperature: number;
  batchNumber: string;
  photoUrl?: string;
  status: 'ok' | 'refused';
  timestamp: Date;
  comment?: string;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  TEMPERATURES = 'TEMPERATURES',
  COOLING = 'COOLING',
  LABELS = 'LABELS',
  CLEANING = 'CLEANING',
  DELIVERIES = 'DELIVERIES'
}