import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { CARS, CAR_MODELS } from '../constants';
import { FullCarDetails, Booking } from '../types';
import Card from '../components/ui/Card';
import { useBookings } from '../context/BookingContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState('bookings');

  const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);
  const carsMap = useMemo(() => new Map(CARS.map(c => [c.id, c])), []);

  const getFullCarDetails = (carId: string): FullCarDetails | null => {
    const car = carsMap.get(carId);
    if (!car) return null;
    const model = carModelsMap.get(car.modelKey);
    if (!model) return null;
    return {
        ...car,
        make: model.make,
        model: model.model,
        year: model.year,
        category: model.category,
        daily_price: model.daily_price,
        weekly_price: model.weekly_price,
        monthly_price: model.monthly_price,
        images: model.images,
    };
  };

  const userBookings = useMemo(() => {
    if (!user) return [];
    // Filter bookings by the currently logged-in user's ID
    return bookings.filter(b => b.userId === user.id).map(booking => ({
      ...booking,
      carDetails: getFullCarDetails(booking.carId),
    }));
  }, [user, bookings, carsMap, carModelsMap]);

  if (!user) {
    return <p>الرجاء تسجيل الدخول لعرض صفحتك الشخصية.</p>;
  }

  const getStatusChip = (status: Booking['status']) => {
    const styles: { [key: string]: string } = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    const text: { [key: string]: string } = {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        active: 'جاري الإيجار',
        completed: 'مكتمل',
        cancelled: 'ملغي',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{text[status]}</span>;
  }

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('ar-SA-u-nu-latn', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabButtonClasses = (tabName: string) => 
    `px-6 py-3 font-semibold text-lg border-b-4 transition-colors ${
      activeTab === tabName 
      ? 'border-orange-600 text-orange-600' 
      : 'border-transparent text-gray-500 hover:text-gray-800'
    }`;

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8">صفحتي الشخصية</h1>
      
      <div className="flex border-b mb-6">
        <button onClick={() => setActiveTab('bookings')} className={tabButtonClasses('bookings')}>
          حجوزاتي
        </button>
        <button onClick={() => setActiveTab('info')} className={tabButtonClasses('info')}>
          معلوماتي الشخصية
        </button>
      </div>

      {activeTab === 'info' && (
        <Card className="p-8 bg-white max-w-lg mx-auto shadow-lg">
          <h2 className="text-2xl font-bold mb-4">معلوماتي</h2>
          <div className="space-y-3">
              <div className="text-lg"><strong>الاسم:</strong> {user.name}</div>
              <div className="text-lg"><strong>البريد الإلكتروني:</strong> {user.email}</div>
          </div>
        </Card>
      )}

      {activeTab === 'bookings' && (
        <div>
          {userBookings.length > 0 ? (
            <div className="space-y-6">
              {userBookings.map(booking => (
                <Card key={booking.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center">
                  <img src={booking.carDetails?.images[0]} alt={booking.carDetails?.model} className="w-full md:w-48 h-48 md:h-auto object-cover rounded-lg" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{booking.carDetails?.make} {booking.carDetails?.model}</h3>
                        <p className="text-sm text-gray-500">{booking.bookingNumber}</p>
                      </div>
                      {getStatusChip(booking.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>من:</strong> {formatDateTime(booking.startDate)}</p>
                      <p><strong>إلى:</strong> {formatDateTime(booking.endDate)}</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right border-t md:border-t-0 md:border-r pt-4 md:pt-0 md:pr-6 mt-4 md:mt-0 md:w-48">
                      <p className="text-gray-500">الإجمالي</p>
                      <p className="text-2xl font-bold text-orange-600">{booking.priceBreakdown.total} ريال</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">لا توجد لديك حجوزات حالياً.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;