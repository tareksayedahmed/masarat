

import React, { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { FullCarDetails, Booking } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../auth/AuthForm';
import { BRANCHES } from '../../constants';

interface BookingFormProps {
  car: FullCarDetails;
  onClose: () => void;
  onConfirm: (data: Omit<Booking, 'id' | 'bookingNumber' | 'status'>) => void;
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
    now.setMilliseconds(0);
    now.setSeconds(0);
    const minutes = now.getMinutes();
    if (minutes < 30) {
        now.setMinutes(30);
    } else {
        now.setMinutes(0);
        now.setHours(now.getHours() + 1);
    }

    const startDate = new Date(now);
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 1);

    const formatForInput = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return { dateStr, timeStr };
    };
    
    const start = formatForInput(startDate);
    const end = formatForInput(endDate);

    return {
        startDate: start.dateStr,
        startTime: start.timeStr,
        endDate: end.dateStr,
        endTime: end.timeStr
    };
};

const BookingForm: React.FC<BookingFormProps> = ({ car, onClose, onConfirm }) => {
  const { user } = useAuth();
  const [mainStep, setMainStep] = useState(1);

  const initialDateTime = getInitialDateTime();
  const [startDate, setStartDate] = useState(initialDateTime.startDate);
  const [startTime, setStartTime] = useState(initialDateTime.startTime);
  const [endDate, setEndDate] = useState(initialDateTime.endDate);
  const [endTime, setEndTime] = useState(initialDateTime.endTime);

  const [days, setDays] = useState(1);
  const [dateError, setDateError] = useState('');
  
  const [options, setOptions] = useState({
    insurance: false,
    extra_driver: false,
    open_km: false,
    child_seat: false,
    internationalPermit: false,
  });
  
  const [documents, setDocuments] = useState<{ license: string | null, id_card: string | null, licenseExpiry: string }>({ license: null, id_card: null, licenseExpiry: '' });
  const [contact, setContact] = useState({ phone1: '', phone2: '', address: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const timeOptions = useMemo(() => generateTimeOptions(), []);
  
  const [deliveryOption, setDeliveryOption] = useState<'branch' | 'delivery' | 'delivery_pickup'>('branch');
  const [deliveryLocation, setDeliveryLocation] = useState<{lat: number, lng: number} | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [deliveryError, setDeliveryError] = useState('');
  
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startDate || !endDate || !startTime || !endTime) {
        setDateError('');
        setDays(0);
        return;
    }
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const now = new Date();
    now.setMinutes(now.getMinutes() - 1); 

    if (startDateTime < now) {
        setDateError('وقت الاستلام لا يمكن أن يكون في الماضي.');
        setDays(0);
        return;
    }

    if (endDateTime <= startDateTime) {
        setDateError('وقت التسليم يجب أن يكون بعد وقت الاستلام.');
        setDays(0);
        return;
    }
    
    setDateError('');

    const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDays(diffDays > 0 ? diffDays : 1);

  }, [startDate, startTime, endDate, endTime]);
  
  useEffect(() => {
    if (mainStep === 5 && deliveryOption !== 'branch' && mapContainerRef.current && !mapRef.current) {
        const branch = BRANCHES.find(b => b.id === car.branchId);
        if (!branch || !branch.lat || !branch.lng) return;

        const map = L.map(mapContainerRef.current).setView([branch.lat, branch.lng], 13);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        L.marker([branch.lat, branch.lng]).addTo(map).bindPopup(`<b>فرع ${branch.name}</b>`);

        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            setDeliveryLocation({ lat, lng });
            if (markerRef.current) {
                markerRef.current.setLatLng(e.latlng);
            } else {
                markerRef.current = L.marker(e.latlng, { draggable: true }).addTo(map);
                markerRef.current.on('dragend', (event) => {
                    const position = event.target.getLatLng();
                    setDeliveryLocation({ lat: position.lat, lng: position.lng });
                });
            }
        });

        if (deliveryLocation) {
             markerRef.current = L.marker(deliveryLocation, { draggable: true }).addTo(map);
             markerRef.current.on('dragend', (event) => {
                const position = event.target.getLatLng();
                setDeliveryLocation({ lat: position.lat, lng: position.lng });
            });
        }
    }
  }, [mainStep, deliveryOption, car.branchId, deliveryLocation]);
  
  useEffect(() => {
    const branch = BRANCHES.find(b => b.id === car.branchId);
    if (!deliveryLocation || !branch || !branch.lat || !branch.lng) {
        setDistance(null);
        setDeliveryFee(0);
        setDeliveryError('');
        return;
    }

    const branchLatLng = L.latLng(branch.lat, branch.lng);
    const deliveryLatLng = L.latLng(deliveryLocation.lat, deliveryLocation.lng);
    const distMeters = branchLatLng.distanceTo(deliveryLatLng);
    const distKm = distMeters / 1000;
    setDistance(distKm);

    if (distKm > 40) {
        setDeliveryError('الموقع المحدد خارج نطاق خدمة التوصيل (40 كم).');
        setDeliveryFee(0);
    } else {
        setDeliveryError('');
        const feePerTrip = distKm <= 20 ? 15 : distKm <= 30 ? 20 : 25;
        let totalFee = 0;
        if (deliveryOption === 'delivery') {
            totalFee = feePerTrip;
        } else if (deliveryOption === 'delivery_pickup') {
            totalFee = feePerTrip * 2;
        }
        setDeliveryFee(totalFee);
    }
  }, [deliveryLocation, deliveryOption, car.branchId]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments({ ...documents, [name]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDocsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setDocuments({ ...documents, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // FIX: The `priceBreakdown` object was missing the `insurance` property.
  // Separated insurance cost from extras to match the `Booking` type definition.
  const price = useMemo(() => {
    const base = days > 0 ? car.daily_price * days : 0;
    const insuranceCost = options.insurance ? (50 * days) : 0;
    let extrasTotal = 0;
    if (options.extra_driver) extrasTotal += 50;
    if (options.child_seat) extrasTotal += 30;
    if (options.internationalPermit) extrasTotal += 100;
    
    const subtotal = base + insuranceCost + extrasTotal + deliveryFee;
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    return { base, insurance: insuranceCost, extras: extrasTotal, delivery: deliveryFee, tax, total };
  }, [car.daily_price, days, options, deliveryFee]);

 const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!contact.phone1.trim()) newErrors.contact = 'رقم الجوال الأساسي مطلوب.';
    if (!contact.address.trim()) newErrors.contact = 'العنوان مطلوب.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!documents.licenseExpiry) {
        newErrors.documents = 'تاريخ انتهاء الرخصة مطلوب.';
    } else if (new Date(documents.licenseExpiry) < new Date()) {
        newErrors.documents = 'الرخصة منتهية الصلاحية.';
    }
    if (!documents.license) newErrors.documents = 'الرجاء إرفاق صورة الرخصة.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!documents.id_card) newErrors.id_card = 'الرجاء إرفاق صورة الهوية.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    if (mainStep === 1 && !validateStep1()) return;
    if (mainStep === 2 && !validateStep2()) return;
    if (mainStep === 3 && !validateStep3()) return;
    if (mainStep === 4 && (!!dateError || days === 0)) {
        setDateError('الرجاء إدخال تواريخ صحيحة.');
        return;
    }
    if (mainStep === 5 && deliveryOption !== 'branch' && (!deliveryLocation || !!deliveryError)) {
        setDeliveryError(deliveryError || 'الرجاء تحديد موقع التوصيل على الخريطة.');
        return;
    }
    setMainStep(s => Math.min(s + 1, 7));
  };
  const handlePrev = () => setMainStep(s => Math.max(s - 1, 1));

  const handleConfirmClick = () => {
    if (!user) return;
    const bookingData = {
        carId: car.id,
        userId: user.id,
        branchId: car.branchId,
        startDate: new Date(`${startDate}T${startTime}`).toISOString(),
        endDate: new Date(`${endDate}T${endTime}`).toISOString(),
        days,
        options,
        priceBreakdown: price,
        documents,
        contact,
        deliveryOption,
        deliveryLocation: deliveryOption !== 'branch' && deliveryLocation ? { ...deliveryLocation, address: 'الموقع المحدد على الخريطة' } : undefined,
    };
    onConfirm(bookingData);
  };

  const Stepper = () => {
    const steps = [
        { number: 1, title: 'التواصل' },
        { number: 2, title: 'الرخصة' },
        { number: 3, title: 'الهوية' },
        { number: 4, title: 'التواريخ' },
        { number: 5, title: 'التوصيل' },
        { number: 6, title: 'الإضافات' },
        { number: 7, title: 'التأكيد' },
    ];
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.title} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                       {mainStep > step.number ? (
                            <div className="flex items-center">
                                <span className="flex h-9 items-center">
                                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600">
                                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
                                    </span>
                                </span>
                                {stepIdx !== steps.length - 1 && <div className="absolute top-4 right-0 -mr-px h-0.5 w-full bg-orange-600" />}
                            </div>
                        ) : mainStep === step.number ? (
                             <div className="flex items-center" aria-current="step">
                                <span className="flex h-9 items-center">
                                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-600 bg-white">
                                        <span className="h-2.5 w-2.5 rounded-full bg-orange-600" />
                                    </span>
                                </span>
                                {stepIdx !== steps.length - 1 && <div className="absolute top-4 right-0 -mr-px h-0.5 w-full bg-gray-200" />}
                            </div>
                        ) : (
                             <div className="flex items-center">
                                <span className="flex h-9 items-center">
                                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white" />
                                </span>
                                {stepIdx !== steps.length - 1 && <div className="absolute top-4 right-0 -mr-px h-0.5 w-full bg-gray-200" />}
                            </div>
                        )}
                        <span className="absolute top-10 text-center w-full text-xs font-medium text-gray-500">{step.title}</span>
                    </li>
                ))}
            </ol>
        </nav>
    );
  };

  const renderMainStepContent = () => {
    switch (mainStep) {
      case 1:
        return (
            <div>
                <h4 className="font-bold text-lg mb-4 border-b pb-2">1. بيانات التواصل</h4>
                <div className="space-y-4">
                    <Input label="رقم الجوال الأساسي" type="tel" name="phone1" value={contact.phone1} onChange={handleContactChange} required placeholder="05xxxxxxxx" />
                    <Input label="رقم جوال إضافي (اختياري)" type="tel" name="phone2" value={contact.phone2 || ''} onChange={handleContactChange} placeholder="05xxxxxxxx" />
                    <Input label="العنوان" type="text" name="address" value={contact.address} onChange={handleContactChange} required placeholder="المدينة, الحي, الشارع" />
                </div>
                {errors.contact && <p className="text-red-500 text-sm mt-2">{errors.contact}</p>}
                <div className="mt-6 pt-4 border-t flex justify-end"> <Button onClick={handleNext}>التالي</Button> </div>
            </div>
        );
      case 2:
        return (
            <div>
                <h4 className="font-bold text-lg mb-4 border-b pb-2">2. رخصة القيادة</h4>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">صورة الرخصة (سارية المفعول)</label>
                        <input id="license" name="license" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                        {documents.license && <p className="text-xs text-gray-500 mt-1">تم اختيار الملف.</p>}
                    </div>
                    <Input label="تاريخ انتهاء الرخصة" type="date" name="licenseExpiry" value={documents.licenseExpiry} onChange={handleDocsInputChange} required />
                </div>
                {errors.documents && <p className="text-red-500 text-sm mt-2">{errors.documents}</p>}
                <div className="mt-6 pt-4 border-t flex justify-between"> <Button onClick={handlePrev} variant="secondary">السابق</Button> <Button onClick={handleNext}>التالي</Button> </div>
            </div>
        );
      case 3:
        return (
             <div>
                <h4 className="font-bold text-lg mb-4 border-b pb-2">3. وثيقة إثبات الهوية</h4>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="id_card" className="block text-sm font-medium text-gray-700 mb-1">صورة الهوية الوطنية أو الإقامة</label>
                        <input id="id_card" name="id_card" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
                        {documents.id_card && <p className="text-xs text-gray-500 mt-1">تم اختيار الملف.</p>}
                    </div>
                </div>
                {errors.id_card && <p className="text-red-500 text-sm mt-2">{errors.id_card}</p>}
                <div className="mt-6 pt-4 border-t flex justify-between"> <Button onClick={handlePrev} variant="secondary">السابق</Button> <Button onClick={handleNext}>التالي</Button> </div>
            </div>
        );
      case 4:
        return (
            <div>
                <h4 className="font-bold text-lg mb-4 border-b pb-2">4. مدة الإيجار</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    <Input label="تاريخ الاستلام" type="date" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setStartDate(e.target.value)} />
                    <Select label="وقت الاستلام" id="start-time" value={startTime} onChange={e => setStartTime(e.target.value)}> {timeOptions.map(time => <option key={`start-${time}`} value={time}>{time}</option>)} </Select>
                    <Input label="تاريخ التسليم" type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} />
                    <Select label="وقت التسليم" id="end-time" value={endTime} onChange={e => setEndTime(e.target.value)}> {timeOptions.map(time => <option key={`end-${time}`} value={time}>{time}</option>)} </Select>
                </div>
                {dateError && (<p className="text-red-500 text-sm my-4">{dateError}</p>)}
                <div className="mt-6 pt-4 border-t flex justify-between"> <Button onClick={handlePrev} variant="secondary">السابق</Button> <Button onClick={handleNext} disabled={!!dateError || days === 0}>التالي</Button> </div>
            </div>
        );
      case 5:
        return (
            <div>
                <h4 className="font-bold text-lg mb-4 border-b pb-2">5. التوصيل والاستلام</h4>
                <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer"><input type="radio" name="deliveryOption" value="branch" checked={deliveryOption === 'branch'} onChange={() => setDeliveryOption('branch')} className="ms-2" /> استلام وتسليم السيارة من الفرع</label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer"><input type="radio" name="deliveryOption" value="delivery" checked={deliveryOption === 'delivery'} onChange={() => setDeliveryOption('delivery')} className="ms-2" /> توصيل السيارة إلى موقعي فقط</label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer"><input type="radio" name="deliveryOption" value="delivery_pickup" checked={deliveryOption === 'delivery_pickup'} onChange={() => setDeliveryOption('delivery_pickup')} className="ms-2" /> توصيل واستلام السيارة من موقعي</label>
                </div>
                {deliveryOption !== 'branch' && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm text-gray-600">الرجاء تحديد موقعك على الخريطة (نطاق التوصيل 40 كم).</p>
                        <div ref={mapContainerRef} className="h-64 w-full rounded-lg z-0 bg-gray-200"></div>
                        {distance !== null && (<div className="mt-2 text-sm font-medium"> <p>المسافة: {distance.toFixed(1)} كم</p> <p>رسوم الخدمة: {deliveryFee} ريال</p> </div>)}
                        {deliveryError && <p className="text-red-500 text-sm mt-2">{deliveryError}</p>}
                    </div>
                )}
                 <div className="mt-6 pt-4 border-t flex justify-between"> <Button onClick={handlePrev} variant="secondary">السابق</Button> <Button onClick={handleNext} disabled={deliveryOption !== 'branch' && (!deliveryLocation || !!deliveryError)}>التالي</Button> </div>
            </div>
        );
      case 6:
        return (
          <div>
            <h4 className="font-bold text-lg mb-4 border-b pb-2">6. الإضافات الاختيارية</h4>
            <div className="space-y-3">
              <label className="flex items-center"><input type="checkbox" name="insurance" checked={options.insurance} onChange={handleOptionChange} className="ms-2" /> تأمين شامل (+50 ريال/يوم)</label>
              <label className="flex items-center"><input type="checkbox" name="extra_driver" checked={options.extra_driver} onChange={handleOptionChange} className="ms-2" /> سائق إضافي (+50 ريال)</label>
              <label className="flex items-center"><input type="checkbox" name="open_km" checked={options.open_km} onChange={handleOptionChange} className="ms-2" /> كيلومترات مفتوحة (حسب السياسة)</label>
              <label className="flex items-center"><input type="checkbox" name="child_seat" checked={options.child_seat} onChange={handleOptionChange} className="ms-2" /> كرسي أطفال (+30 ريال)</label>
              <label className="flex items-center"><input type="checkbox" name="internationalPermit" checked={options.internationalPermit} onChange={handleOptionChange} className="ms-2" /> تفويض دولي (+100 ريال)</label>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-between"> <Button onClick={handlePrev} variant="secondary">السابق</Button> <Button onClick={handleNext}>التالي</Button> </div>
          </div>
        );
      case 7:
        return (
            <div>
                <h4 className="font-bold text-lg mb-4 border-b pb-2">7. تأكيد الحجز</h4>
                <div className="space-y-4 text-gray-700 bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold">لقد أوشكت على الانتهاء!</p>
                    <p>يرجى مراجعة ملخص الحجز الكامل على يسار الشاشة. إذا كانت جميع التفاصيل صحيحة، انقر على "تأكيد الحجز المبدئي" لإرسال طلبك.</p>
                    <p className="text-xs text-gray-500 mt-2">سيقوم أحد موظفينا بمراجعة الطلب والتواصل معك للتأكيد النهائي وطرق الدفع.</p>
                </div>
                <div className="mt-6 pt-4 border-t flex justify-between">
                    <Button onClick={handlePrev} variant="secondary">السابق</Button>
                    <Button onClick={handleConfirmClick}>تأكيد الحجز المبدئي</Button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
      return <AuthForm onSuccess={() => { /* Component will re-render automatically */ }} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8">
      {/* Left Summary Column (persistent on large screens) */}
      <div className="lg:col-span-2 order-last lg:order-first mt-8 lg:mt-0">
        <div className="p-4 bg-gray-50 rounded-lg sticky top-6 space-y-4 border">
          {/* Car details */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold">{car.make} {car.model}</h3>
              <p className="text-sm text-gray-500">{car.category} - {car.year}</p>
            </div>
          </div>
          
          {/* Price summary */}
          <div className="space-y-2 text-sm">
            <h4 className="font-bold text-base mb-2">ملخص السعر</h4>
            <div className="flex justify-between text-gray-600"><span>السعر الأساسي ({days} يوم)</span> <span>{price.base.toFixed(2)} ريال</span></div>
            {price.insurance > 0 && <div className="flex justify-between text-gray-600"><span>تأمين شامل</span> <span>{price.insurance.toFixed(2)} ريال</span></div>}
            {price.extras > 0 && <div className="flex justify-between text-gray-600"><span>إضافات أخرى</span> <span>{price.extras.toFixed(2)} ريال</span></div>}
            {price.delivery > 0 && <div className="flex justify-between text-gray-600"><span>رسوم التوصيل</span> <span>{price.delivery.toFixed(2)} ريال</span></div>}
            <div className="flex justify-between text-gray-600"><span>ضريبة القيمة المضافة (15%)</span> <span>{price.tax.toFixed(2)} ريال</span></div>
            <hr className="my-2"/>
            <div className="flex justify-between font-bold text-lg text-gray-800 pt-2"><span>الإجمالي</span> <span>{price.total.toFixed(2)} ريال</span></div>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-3">
        <div className="mb-12">
          <Stepper />
        </div>
        <div>
          {renderMainStepContent()}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
