import React, { useState, useEffect, useMemo } from 'react';
import { Booking, FullCarDetails, User } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import api from '../../api';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSave: (booking: Booking) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ isOpen, onClose, booking, onSave }) => {
  const [editedBooking, setEditedBooking] = useState<Booking>(booking);
  const [carDetails, setCarDetails] = useState<FullCarDetails | null>(null);
  const [customer, setCustomer] = useState<User | null>(null);

  useEffect(() => {
    setEditedBooking(booking);
    const fetchData = async () => {
        try {
            const [carRes, userRes] = await Promise.all([
                api.get(`/data/fleet/${booking.carId}`),
                api.get(`/data/users/${booking.userId}`)
            ]);
            setCarDetails(carRes.data);
            setCustomer(userRes.data);
        } catch (error) {
            console.error("Failed to fetch booking details", error);
        }
    };
    if (isOpen) {
        fetchData();
    }
  }, [booking, isOpen]);

  const handleSave = () => {
    onSave(editedBooking);
  };
  
  // Other handlers remain the same...

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`تفاصيل الحجز #${booking.bookingNumber}`}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-gray-700 dark:text-gray-300">
            <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">العميل</h4>
                <p>{customer?.name} ({customer?.email})</p>
            </div>
             <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">السيارة</h4>
                <p>{carDetails?.make} {carDetails?.model} ({carDetails?.year})</p>
            </div>
            {/* The rest of the form using `editedBooking` */}
            <div className="flex justify-end space-i-2 pt-4">
                <Button variant="secondary" onClick={onClose}>إغلاق</Button>
                <Button onClick={handleSave}>حفظ التغييرات</Button>
            </div>
        </div>
    </Modal>
  );
};

export default BookingDetailsModal;
