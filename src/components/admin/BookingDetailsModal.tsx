import React, { useState } from 'react';
import { Booking, Car } from '../../types';
import { useBookings } from '../../context/BookingContext';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Calendar, Phone, Landmark, Car as CarIcon, AlertCircle, Bookmark } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { cars, updateBookingStatus } = useBookings();
  const [selectedCarId, setSelectedCarId] = useState(booking.carId || '');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>(booking.paymentStatus);
  const [loading, setLoading] = useState(false);

  // Get physical cars of this model that are currently available or already assigned
  const availableCars = cars.filter(
    (c) => c.modelId && c.branchId === booking.pickupBranchId && (c.status === 'available' || c.id === booking.carId)
  );

  const handleAction = async (newStatus: 'approved' | 'completed' | 'cancelled' | 'rejected') => {
    setLoading(true);
    try {
      await updateBookingStatus(booking.id, newStatus, selectedCarId, paymentStatus);
      onClose();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث حالة الحجز');
    } finally {
      setLoading(false);
    }
  };

  const textColors = {
    pending: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400',
    approved: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400',
    completed: 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450',
    cancelled: 'text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
    rejected: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400',
  };

  const statusLabels = {
    pending: 'قيد الانتظار',
    approved: 'مقبول / نشط',
    completed: 'مكتمل ومسترجع',
    cancelled: 'ملغي من العميل',
    rejected: 'مرفوض',
  };

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Overview Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-150 dark:border-gray-800">
        <div>
          <span className="text-xs text-gray-400 font-medium">رقم الحجز:</span>
          <p className="text-md font-bold text-gray-900 dark:text-white font-mono">{booking.id}</p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold ${textColors[booking.status]}`}>
          {statusLabels[booking.status]}
        </div>
      </div>

      {/* Customer / Car Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-3">
            👥 بيانات المستأجر
          </h4>
          <ul className="space-y-2 text-xs">
            <li><strong className="text-gray-450">الاسم:</strong> <span className="text-gray-800 dark:text-gray-200 font-semibold">{booking.userName}</span></li>
            <li><strong className="text-gray-450">رقم الهاتف:</strong> <span className="text-gray-800 dark:text-gray-200 font-mono">{booking.userPhone}</span></li>
            <li><strong className="text-gray-450">البريد الإلكتروني:</strong> <span className="text-gray-800 dark:text-gray-200 font-mono">العميل مسجل بالنظام</span></li>
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex items-center gap-3">
          {booking.carImage && (
            <img src={booking.carImage} alt={booking.carName} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
          )}
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">🚗 فئة الموديل المحجوز</h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{booking.carName}</p>
          </div>
        </div>
      </div>

      {/* Payment & Verification Documents Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment details card */}
        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col gap-1.5">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            💳 طريقة السداد والتحصیل الائتماني
          </h4>
          <div className="text-xs space-y-2 mt-1">
            <div className="flex justify-between items-center bg-white dark:bg-gray-850 p-2 rounded-lg border border-gray-150/40 dark:border-gray-800/40">
              <span className="text-gray-400">وسيلة الدفع المتبعة:</span>
              <span className={`font-bold px-2.5 py-1 rounded text-[11px] ${
                booking.paymentMethod === 'apple_pay'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-sans'
                  : booking.paymentMethod === 'stc_pay'
                  ? 'bg-purple-600 text-white font-sans'
                  : booking.paymentMethod === 'credit'
                  ? 'bg-blue-650 text-white'
                  : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
              }`}>
                {booking.paymentMethod === 'apple_pay' && 'Apple Pay '}
                {booking.paymentMethod === 'stc_pay' && 'STC Pay'}
                {booking.paymentMethod === 'credit' && 'بطاقة مدى / ائتمانية'}
                {(!booking.paymentMethod || booking.paymentMethod === 'cash') && 'كاش / عند الاستلام بالفرع'}
              </span>
            </div>
            <div className="flex justify-between items-center bg-white dark:bg-gray-850 p-2 rounded-lg border border-gray-150/40 dark:border-gray-800/40">
              <span className="text-gray-400">حالة المستند المالي:</span>
              <span className={`font-bold text-[11px] ${booking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {booking.paymentStatus === 'paid' ? 'تم الدفع والتحصيل رقمياً ✓' : 'في انتظار السداد بالفرع'}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Verification Documents */}
        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col gap-1.5">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
            📄 ملفات الثبوت والتحقق للعميل
          </h4>
          <div className="grid grid-cols-2 gap-2.5 mt-1">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">رخصة القيادة:</span>
              {booking.licenseImage ? (
                <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-16 bg-white cursor-pointer hover:opacity-90">
                  <img 
                    src={booking.licenseImage} 
                    alt="رخصة القيادة" 
                    className="w-full h-full object-cover" 
                    onClick={() => {
                      const w = window.open();
                      if (w) w.document.write(`<img src="${booking.licenseImage}" style="max-width:100%"/>`);
                    }} 
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-center text-white py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">معاينة</div>
                </div>
              ) : (
                <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/5 px-2 py-1 rounded block">لم تُرفع</span>
              )}
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">الهوية الوطنية / الإقامة:</span>
              {booking.idCardImage ? (
                <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-16 bg-white cursor-pointer hover:opacity-90">
                  <img 
                    src={booking.idCardImage} 
                    alt="الهوية الشخصية" 
                    className="w-full h-full object-cover" 
                    onClick={() => {
                      const w = window.open();
                      if (w) w.document.write(`<img src="${booking.idCardImage}" style="max-width:100%"/>`);
                    }} 
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-center text-white py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">معاينة</div>
                </div>
              ) : (
                <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/5 px-2 py-1 rounded block">لم تُرفع</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logistics and dates */}
      <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 space-y-3.5">
        <h4 className="font-bold text-sm text-gray-900 dark:text-white">📍 تفاصيل الرحلة اللوجستية</h4>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-350">
          <div><strong className="text-gray-450">فرع الاستلام:</strong> <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200">{booking.pickupBranchName}</p></div>
          <div><strong className="text-gray-450">تاريخ الاستلام:</strong> <p className="mt-1 font-mono font-bold text-gray-800 dark:text-gray-200">{booking.startDate}</p></div>
          <div><strong className="text-gray-450">فرع التسليم:</strong> <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200">{booking.dropoffBranchName}</p></div>
          <div><strong className="text-gray-450">تاريخ التسليم:</strong> <p className="mt-1 font-mono font-bold text-gray-800 dark:text-gray-200">{booking.endDate}</p></div>
        </div>
      </div>

      {/* Operations Panel (Only editable if not finalized) */}
      {['pending', 'approved'].includes(booking.status) ? (
        <div className="p-4 rounded-xl border border-orange-500/15 bg-orange-50/5 dark:bg-orange-950/5 space-y-4">
          <h4 className="font-bold text-sm text-orange-600 dark:text-orange-500 flex items-center gap-2">
            ⚙️ إجراءات التشغيل وتحضير السيارة
          </h4>

          {/* 1. Select specific physical vehicle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300">١. تخصيص سيارة فيزيائية من الأسطول (رقم اللوحة):</label>
            <select
              className="w-full rounded-xl border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2.5 text-xs outline-none focus:border-orange-500"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
            >
              <option value="">-- اضغط لتخصيص سيارة --</option>
              {availableCars.map(c => (
                <option key={c.id} value={c.id}>
                  {c.plateNumber} (مسافة: {c.mileage} كم) - {c.color}
                </option>
              ))}
            </select>
            {availableCars.length === 0 && (
              <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>تحذير: لا تتوفر أي سيارة مادية شاغرة حالياً من هذا الموديل في فرع الاستلام!</span>
              </p>
            )}
          </div>

          {/* 2. Toggle Payment Status */}
          <div className="flex flex-col gap-2 pt-1 border-t border-gray-150 dark:border-gray-800">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300">٢. حالة التحصيل المالي للفاتورة:</label>
            <div className="flex gap-4 text-xs font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={paymentStatus === 'paid'} onChange={() => setPaymentStatus('paid')} className="text-orange-600 focus:ring-orange-500/10" />
                <span className="text-emerald-600">مدفوع ومحصل بالفرع</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={paymentStatus === 'unpaid'} onChange={() => setPaymentStatus('unpaid')} className="text-orange-600 focus:ring-orange-500/10" />
                <span className="text-red-500">غير مدفوع / مؤجل عند الاستلام</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-150 dark:border-gray-800">
            {booking.status === 'pending' && (
              <>
                <Button variant="primary" size="sm" loading={loading} onClick={() => handleAction('approved')} className="flex-1">
                  تأكيد وقبول الحجز وتسليم السيارة
                </Button>
                <Button variant="danger" size="sm" loading={loading} onClick={() => handleAction('rejected')} className="bg-red-50 text-red-600 hover:bg-red-100 border border-transparent shadow-none dark:bg-red-950/20 dark:text-red-400">
                  رفض الحجز
                </Button>
              </>
            )}
            {booking.status === 'approved' && (
              <Button variant="primary" size="sm" loading={loading} onClick={() => handleAction('completed')} className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 text-white font-bold">
                تحويل لـ مكتمل (بعد تسليم العميل السيارة واسترجاعها بأمان)
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Readonly Invoice Summary */
        <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50/40 text-center space-y-1">
          <span className="text-xs text-gray-400 block font-medium">الفاتورة الإجمالية المحصلة:</span>
          <span className="text-2xl font-black text-orange-600 dark:text-orange-500 font-mono">{booking.totalPrice} ريال</span>
          <p className="text-[10px] text-gray-500 mt-2">
            تمت تسوية الفاتورة كـ <span className="font-bold underline text-emerald-600">{booking.paymentStatus === 'paid' ? 'مسددة' : 'غير مسددة'}</span>. تم أرشفة العملية بنجاح.
          </p>
        </div>
      )}
    </div>
  );
};
export default BookingDetailsModal;
