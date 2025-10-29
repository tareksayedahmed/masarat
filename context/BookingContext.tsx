import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import { Booking } from '../types';
import api from '../api';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  fetchBookings: () => Promise<void>;
  addBooking: (newBookingData: Omit<Booking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateBooking: (updatedBooking: Booking) => Promise<boolean>;
  calculatePrice: (data: any) => Promise<any>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    };
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]); // Clear bookings on error
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch bookings when user logs in or page loads with a logged-in user
  useEffect(() => {
    fetchBookings();
  }, [user]);

  const addBooking = async (newBookingData: Omit<Booking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await api.post('/bookings', newBookingData);
      setBookings(prevBookings => [...prevBookings, res.data]);
      return true;
    } catch (error) {
      console.error("Failed to add booking:", error);
      return false;
    }
  };

  const updateBooking = async (updatedBooking: Booking): Promise<boolean> => {
    try {
      const res = await api.put(`/bookings/${updatedBooking.id}`, updatedBooking);
      setBookings(prev => prev.map(b => b.id === updatedBooking.id ? res.data : b));
      return true;
    } catch(error) {
       console.error("Failed to update booking:", error);
       return false;
    }
  };

  const calculatePrice = async (data: any) => {
    try {
        const res = await api.post('/bookings/calculate-price', data);
        return res.data;
    } catch (error) {
        console.error("Failed to calculate price:", error);
        throw error;
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, loading, fetchBookings, addBooking, updateBooking, calculatePrice }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
