
import { FarmerProfile, Machinery, Transaction, UserRole, AdminSettings } from '../types';

export const MOCK_FARMER: FarmerProfile = {
  id: 'f-001',
  name: 'Rajesh Kumar',
  location: 'Vidarbha, Maharashtra',
  creditLimit: 25000,
  outstandingBalance: 8500,
  isVerified: true,
  overdue: false,
  history: [
    {
      id: 't-1',
      serviceName: 'John Deere 5050D Rental',
      amount: 4500,
      date: '2024-03-10',
      dueDate: '2024-05-15',
      status: 'PENDING',
      type: 'BOOKING',
      convenienceFee: 150
    },
    {
      id: 't-2',
      serviceName: 'Harvesting Service',
      amount: 4000,
      date: '2024-02-15',
      dueDate: '2024-04-15',
      status: 'COMPLETED',
      type: 'BOOKING',
      convenienceFee: 200
    }
  ]
};

export const DEFAULT_SETTINGS: AdminSettings = {
  reminderDays: [7, 1],
  lateFeePercentage: 2,
  commissionRate: 10
};

export const MOCK_MACHINERY: Machinery[] = [
  {
    id: 'm-1',
    name: 'Mahindra Arjun 605 DI',
    type: 'Tractor',
    ownerId: 'p-001',
    ownerName: 'Suresh Patil',
    pricePerDay: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1592919016327-519638ecd757?auto=format&fit=crop&q=80&w=1200',
    description: 'High-performance 60HP tractor designed for heavy-duty plowing and land preparation.'
  },
  {
    id: 'm-4',
    name: 'John Deere 5310 GearPro',
    type: 'Tractor',
    ownerId: 'p-003',
    ownerName: 'Vikram Mehta',
    pricePerDay: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1595066344551-0e1041183f06?auto=format&fit=crop&q=80&w=1200',
    description: 'Premium agricultural powerhouse with enhanced gear control for precision farming.'
  },
  {
    id: 'm-2',
    name: 'Swaraj 855 FE',
    type: 'Tractor',
    ownerId: 'p-002',
    ownerName: 'Amit Singh',
    pricePerDay: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1594136894086-f6f71694f56d?auto=format&fit=crop&q=80&w=1200',
    description: 'Iconic Indian tractor known for its ruggedness and exceptional reliability in dry soil.'
  }
];
