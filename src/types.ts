export enum UserRole {
  HeadAdmin = "head_admin",
  BranchAdmin = "branch_admin",
  Operator = "operator",
  Customer = "customer"
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  licenseNumber?: string;
  branchId?: string; // For BranchAdmin / Operator
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface CarModel {
  id: string;
  name: string;
  brand: string;
  type: "sedan" | "suv" | "sports" | "luxury" | "economy";
  transmission: "automatic" | "manual";
  fuelType: "gasoline" | "hybrid" | "electric" | "diesel";
  seats: number;
  pricePerDay: number;
  pricePerWeek?: number; // Daily price when rented for a week (>= 7 days)
  pricePerMonth?: number; // Daily price when rented for a month (>= 30 days)
  imageUrl: string;
  features: string[];
}

export interface Car {
  id: string;
  modelId: string;
  plateNumber: string;
  color: string;
  year: number;
  status: "available" | "rented" | "maintenance";
  branchId: string;
  mileage: number;
  lastServiceDate?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  carId: string;
  carName?: string;
  carImage?: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "completed" | "cancelled" | "rejected";
  totalPrice: number;
  pickupBranchId: string;
  pickupBranchName?: string;
  dropoffBranchId: string;
  dropoffBranchName?: string;
  paymentStatus: "paid" | "unpaid";
  createdAt: string;
  licenseImage?: string;
  idCardImage?: string;
  paymentMethod?: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface PricingRule {
  id: string;
  modelId: string;
  seasonName: string;
  multiplier: number;
  startDate?: string;
  endDate?: string;
}

export interface AppSettings {
  rentalTax: number;
  insuranceFeePerDay: number;
  allowIntercityDropoff: boolean;
  intercityFee: number;
  requireLicenseVerification: boolean;
  minBookingDays?: number;
}
