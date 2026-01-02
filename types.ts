
export enum UserRole {
  FARMER = 'FARMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export type PaymentMethodType = 'UPI' | 'CARD' | 'NETBANKING' | 'CASH';

export interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  creditLimit: number;
  outstandingBalance: number;
  isVerified: boolean;
  overdue: boolean;
  history: Transaction[];
}

export interface Machinery {
  id: string;
  name: string;
  type: string;
  ownerId: string;
  ownerName: string;
  pricePerDay: number;
  imageUrl: string;
  description: string;
  driverName?: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  variety: string;
  quantity: number;
  unit: string; // e.g., "kg", "quintal", "ton"
  pricePerUnit: number;
  location: string;
  harvestDate: string;
  imageUrl: string;
  description: string;
  status: 'AVAILABLE' | 'SOLD' | 'PENDING';
}

export interface Transaction {
  id: string;
  serviceName: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE' | 'PAID' | 'FAILED';
  type: 'BOOKING' | 'REPAYMENT';
  convenienceFee?: number;
  agriDoCommission?: number;
  paymentMethod?: PaymentMethodType;
  driverName?: string;
  providerMarkedPaid?: boolean;
}

export interface AdminSettings {
  reminderDays: number[];
  lateFeePercentage: number;
  commissionRate: number;
}

export interface NotificationRecord {
  id: string;
  message: string;
  timestamp: string;
  type: 'REMINDER' | 'SUCCESS' | 'ALERT';
  isRead: boolean;
}

export interface AppState {
  role: UserRole;
  currentFarmer: FarmerProfile | null;
  machinery: Machinery[];
  crops: CropListing[];
  transactions: Transaction[];
  settings: AdminSettings;
}
