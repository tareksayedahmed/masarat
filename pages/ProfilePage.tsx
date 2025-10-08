import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { BOOKINGS, CARS, BRANCHES, CAR_MODELS } from '../constants';
import Card from '../components/ui/Card';
import { Booking, FullCarDetails } from '../types';

// SVG Icons for better visual representation
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PriceTagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 15h2.172a2 2 0 001.414-.586l7.586-7.586a2 2 0 00-2.828-2.828l-7.586 7.586A2 2 0 005 12.828V15a2 2 0 002 2z" />
  </svg>
);


const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  
  const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);
  const carsMap = useMemo(() => new Map(CARS.map(c => [c.id, c])), []);

  if (!user) {
    return <p>الرجاء تسجيل الدخول لعرض صفحتك الشخصية.</p>;
  }
  
  // casting because mock data is simplified
  const userBookings = (BOOKINGS as unknown as Booking[]).filter(b => b.userId === user.id || b.userId === 'user-customer'); // demo purposes

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

  const getStatusChip = (status: string) => {
    const styles: { [key: string]: string } = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-gray-200 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    const text: { [key: string]: string } = {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        active: 'جاري الإيجار',
        completed: 'مكتمل',
        cancelled: 'ملغي',
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
  }
  
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('ar-SA-u-nu-latn', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const tabClasses = (tabName: string) => 
    `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg cursor-pointer transition-colors duration-200 ${
      activeTab === tabName
        ? 'border-orange-500 text-orange-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;


  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8">صفحتي الشخصية</h1>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-i-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('info')} className={tabClasses('info')}>
            معلوماتي
          </button>
          <button onClick={() => setActiveTab('bookings')} className={tabClasses('bookings')}>
            حجوزاتي
            <span className="ms-2 px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">{userBookings.length}</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'info' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-4">معلوماتي الشخصية</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-i-6 space-y-2 sm:space-y-0">
                <div className="text-lg"><strong>الاسم:</strong> {user.name}</div>
                <div className="text-lg"><strong>البريد الإلكتروني:</strong> {user.email}</div>
            </div>
          </Card>
        )}
        
        {activeTab === 'bookings' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.length > 0 ? userBookings.map(booking => {
                const car = getFullCarDetails(booking.carId);
                const branch = BRANCHES.find(b => b.id === booking.branchId);
                return (
                  <Card key={booking.id} className="flex flex-col bg-white overflow-hidden">
                      {car && <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-40 object-cover" />}
                      <div className="p-5 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                              <div>
                                  <p className="font-bold text-xl text-gray-800">{car?.make} {car?.model}</p>
                                  <p className="text-sm text-gray-500">{branch?.name}</p>
                              </div>
                              {getStatusChip(booking.status)}
                          </div>

                          <div className="space-y-3 text-sm text-gray-600 flex-grow">
                             <div className="flex items-center gap-3">
                                  <CalendarIcon />
                                  <span>من <strong>{formatDateTime(booking.startDate)}</strong></span>
                             </div>
                              <div className="flex items-center gap-3">
                                  <CalendarIcon />
                                  <span>إلى <strong>{formatDateTime(booking.endDate)}</strong></span>
                              </div>
                               <div className="flex items-center gap-3">
                                  <PriceTagIcon />
                                  <span>الإجمالي: <strong className="text-base text-orange-600">{booking.priceBreakdown.total} ريال</strong></span>
                              </div>
                          </div>
                          
                          {booking.status === 'cancelled' && booking.notes && (
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-red-700"><strong>سبب الإلغاء:</strong> {booking.notes}</p>
                              </div>
                          )}
                      </div>
                  </Card>
                );
              }) : <p>ليس لديك أي حجوزات حتى الآن.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
