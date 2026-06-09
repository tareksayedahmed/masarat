import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import L from 'leaflet';
import { FullCarDetails, Booking, Branch, BookingPriceBreakdown } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../auth/AuthForm';
import { useBookings } from '../../context/BookingContext';
import api from '../../api';
import Checkbox from '../ui/Checkbox';
import RadioGroup from '../ui/RadioGroup';

interface BookingFormProps {
  car: FullCarDetails;
  onClose: () => void;
  onSave: (data: Omit<Booking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>, existingBookingId?: string) => void;
  existingBooking?: Booking | null;
}

const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            options.push(`${hour}:${minute}`);
        }
    }
    return options;
};

const getInitialDateTime = () => {
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    minBookingTime.setMilliseconds(0);
    minBookingTime.setSeconds(0);
    const minutes = minBookingTime.getMinutes();
    if (minutes < 30) minBookingTime.setMinutes(30); else { minBookingTime.setMinutes(0); minBookingTime.setHours(minBookingTime.getHours() + 1); }
    const startDate = new Date(minBookingTime);
    const endDate = new Date(minBookingTime);
    endDate.setDate(endDate.getDate() + 1);
    const format = (d: Date) => ({ dateStr: d.toISOString().split('T')[0], timeStr: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` });
    const start = format(startDate);
    const end = format(endDate);
    return { startDate: start.dateStr, startTime: start.timeStr, endDate: end.dateStr, endTime: end.timeStr };
};

const STEPS = [
    { id: 1, name: 'التاريخ والوقت' },
    { id: 2, name: 'الإضافات' },
    { id: 3, name: 'الاستلام والتسليم' },
    { id: 4, name: 'البيانات والمستندات' },
    { id: 5, name: 'الدفع والمراجعة' }
];

const BookingForm: React.FC<BookingFormProps> = ({ car, onClose, onSave, existingBooking = null }) => {
  const { user } = useAuth();
  const { calculatePrice } = useBookings();
  const [mainStep, setMainStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'stc_pay' | 'apple_pay'>(existingBooking?.paymentMethod || 'card');

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [days, setDays] = useState(1);
  const [dateError, setDateError] = useState('');
  
  const [options, setOptions] = useState({ insurance: false, extra_driver: false, open_km: false, child_seat: false, internationalPermit: false });
  const [documents, setDocuments] = useState<{ license: string | null, id_card: string | null, licenseExpiry: string }>({ license: null, id_card: null, licenseExpiry: '' });
  const [contact, setContact] = useState({ phone1: '', phone2: '', address: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const timeOptions = useMemo(() => generateTimeOptions(), []);
  
  const [deliveryOption, setDeliveryOption] = useState<'branch' | 'delivery' | 'delivery_pickup'>('branch');
  const [deliveryLocation, setDeliveryLocation] = useState<{lat: number, lng: number} | null>(null);
  const [deliveryError, setDeliveryError] = useState('');
  
  const [priceBreakdown, setPriceBreakdown] = useState<BookingPriceBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [branchData, setBranchData] = useState<Branch | null>(null);

  useEffect(() => {
      const fetchBranch = async () => {
          try {
              const res = await api.get('/data/branches');
              const foundBranch = res.data.find((b: Branch) => b.id === car.branchId);
              setBranchData(foundBranch || null);
          } catch (error) {
              console.error("Failed to fetch branch data", error);
          }
      };
      fetchBranch();
  }, [car.branchId]);
  
  useEffect(() => {
    if (existingBooking) {
        const start = new Date(existingBooking.startDate);
        const end = new Date(existingBooking.endDate);
        const format = (d: Date) => ({ dateStr: d.toISOString().split('T')[0], timeStr: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` });
        setStartDate(format(start).dateStr);
        setStartTime(format(start).timeStr);
        setEndDate(format(end).dateStr);
        setEndTime(format(end).timeStr);
        setOptions(existingBooking.options);
        setDocuments(existingBooking.documents);
        setContact(existingBooking.contact);
        setDeliveryOption(existingBooking.deliveryOption);
        setPaymentMethod(existingBooking.paymentMethod);
        if (existingBooking.deliveryLocation) setDeliveryLocation({ lat: existingBooking.deliveryLocation.lat, lng: existingBooking.deliveryLocation.lng });
    } else {
        const initialDateTime = getInitialDateTime();
        setStartDate(initialDateTime.startDate); setStartTime(initialDateTime.startTime); setEndDate(initialDateTime.endDate); setEndTime(initialDateTime.endTime);
        setOptions({ insurance: false, extra_driver: false, open_km: false, child_seat: false, internationalPermit: false });
        setDocuments({ license: null, id_card: null, licenseExpiry: '' });
        setContact({ phone1: '', phone2: '', address: '' });
        setDeliveryOption('branch'); setPaymentMethod('card'); setDeliveryLocation(null);
    }
  }, [existingBooking]);

  const updatePrice = useCallback(async () => {
    if (!startDate || !endDate || !startTime || !endTime) return;
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    if (end <= start) return;

    setIsCalculating(true);
    try {
        const payload = {
            carId: car.id,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            options,
            deliveryOption,
            deliveryLocation,
        };
        const priceData = await calculatePrice(payload);
        setPriceBreakdown(priceData.priceBreakdown);
        setDays(priceData.days);
        setDeliveryError(priceData.deliveryError || '');
    } catch (error) {
        console.error("Price calculation failed", error);
        setPriceBreakdown(null);
    } finally {
        setIsCalculating(false);
    }
  }, [startDate, startTime, endDate, endTime, options, deliveryOption, deliveryLocation, car.id, calculatePrice]);

  useEffect(() => {
    const handler = setTimeout(() => {
        updatePrice();
    }, 500); // Debounce price calculation
    return () => clearTimeout(handler);
  }, [updatePrice]);

  useEffect(() => {
    if (mainStep === 3 && deliveryOption !== 'branch' && mapContainerRef.current && branchData?.lat && branchData.lng) {
        if (!mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([branchData.lat, branchData.lng], 13);
            mapRef.current = map;
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
            L.marker([branchData.lat, branchData.lng]).addTo(map).bindPopup(`<b>فرع ${branchData.name}</b>`);
            map.on('click', (e) => setDeliveryLocation({ lat: e.latlng.lat, lng: e.latlng.lng }));
        }
    } else {
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null; }
    }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null; } };
  }, [mainStep, deliveryOption, branchData]);

  useEffect(() => {
    if (mapRef.current && deliveryLocation) {
        if (markerRef.current) markerRef.current.setLatLng(deliveryLocation);
        else {
            markerRef.current = L.marker(deliveryLocation, { draggable: true }).addTo(mapRef.current);
            markerRef.current.on('dragend', (e) => setDeliveryLocation({ lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng }));
        }
    }
  }, [deliveryLocation]);
  
  useEffect(() => {
    if (!startDate || !endDate || !startTime || !endTime) { setDateError(''); setDays(0); return; }
    const start = new Date(`${startDate}T${startTime}`); const end = new Date(`${endDate}T${endTime}`);
    const minTime = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    if (start < minTime) { setDateError('وقت الاستلام يجب أن يكون بعد ساعتين على الأقل من الآن.'); setDays(0); return; }
    if (end <= start) { setDateError('وقت التسليم يجب أن يكون بعد وقت الاستلام.'); setDays(0); return; }
    setDateError('');
  }, [startDate, startTime, endDate, endTime]);
  
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setOptions({ ...options, [e.target.name]: e.target.checked });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setDocuments({ ...documents, [name]: reader.result as string });
      reader.readAsDataURL(files[0]);
    }
  };
  const handleDocsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setDocuments({ ...documents, [e.target.name]: e.target.value });
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => setContact({ ...contact, [e.target.name]: e.target.value });

  const validateStep = () => {
    setErrors({});
    let isValid = true;
    if (mainStep === 1 && !!dateError) {
        setDateError('الرجاء إدخال تواريخ صحيحة.');
        isValid = false;
    }
    if (mainStep === 3 && deliveryOption !== 'branch' && (!deliveryLocation || !!deliveryError)) {
        setDeliveryError(deliveryError || 'الرجاء تحديد موقع التوصيل.');
        isValid = false;
    }
    if (mainStep === 4) {
        if (!documents.licenseExpiry) { setErrors(prev => ({ ...prev, licenseExpiry: 'تاريخ انتهاء الرخصة مطلوب' })); isValid = false; }
        if (!contact.phone1) { setErrors(prev => ({ ...prev, phone1: 'رقم الجوال الأساسي مطلوب' })); isValid = false; }
        if (!contact.address) { setErrors(prev => ({ ...prev, address: 'العنوان مطلوب' })); isValid = false; }
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
        setMainStep(s => Math.min(s + 1, STEPS.length));
    }
  };
  const handlePrev = () => setMainStep(s => Math.max(s - 1, 1));

  const handleSaveClick = () => {
    if (!user || !priceBreakdown || !validateStep()) return;
    const bookingData = {
        carId: car.id, userId: user.id, branchId: car.branchId,
        startDate: new Date(`${startDate}T${startTime}`).toISOString(),
        endDate: new Date(`${endDate}T${endTime}`).toISOString(),
        days, options, priceBreakdown, documents, contact, deliveryOption, paymentMethod,
        deliveryLocation: deliveryOption !== 'branch' && deliveryLocation ? { ...deliveryLocation, address: 'الموقع المحدد على الخريطة' } : undefined,
    };
    onSave(bookingData, existingBooking?.id);
  };

  const Stepper = () => (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {STEPS.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== STEPS.length - 1 ? 'flex-1' : ''}`}>
            {step.id < mainStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-orange-600" />
                </div>
                <button
                  onClick={() => setMainStep(step.id)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 hover:bg-orange-900"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">{step.name}</span>
                </button>
              </>
            ) : step.id === mainStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-600 bg-white dark:bg-gray-800" aria-current="step">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-600" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  const renderMainStepContent = () => {
    switch (mainStep) {
        case 1: // Dates
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">اختر مدة الإيجار</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="تاريخ الاستلام" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                        <Select label="وقت الاستلام" value={startTime} onChange={e => setStartTime(e.target.value)}>{timeOptions.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                        <Input label="تاريخ التسليم" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
                        <Select label="وقت التسليم" value={endTime} onChange={e => setEndTime(e.target.value)}>{timeOptions.map(t => <option key={t} value={t}>{t}</option>)}</Select>
                    </div>
                    {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
                </div>
            );
        case 2: // Options
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">اختر الإضافات</h3>
                    <Checkbox id="insurance" name="insurance" label="تأمين شامل" description="تغطية كاملة ضد الحوادث والسرقة (50 ريال/يوم)." checked={options.insurance} onChange={handleOptionChange} />
                    <Checkbox id="extra_driver" name="extra_driver" label="سائق إضافي" description="إضافة سائق آخر على العقد (50 ريال)." checked={options.extra_driver} onChange={handleOptionChange} />
                    <Checkbox id="child_seat" name="child_seat" label="كرسي أطفال" description="مقعد آمن للأطفال (30 ريال)." checked={options.child_seat} onChange={handleOptionChange} />
                    <Checkbox id="internationalPermit" name="internationalPermit" label="تصريح سفر دولي" description="تصريح للسفر خارج المملكة (100 ريال)." checked={options.internationalPermit} onChange={handleOptionChange} />
                </div>
            );
        case 3: // Delivery
            return (
                <div className="space-y-4">
                     <h3 className="text-xl font-bold">اختر طريقة الاستلام والتسليم</h3>
                    <RadioGroup name="deliveryOption" selectedValue={deliveryOption} onChange={(val) => setDeliveryOption(val as any)} options={[
                        { value: 'branch', label: 'استلام وتسليم من الفرع', description: 'بدون رسوم إضافية.' },
                        { value: 'delivery', label: 'توصيل السيارة فقط', description: 'سيتم احتساب رسوم توصيل.' },
                        { value: 'delivery_pickup', label: 'توصيل واستلام السيارة', description: 'سيتم احتساب رسوم للتوصيل والاستلام.' },
                    ]}/>
                    {deliveryOption !== 'branch' && (
                        <div className="mt-4">
                             <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">الرجاء تحديد موقع {deliveryOption === 'delivery' ? 'التوصيل' : 'التوصيل والاستلام'} على الخريطة. (نطاق الخدمة 40 كم من الفرع)</p>
                            <div ref={mapContainerRef} className="h-64 w-full rounded-lg bg-gray-200 dark:bg-gray-700 z-0"></div>
                            {deliveryError && <p className="text-red-500 text-sm mt-2">{deliveryError}</p>}
                        </div>
                    )}
                </div>
            )
        case 4: // Documents & Contact
             return (
                <div className="space-y-4">
                     <h3 className="text-xl font-bold">بيانات التواصل والمستندات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="رقم الجوال الأساسي" name="phone1" value={contact.phone1} onChange={handleContactChange} required error={errors.phone1} />
                        <Input label="رقم جوال إضافي" name="phone2" value={contact.phone2} onChange={handleContactChange} />
                    </div>
                    <Input label="العنوان" name="address" value={contact.address} onChange={handleContactChange} required error={errors.address} />
                    <hr className="dark:border-gray-700"/>
                    <Input label="تاريخ انتهاء الرخصة" name="licenseExpiry" type="date" value={documents.licenseExpiry} onChange={handleDocsInputChange} required error={errors.licenseExpiry} />
                    <p className="text-xs text-gray-500">سيتم طلب صور المستندات (الرخصة، الهوية) عند تأكيد الحجز.</p>
                </div>
            );
        case 5: // Payment & Review
            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">اختر طريقة الدفع</h3>
                    <RadioGroup name="paymentMethod" selectedValue={paymentMethod} onChange={(val) => setPaymentMethod(val as any)} options={[
                        { value: 'card', label: 'بطاقة ائتمانية / مدى'},
                        { value: 'apple_pay', label: 'Apple Pay' },
                        { value: 'stc_pay', label: 'STC Pay' },
                        { value: 'cash', label: 'الدفع نقداً في الفرع' },
                    ]}/>
                </div>
            );
        default: return null;
    }
  };

  if (!user) return <AuthForm onSuccess={() => {}} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8">
      <div className="lg:col-span-2 order-last lg:order-first mt-8 lg:mt-0">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sticky top-6 space-y-4 border dark:border-gray-700">
          <div className="flex items-center gap-4 pb-4 border-b dark:border-gray-700">
            <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{car.make} {car.model}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{car.category} - {car.year}</p>
            </div>
          </div>
          {isCalculating && <div className="text-center p-4">جاري حساب السعر...</div>}
          {priceBreakdown && !isCalculating && (
            <div className="space-y-2 text-sm">
              <h4 className="font-bold text-base mb-2 text-gray-900 dark:text-gray-100">ملخص السعر</h4>
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>السعر الأساسي ({days} يوم)</span> <span>{priceBreakdown.base.toFixed(2)} ريال</span></div>
              {priceBreakdown.insurance > 0 && <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>تأمين شامل</span> <span>{priceBreakdown.insurance.toFixed(2)} ريال</span></div>}
              {priceBreakdown.extras > 0 && <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>إضافات أخرى</span> <span>{priceBreakdown.extras.toFixed(2)} ريال</span></div>}
              {priceBreakdown.delivery > 0 && <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>رسوم التوصيل</span> <span>{priceBreakdown.delivery.toFixed(2)} ريال</span></div>}
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>ضريبة القيمة المضافة (15%)</span> <span>{priceBreakdown.tax.toFixed(2)} ريال</span></div>
              <hr className="my-2 dark:border-gray-700"/>
              <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-gray-100 pt-2"><span>الإجمالي</span> <span>{priceBreakdown.total.toFixed(2)} ريال</span></div>
            </div>
          )}
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="mb-8"> <Stepper /> </div>
        <div className="p-6 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[300px]"> 
            {renderMainStepContent()} 
        </div>
        <div className="mt-6 flex justify-between">
            {mainStep > 1 && <Button variant="secondary" onClick={handlePrev}>السابق</Button>}
            {mainStep < STEPS.length && <Button onClick={handleNext}>التالي</Button>}
            {mainStep === STEPS.length && <Button onClick={handleSaveClick} disabled={!priceBreakdown || isCalculating}>{existingBooking ? 'حفظ التعديلات' : 'تأكيد الحجز'}</Button>}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;