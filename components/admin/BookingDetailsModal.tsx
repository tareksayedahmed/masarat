import React, { useState, useEffect, useMemo } from 'react';
import { Booking, FullCarDetails } from '../../types';
import { CARS, USERS, CAR_MODELS } from '../../constants';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSave: (booking: Booking) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ isOpen, onClose, booking, onSave }) => {
  const [editedBooking, setEditedBooking] = useState<Booking>(booking);
  
  const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);
  const carsMap = useMemo(() => new Map(CARS.map(c => [c.id, c])), []);

  const carDetails: FullCarDetails | null = useMemo(() => {
    const car = carsMap.get(booking.carId);
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
  }, [booking.carId, carsMap, carModelsMap]);


  useEffect(() => {
    setEditedBooking(booking);
  }, [booking]);
  
  const customer = USERS.find(u => u.id === booking.userId);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedBooking({ ...editedBooking, status: e.target.value as Booking['status'] });
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedBooking({ ...editedBooking, notes: e.target.value });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = parseFloat(e.target.value) || 0;
    setEditedBooking({ 
        ...editedBooking, 
        priceBreakdown: { ...editedBooking.priceBreakdown, total: newTotal }
    });
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedBooking({
        ...editedBooking,
        contact: {
            ...editedBooking.contact,
            [name]: value
        }
    });
  };
  
  const formatForDateTimeInput = (isoString: string): string => {
    if (!isoString) return '';
    return isoString.slice(0, 16);
  };

  const handleDateOrDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newBookingState = { ...editedBooking };

    if (name === 'startDate' || name === 'endDate') {
        newBookingState = { ...newBookingState, [name]: new Date(value).toISOString() };
        const start = new Date(newBookingState.startDate);
        const end = new Date(newBookingState.endDate);
        if (end > start) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            newBookingState.days = diffDays > 0 ? diffDays : 1;
        }
    } else if (name === 'days') {
        const newDays = parseInt(value, 10) || 1;
        if (newDays > 0) {
            const start = new Date(newBookingState.startDate);
            const newEndDate = new Date(start.getTime() + newDays * 24 * 60 * 60 * 1000);
            newBookingState.days = newDays;
            newBookingState.endDate = newEndDate.toISOString();
        }
    }

    setEditedBooking(newBookingState);
  };

  const handleSave = () => {
    onSave(editedBooking);
  };
  
  const deliveryText = {
    branch: 'استلام وتسليم من الفرع',
    delivery: 'توصيل السيارة فقط',
    delivery_pickup: 'توصيل واستلام السيارة'
  }[booking.deliveryOption];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`تفاصيل الحجز #${booking.bookingNumber}`}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <h4 className="font-bold">العميل</h4>
                <p>{customer?.name} ({customer?.email})</p>
            </div>
             <div>
                <h4 className="font-bold">بيانات التواصل</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <Input 
                        label="الجوال الرئيسي" 
                        type="tel" 
                        name="phone1"
                        value={editedBooking.contact.phone1}
                        onChange={handleContactChange}
                    />
                    <Input 
                        label="جوال إضافي" 
                        type="tel" 
                        name="phone2"
                        value={editedBooking.contact.phone2 || ''}
                        onChange={handleContactChange}
                    />
                </div>
                <div className="mt-2">
                    <Input 
                        label="العنوان" 
                        type="text" 
                        name="address"
                        value={editedBooking.contact.address}
                        onChange={handleContactChange}
                    />
                </div>
            </div>
            <div>
                <h4 className="font-bold">السيارة</h4>
                <p>{carDetails?.make} {carDetails?.model} ({carDetails?.year})</p>
            </div>
            <div>
                <h4 className="font-bold">التواريخ</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <Input 
                        label="من" 
                        type="datetime-local" 
                        name="startDate"
                        value={formatForDateTimeInput(editedBooking.startDate)}
                        onChange={handleDateOrDaysChange}
                    />
                    <Input 
                        label="إلى" 
                        type="datetime-local" 
                        name="endDate"
                        value={formatForDateTimeInput(editedBooking.endDate)}
                        onChange={handleDateOrDaysChange}
                    />
                </div>
                <div className="mt-4">
                     <Input 
                        label="عدد الأيام" 
                        type="number" 
                        name="days"
                        min="1"
                        value={editedBooking.days}
                        onChange={handleDateOrDaysChange}
                    />
                </div>
            </div>
            <div>
                <h4 className="font-bold">التوصيل والاستلام</h4>
                <p>{deliveryText}</p>
                {booking.deliveryOption !== 'branch' && (
                    <div className="text-sm text-gray-600 mt-1">
                        <p><strong>الموقع:</strong> {booking.deliveryLocation?.address}</p>
                        <p><strong>رسوم الخدمة:</strong> {booking.priceBreakdown.delivery} ريال</p>
                    </div>
                )}
            </div>
             <div>
                <h4 className="font-bold">خيارات الحجز</h4>
                <ul className="list-disc list-inside text-sm">
                    {booking.options.insurance && <li>تأمين شامل</li>}
                    {booking.options.extra_driver && <li>سائق إضافي</li>}
                    {booking.options.child_seat && <li>كرسي أطفال</li>}
                    {booking.options.internationalPermit && <li>تفويض دولي</li>}
                </ul>
             </div>
             <div>
                <h4 className="font-bold">الوثائق</h4>
                 <div className="flex space-x-4 rtl:space-x-reverse text-sm mt-1">
                    {booking.documents.license ? (
                        <a href={booking.documents.license} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">عرض الرخصة</a>
                    ) : (
                        <span className="text-gray-500">لا توجد رخصة</span>
                    )}
                    {booking.documents.id_card ? (
                        <a href={booking.documents.id_card} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">عرض الهوية</a>
                    ) : (
                        <span className="text-gray-500">لا توجد هوية</span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">تاريخ انتهاء الرخصة: {new Date(booking.documents.licenseExpiry).toLocaleDateString('ar-SA')}</p>
            </div>
            <hr />
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="تعديل السعر الإجمالي" 
                    type="number" 
                    value={editedBooking.priceBreakdown.total}
                    onChange={handlePriceChange}
                />
                <Select label="تغيير حالة الحجز" value={editedBooking.status} onChange={handleStatusChange}>
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="active">جاري الإيجار</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                </Select>
            </div>
             <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">ملاحظات (سبب الإلغاء)</label>
                <textarea 
                    id="notes" 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={editedBooking.notes || ''}
                    onChange={handleNotesChange}
                ></textarea>
             </div>

            <div className="flex justify-end space-i-2 pt-4">
                <Button variant="secondary" onClick={onClose}>إغلاق</Button>
                <Button onClick={handleSave}>حفظ التغييرات</Button>
            </div>
        </div>
    </Modal>
  );
};

export default BookingDetailsModal;