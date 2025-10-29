import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FullCarDetails, Booking } from '../types';
import Card from '../components/ui/Card';
import { useBookings } from '../context/BookingContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import BookingForm from '../components/booking/BookingForm';
import { useLanguage, TranslationKey } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Select from '../components/ui/Select';
import api from '../api';

const CountdownTimer: React.FC<{ expiryTimestamp: number; onExpire: () => void }> = ({ expiryTimestamp, onExpire }) => {
    const { t } = useLanguage();
    const [timeLeft, setTimeLeft] = useState(expiryTimestamp - Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newTimeLeft = expiryTimestamp - Date.now();
            if (newTimeLeft <= 0) {
                clearInterval(intervalId);
                setTimeLeft(0);
                onExpire();
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [expiryTimestamp, onExpire]);

    if (timeLeft <= 0) {
        return <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('modification_time_ended')}</span>;
    }

    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{t('time_left_to_cancel_edit')}: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
        </div>
    );
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { bookings, loading, updateBooking } = useBookings();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToEdit, setBookingToEdit] = useState<(Booking & { carDetails: FullCarDetails | null }) | null>(null);
  const [fleet, setFleet] = useState<FullCarDetails[]>([]);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    const fetchFleet = async () => {
        try {
            const res = await api.get('/data/fleet');
            setFleet(res.data);
        } catch (error) {
            console.error("Failed to fetch fleet data", error);
        }
    };
    fetchFleet();
  }, []);

  const getFullCarDetails = (carId: string): FullCarDetails | null => {
    return fleet.find(car => car.id === carId) || null;
  };

  const userBookings = useMemo(() => {
    if (!user) return [];
    return bookings
      .map(booking => ({
        ...booking,
        carDetails: getFullCarDetails(booking.carId),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user, bookings, fleet]);
  
  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      updateBooking({ ...bookingToCancel, status: 'cancelled' });
      setBookingToCancel(null);
    }
  };
  
  const handleSaveEdit = (
    bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>,
    existingBookingId?: string
  ) => {
    if (!existingBookingId || !bookingToEdit) return;
    const updatedData: Booking = {
        ...bookingToEdit, 
        ...bookingData,
    };
    updateBooking(updatedData);
    setBookingToEdit(null);
  };

  if (!user) {
    return <p className="text-gray-800 dark:text-gray-200">الرجاء تسجيل الدخول لعرض صفحتك الشخصية.</p>;
  }

  const getStatusChip = (status: Booking['status']) => { /* ... */ };
  const formatDateTime = (isoString: string) => { /* ... */ };

  const tabButtonClasses = (tabName: string) => 
    `px-6 py-3 font-semibold text-lg border-b-4 transition-colors ${
      activeTab === tabName 
      ? 'border-orange-600 text-orange-600' 
      : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
    }`;

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100">{t('my_profile')}</h1>
      
      <div className="flex border-b mb-6 dark:border-gray-700">
        <button onClick={() => setActiveTab('bookings')} className={tabButtonClasses('bookings')}>{t('my_bookings')}</button>
        <button onClick={() => setActiveTab('info')} className={tabButtonClasses('info')}>{t('personal_info')}</button>
        <button onClick={() => setActiveTab('settings')} className={tabButtonClasses('settings')}>{t('settings')}</button>
      </div>

      {activeTab === 'bookings' && (
        <div>
          {loading ? <p>جاري تحميل حجوزاتك...</p> : userBookings.length > 0 ? (
            <div className="space-y-6">
              {userBookings.map(booking => {
                 const bookingTime = new Date(booking.createdAt).getTime();
                 const expiryTime = bookingTime + 30 * 60 * 1000;
                 const isActionable = booking.status === 'pending' && Date.now() < expiryTime;

                return (
                <Card key={booking.id} className="p-4 md:p-6 flex flex-col gap-4 bg-white dark:bg-gray-800">
                  {/* Card Content */}
                  {booking.carDetails && (
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <img src={booking.carDetails.images[0]} alt={booking.carDetails.model} className="w-full md:w-48 h-48 md:h-auto object-cover rounded-lg" />
                        {/* other details */}
                    </div>
                  )}
                  {isActionable && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border-t-2 border-orange-200 dark:border-orange-800/50 p-3 rounded-b-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CountdownTimer expiryTimestamp={expiryTime} onExpire={() => setRenderTrigger(Date.now())} />
                        <div className="flex items-center gap-2">
                          <Button variant="danger" size="sm" onClick={() => setBookingToCancel(booking)}>{t('cancel_booking')}</Button>
                          <Button variant="secondary" size="sm" onClick={() => setBookingToEdit(booking)}>{t('edit_booking')}</Button>
                        </div>
                    </div>
                  )}
                </Card>
              )})}
            </div>
          ) : (
            <div className="text-center py-16"><p className="text-xl text-gray-500 dark:text-gray-400">{t('no_bookings_yet')}</p></div>
          )}
        </div>
      )}

      {/* Other tabs and modals */}
       {bookingToEdit && bookingToEdit.carDetails && (
        <Modal
            isOpen={!!bookingToEdit}
            onClose={() => setBookingToEdit(null)}
            title={`${t('edit_booking')} - ${bookingToEdit.carDetails.make} ${bookingToEdit.carDetails.model}`}
        >
            <BookingForm
                car={bookingToEdit.carDetails}
                onClose={() => setBookingToEdit(null)}
                onSave={handleSaveEdit}
                existingBooking={bookingToEdit}
            />
        </Modal>
      )}

    </div>
  );
};

export default ProfilePage;
