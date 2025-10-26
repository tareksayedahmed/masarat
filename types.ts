

export enum UserRole {
  HeadAdmin = 'HeadAdmin',
  BranchAdmin = 'BranchAdmin',
  Operator = 'Operator',
  Customer = 'Customer',
  Guest = 'Guest',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; 
}

export interface Branch {
  id: string;
  name: string;
  region: string;
  workingHours: string;
  phone: string;
  lat?: number;
  lng?: number;
}

// Represents the master data for a type of car (e.g., Toyota Camry 2025)
export interface CarModel {
  key: string; // Unique identifier, e.g., "toyota-camry-2025"
  make: string;
  model: string;
  year: number;
  category: 'سيدان' | 'SUV' | 'شاحنة' | 'اقتصادية';
  daily_price: number;
  weekly_price: number;
  monthly_price: number;
  images: string[];
}

// Represents a physical car instance in the fleet
export interface Car {
  id: string;
  modelKey: string; // Foreign key to CarModel
  branchId: string;
  license_plate: string;
  available: boolean;
  status: 'available' | 'maintenance' | 'booked';
}

// A helper type for displaying full car details by combining Car and CarModel
export interface FullCarDetails extends Car {
    make: string;
    model: string;
    year: number;
    category: CarModel['category'];
    daily_price: number;
    weekly_price: number;
    monthly_price: number;
    images: string[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  carId: string; // Refers to a physical Car's id
  userId: string;
  branchId: string;
  startDate: string;
  endDate: string;
  days: number;
  options: {
    insurance: boolean;
    extra_driver: boolean;
    open_km: boolean;
    child_seat: boolean;
    internationalPermit: boolean;
  };
  priceBreakdown: {
    base: number;
    insurance: number;
    extras: number;
    delivery: number;
    tax: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  documents: {
    license?: string | null;
    licenseExpiry: string;
    id_card?: string | null;
  };
  contact: {
    phone1: string;
    phone2?: string;
    address: string;
  };
  notes?: string;
  deliveryOption: 'branch' | 'delivery' | 'delivery_pickup';
  deliveryLocation?: {
      address: string;
      lat: number;
      lng: number;
  };
}

export interface AuditLog {
    id: string;
    user: string;
    action: string;
    timestamp: string;
    details: string;
}