import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch, CarModel, Car, Booking, PricingRule, AppSettings } from '../types';
import { branchesAPI, carModelsAPI, carsAPI, bookingsAPI, pricingAPI, settingsAPI } from '../api';
import { useAuth } from './AuthContext';

interface BookingContextType {
  branches: Branch[];
  carModels: CarModel[];
  cars: Car[];
  bookings: Booking[];
  pricingRules: PricingRule[];
  settings: AppSettings | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  createBooking: (bookingData: any) => Promise<Booking>;
  updateBookingStatus: (id: string, status: string, carId?: string, paymentStatus?: string) => Promise<void>;
  addCar: (carData: any) => Promise<void>;
  updateCar: (id: string, carData: any) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  addPricingRule: (ruleData: any) => Promise<void>;
  deletePricingRule: (id: string) => Promise<void>;
  updateSettings: (settingsData: any) => Promise<void>;
  updateCarModel: (id: string, modelData: any) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const [branchesData, carModelsData, carsData, bookingsData, pricingData, settingsData] = await Promise.all([
        branchesAPI.getAll(),
        carModelsAPI.getAll(),
        carsAPI.getAll(),
        bookingsAPI.getAll(),
        pricingAPI.getAll(),
        settingsAPI.get().catch(() => null), // fail-safe if offline
      ]);

      setBranches(branchesData || []);
      setCarModels(carModelsData || []);
      setCars(carsData || []);
      setBookings(bookingsData || []);
      setPricingRules(pricingData || []);
      if (settingsData) setSettings(settingsData);
    } catch (err) {
      console.error("Failed to load booking context data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Re-fetch data every 30 seconds to keep live dashboard values synced
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const createBooking = async (bookingData: any) => {
    const booking = await bookingsAPI.create(bookingData);
    await refreshData();
    return booking;
  };

  const updateBookingStatus = async (id: string, status: string, carId?: string, paymentStatus?: string) => {
    await bookingsAPI.update(id, { status, carId, paymentStatus });
    await refreshData();
  };

  const addCar = async (carData: any) => {
    await carsAPI.create(carData);
    await refreshData();
  };

  const updateCar = async (id: string, carData: any) => {
    await carsAPI.update(id, carData);
    await refreshData();
  };

  const deleteCar = async (id: string) => {
    await carsAPI.delete(id);
    await refreshData();
  };

  const addPricingRule = async (ruleData: any) => {
    await pricingAPI.create(ruleData);
    await refreshData();
  };

  const deletePricingRule = async (id: string) => {
    await pricingAPI.delete(id);
    await refreshData();
  };

  const updateSettings = async (settingsData: any) => {
    const updated = await settingsAPI.update(settingsData);
    setSettings(updated);
    await refreshData();
  };

  const updateCarModel = async (id: string, modelData: any) => {
    await carModelsAPI.update(id, modelData);
    await refreshData();
  };

  return (
    <BookingContext.Provider value={{
      branches,
      carModels,
      cars,
      bookings,
      pricingRules,
      settings,
      loading,
      refreshData,
      createBooking,
      updateBookingStatus,
      addCar,
      updateCar,
      deleteCar,
      addPricingRule,
      deletePricingRule,
      updateSettings,
      updateCarModel
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
