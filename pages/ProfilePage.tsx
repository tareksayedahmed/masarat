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

  const getStatusChip = (status: Booking['status']) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold leading-tight rounded-full";
    const statusMap = {
        pending: `bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300`,
        confirmed: `bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300`,
        active: `bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300`,
        completed: `bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-300`,
        cancelled: `bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300`
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{t(`status_${status}`)}</span>;
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('ar-SA', {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

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
                <Card key={booking.id} className="p-0 flex flex-col bg-white dark:bg-gray-800">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <div>
                            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">رقم الحجز: <span className="font-mono">{booking.bookingNumber}</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">تاريخ الطلب: {formatDateTime(booking.createdAt)}</p>
                        </div>
                        {getStatusChip(booking.status)}
                    </div>

                    {booking.carDetails && (
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <img src={booking.carDetails.images[0]} alt={booking.carDetails.model} className="w-full md:w-48 h-48 md:h-auto object-cover rounded-lg flex-shrink-0" />
                            <div className="w-full">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{booking.carDetails.make} {booking.carDetails.model} ({booking.carDetails.year})</h3>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-gray-600 dark:text-gray-300"><span className="font-semibold">{t('from')}:</span> {formatDateTime(booking.startDate)}</div>
                                    <div className="text-gray-600 dark:text-gray-300"><span className="font-semibold">{t('to')}:</span> {formatDateTime(booking.endDate)}</div>
                                    <div className="text-gray-600 dark:text-gray-300"><span className="font-semibold">{t('total')}:</span> <span className="font-bold text-orange-600">{booking.priceBreakdown.total.toFixed(2)} ريال</span></div>
                                    <div className="text-gray-600 dark:text-gray-300"><span className="font-semibold">المدة:</span> {booking.days} أيام</div>
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
                  {isActionable && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border-t border-orange-200 dark:border-orange-800/50 p-3 rounded-b-lg flex flex-col sm:flex-row justify-between items-center gap-4">
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
      
       {activeTab === 'info' && (
        <Card className="p-6 bg-white dark:bg-gray-800 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t('personal_info')}</h2>
            <div className="space-y-3">
                <div><span className="font-semibold">{t('name')}:</span> {user.name}</div>
                <div><span className="font-semibold">{t('email')}:</span> {user.email}</div>
            </div>
        </Card>
       )}

       {activeTab === 'settings' && (
         <Card className="p-6 bg-white dark:bg-gray-800 max-w-lg mx-auto">
             <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t('app_settings')}</h2>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{t('dark_mode')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('dark_mode_desc')}</p>
                    </div>
                    <ToggleSwitch checked={theme === 'dark'} onChange={() => toggleTheme()} id="theme-toggle" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{t('language')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('language_desc')}</p>
                    </div>
                    <div className="w-32">
                        <Select value={language} onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')} id="language-select">
                            <option value="ar">{t('arabic')}</option>
                            <option value="en">{t('english')}</option>
                        </Select>
                    </div>
                </div>
             </div>
         </Card>
       )}

      {bookingToCancel && (
        <Modal isOpen={!!bookingToCancel} onClose={() => setBookingToCancel(null)} title="تأكيد الإلغاء">
            <p>هل أنت متأكد من رغبتك في إلغاء الحجز رقم <span className="font-mono">{bookingToCancel.bookingNumber}</span>؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex justify-end gap-4 mt-6">
                <Button variant="secondary" onClick={() => setBookingToCancel(null)}>تراجع</Button>
                <Button variant="danger" onClick={handleConfirmCancel}>نعم، قم بالإلغاء</Button>
            </div>
        </Modal>
      )}

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