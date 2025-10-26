import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { Booking } from '../types';
import { BOOKINGS as initialBookings } from '../constants';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (newBookingData: Omit<Booking, 'id' | 'bookingNumber' | 'status'>) => void;
  updateBooking: (updatedBooking: Booking) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addBooking = (newBookingData: Omit<Booking, 'id' | 'bookingNumber' | 'status'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}`,
      bookingNumber: `MAS-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'pending', // All new bookings start as pending
    };
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBooking }}>
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
