import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { Card } from '../components/ui/Card';
import { Calendar, User, Phone, MapPin, Landmark, ArrowRight, BookOpen } from 'lucide-react';
import RevealOnScroll from '../components/common/RevealOnScroll';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { bookings, loading } = useBookings();

  // Redirect or block if not loaded
  if (!user) {
    return (
      <div className="max-w-md mx-auto pt-20 px-4 text-center">
        <h2 className="text-xl font-bold">يرجى تسجيل الدخول لعرض حسابك الشخصي</h2>
      </div>
    );
  }

  // Filter bookings belonging to this specific user
  const myBookings = bookings.filter((b) => b.userId === user.id);

  const statusColors = {
    pending: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400',
    approved: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400',
    completed: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400',
    cancelled: 'text-gray-500 bg-gray-50 border-gray-100 dark:bg-gray-800 dark:text-gray-400',
    rejected: 'text-red-600 bg-red-50 border-red-100 dark:bg-red-950/20 dark:text-red-400',
  };

  const statusLabels = {
    pending: 'بانتظار الموافقة',
    approved: 'مؤكدة / جارية',
    completed: 'مكتملة ومسترجعة',
    cancelled: 'ملغية',
    rejected: 'مرفوضة',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Customer Information Panel (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <RevealOnScroll>
            <Card className="p-8 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
              
              {/* Large initials badge */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-orange-500/20 mb-4 select-none">
                {user.name[0]}
              </div>

              <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-1">
                {user.name}
              </h2>
              <span className="text-xs text-gray-450 uppercase font-mono tracking-wider mb-6 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                {user.role === 'customer' ? 'مستأجر معتمد' : 'حساب إداري'}
              </span>

              {/* Specs detailed list */}
              <div className="w-full space-y-4 text-xs text-right border-t border-gray-100 dark:border-gray-850 pt-5">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium"><User className="w-4 h-4 text-gray-400" /> البريد الإلكتروني:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-250 font-semibold">{user.email}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium"><Phone className="w-4 h-4 text-gray-400" /> رقم الجوال:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-250 font-semibold">{user.phone}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium"><BookOpen className="w-4 h-4 text-gray-400" /> رخصة القيادة:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-250 font-semibold">{user.licenseNumber || 'غير مسجلة'}</span>
                </div>
              </div>

            </Card>
          </RevealOnScroll>
        </div>

        {/* Previous Bookings history list (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <RevealOnScroll delay={100}>
            <div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">سجل حجوزاتك ومستنداتها</h3>
              <p className="text-xs text-gray-400 mt-1">تابع حالة طلبات تأجير سياراتك ومواعيد الاستلام والتسجيل والتكلفة الإجمالية في فروعنا</p>
            </div>
          </RevealOnScroll>

          {loading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : myBookings.length === 0 ? (
            <RevealOnScroll delay={200}>
              <Card className="p-10 text-center border-dashed border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850">
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center mx-auto mb-4">
                  <span>🚗</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">لا توجد أي حجوزات حالياً!</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed mb-6">تبدو قائمتك فارغة. ابدأ حجز سيارة فخمة أو عائلية الآن عبر صفحتنا الرئيسية بأسعار مذهلة.</p>
              </Card>
            </RevealOnScroll>
          ) : (
            <div className="flex flex-col gap-5">
              {myBookings.map((b, idx) => (
                <RevealOnScroll key={b.id} delay={idx * 100}>
                  <Card className="p-6 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all hover:border-orange-500/10">
                    
                    {/* Car Model Info details */}
                    <div className="flex items-center gap-4">
                      {b.carImage && (
                        <img src={b.carImage} alt={b.carName} className="w-20 h-14 object-cover rounded-xl border border-gray-100 dark:border-gray-750 flex-shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-md leading-snug">{b.carName}</h4>
                        <span className="text-[10px] text-gray-400 block mt-1 font-mono">رقم الحجز المرجعي: {b.id}</span>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-orange-500" /> {b.pickupBranchName}</span>
                          <span className="text-gray-300">|</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {b.startDate} / {b.endDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rates & Booking Status */}
                    <div className="flex sm:flex-col items-end gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800 justify-between">
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-600 dark:text-orange-500 font-mono">{b.totalPrice} ريال</span>
                        <p className="text-[10px] text-gray-400">سداد: <span className={b.paymentStatus === 'paid' ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>{b.paymentStatus === 'paid' ? 'مسدد بالكامل' : 'مستحق عند الاستلام'}</span></p>
                      </div>

                      <div className={`px-3 py-1 rounded-full border text-[10px] font-bold ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </div>
                    </div>

                  </Card>
                </RevealOnScroll>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;
