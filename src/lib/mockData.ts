import { Department, User } from '../types';

export const departments: Department[] = [
  {
    id: 'dept-1',
    name: 'Cleanliness',
    description: 'Handles complaints related to coach cleanliness, toilets, and hygiene',
    contactEmail: 'cleanliness@railmadad.in'
  },
  {
    id: 'dept-2',
    name: 'Infrastructure',
    description: 'Manages infrastructure damage, repairs, and maintenance',
    contactEmail: 'infrastructure@railmadad.in'
  },
  {
    id: 'dept-3',
    name: 'Safety & Security',
    description: 'Addresses safety concerns, security threats, and emergency situations',
    contactEmail: 'safety@railmadad.in'
  },
  {
    id: 'dept-4',
    name: 'Staff Behavior',
    description: 'Handles complaints about railway staff conduct and service',
    contactEmail: 'staff@railmadad.in'
  },
  {
    id: 'dept-5',
    name: 'Food & Catering',
    description: 'Manages food quality, catering services, and pantry complaints',
    contactEmail: 'catering@railmadad.in'
  },
  {
    id: 'dept-6',
    name: 'Electrical & AC',
    description: 'Handles electrical issues, AC problems, and lighting',
    contactEmail: 'electrical@railmadad.in'
  },
  {
    id: 'dept-7',
    name: 'Other',
    description: 'General complaints that don\'t fit other categories',
    contactEmail: 'support@railmadad.in'
  }
];

export const mockAdmin: User = {
  id: 'admin-1',
  email: 'admin@railmadad.in',
  fullName: 'Admin User',
  role: 'admin',
  createdAt: new Date()
};
