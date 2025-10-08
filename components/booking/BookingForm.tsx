import React, { useState, useEffect, useMemo } from 'react';
import { FullCarDetails } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../auth/AuthForm';

interface BookingFormProps {
  car: FullCarDetails;
  onClose: () => void;
  onConfirm: () => void;
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
    // Round up to the next 30 minutes
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
  const [isCarDetailsVisible, setIsCarDetailsVisible] = useState(true);

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
  
  const [documents, setDocuments] = useState<{ license: File | null, id_card: File | null, licenseExpiry: string }>({ license: null, id_card: null, licenseExpiry: '' });
  const [contact, setContact] = useState({ phone1: '', phone2: '', address: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const timeOptions = useMemo(() => generateTimeOptions(), []);
  
  useEffect(() => {
    // Hide car details during the initial data entry steps to save space on mobile
    setIsCarDetailsVisible(mainStep >= 4);
  }, [mainStep]);


  useEffect(() => {
    if (!startDate || !endDate || !startTime || !endTime) {
        setDateError('');
        setDays(0);
        return;
    }
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const now = new Date();
    now.setMinutes(now.getMinutes() - 1); // Allow booking for the current time slot

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

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newErrors = { ...errors };
    const fieldName = e.target.name;
    
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            newErrors[fieldName] = "الصيغ المسموح بها هي JPG, PNG, PDF.";
        } else if (file.size > maxSize) {
            newErrors[fieldName] = "حجم الملف يجب أن يكون أقل من 5 ميجابايت.";
        } else {
            delete newErrors[fieldName];
            setDocuments({ ...documents, [fieldName]: file });
        }
    } else {
         delete newErrors[fieldName];
    }
     setErrors(newErrors);
  };
  
  const handleDocsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setDocuments({ ...documents, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const price = useMemo(() => {
    let base = days > 0 ? car.daily_price * days : 0;
    let extrasTotal = 0;
    if (options.insurance) extrasTotal += (50 * days);
    if (options.extra_driver) extrasTotal += 50;
    if (options.child_seat) extrasTotal += 30;
    if (options.internationalPermit) extrasTotal += 100;
    
    const subtotal = base + extrasTotal;
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    return { base, extras: extrasTotal, tax, total };
  }, [car.daily_price, days, options]);

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!contact.phone1) newErrors.phone1 = "رقم الجوال الرئيسي مطلوب.";
    if (!contact.address) newErrors.address = "العنوان مطلوب.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!documents.license) {
        newErrors.license = "الرجاء رفع صورة رخصة القيادة.";
    }
    if (!documents.licenseExpiry) {
        newErrors.licenseExpiry = "تاريخ انتهاء الرخصة مطلوب.";
    } else if (new Date(documents.licenseExpiry) < new Date(startDate)) {
        newErrors.licenseExpiry = "الرخصة ستكون منتهية الصلاحية في تاريخ استلام السيارة.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!documents.id_card) {
        newErrors.id_card = "الرجاء رفع صورة الهوية / الإقامة.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = () => {
    if (mainStep === 1 && !validateStep1()) return;
    if (mainStep === 2 && !validateStep2()) return;
    if (mainStep === 3 && !validateStep3()) return;
    if (mainStep === 4 && (!!dateError || days === 0)) {
        setDateError('الرجاء إدخال تواريخ صحيحة.');
        return;
    }
    setMainStep(s => Math.min(s + 1, 6));
  };
  const handlePrev = () => setMainStep(s => Math.max(s - 1, 1));


  const Stepper = () => {
    const steps = [
        { number: 1, title: 'التواصل' },
        { number: 2, title: 'الرخصة' },
        { number: 3, title: 'الهوية' },
        { number: 4, title: 'التواريخ' },
        { number: 5, title: 'الإضافات' },
        { number: 6, title: 'التأكيد' },
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
                                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
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
      case 1: // Contact Info
        return (
          <div>
            <h4 className="font-bold text-lg mb-2 border-b pb-1">بيانات التواصل</h4>
            <div className="space-y-4 mt-4">
                <Input label="رقم الجوال (مطلوب)" type="tel" name="phone1" value={contact.phone1} onChange={handleContactChange} required />
                {errors.phone1 && <p className="text-red-500 text-xs mt-1">{errors.phone1}</p>}
                <Input label="رقم جوال ثاني (اختياري)" type="tel" name="phone2" value={contact.phone2} onChange={handleContactChange} />
                <Input label="العنوان الحالي (مطلوب)" type="text" name="address" value={contact.address} onChange={handleContactChange} required />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end">
                <Button onClick={handleNext}>التالي</Button>
            </div>
          </div>
        );
      case 2: // License
        return (
            <div>
              <h4 className="font-bold text-lg mb-2 border-b pb-1">رخصة القيادة</h4>
              <div className="space-y-4 mt-4">
                  <div>
                      <label htmlFor="license" className="block text-sm font-medium text-gray-800">صورة رخصة القيادة (مطلوب)</label>
                      <p className="text-xs text-gray-500 mb-1">JPG, PNG, PDF (حد أقصى 5MB)</p>
                      <input id="license" name="license" type="file" accept="image/png, image/jpeg, application/pdf" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:me-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"/>
                      {documents.license && <p className="text-xs text-green-600 mt-1">تم اختيار: {documents.license.name}</p>}
                      {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
                  </div>
                  <div>
                      <Input label="تاريخ انتهاء الرخصة (مطلوب)" type="date" name="licenseExpiry" value={documents.licenseExpiry} onChange={handleDocsInputChange} required />
                      {errors.licenseExpiry && <p className="text-red-500 text-xs mt-1">{errors.licenseExpiry}</p>}
                  </div>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-between">
                  <Button onClick={handlePrev} variant="secondary">السابق</Button>
                  <Button onClick={handleNext}>التالي</Button>
              </div>
            </div>
        );
      case 3: // ID Card
        return (
            <div>
              <h4 className="font-bold text-lg mb-2 border-b pb-1">وثيقة إثبات الهوية</h4>
              <div className="mt-4">
                  <label htmlFor="id_card" className="block text-sm font-medium text-gray-800">صورة الهوية / الإقامة (مطلوب)</label>
                  <p className="text-xs text-gray-500 mb-1">JPG, PNG, PDF (حد أقصى 5MB)</p>
                  <input id="id_card" name="id_card" type="file" accept="image/png, image/jpeg, application/pdf" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:me-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"/>
                  {documents.id_card && <p className="text-xs text-green-600 mt-1">تم اختيار: {documents.id_card.name}</p>}
                  {errors.id_card && <p className="text-red-500 text-xs mt-1">{errors.id_card}</p>}
              </div>
              <div className="mt-6 pt-4 border-t flex justify-between">
                  <Button onClick={handlePrev} variant="secondary">السابق</Button>
                  <Button onClick={handleNext}>التالي</Button>
              </div>
            </div>
        );
      case 4: // Rental Details
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <Input label="تاريخ الاستلام" type="date" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setStartDate(e.target.value)} />
                <Select label="وقت الاستلام" id="start-time" value={startTime} onChange={e => setStartTime(e.target.value)}>
                    {timeOptions.map(time => <option key={`start-${time}`} value={time}>{time}</option>)}
                </Select>
                <Input label="تاريخ التسليم" type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} />
                <Select label="وقت التسليم" id="end-time" value={endTime} onChange={e => setEndTime(e.target.value)}>
                    {timeOptions.map(time => <option key={`end-${time}`} value={time}>{time}</option>)}
                </Select>
            </div>
             {dateError && (
                <p className="text-red-500 text-sm my-4">{dateError}</p>
            )}
             <div className="mt-6 pt-4 border-t flex justify-between">
                <Button onClick={handlePrev} variant="secondary">السابق</Button>
                <Button onClick={handleNext} disabled={!!dateError || days === 0}>التالي</Button>
            </div>
          </div>
        );
      case 5: // Options
        return (
          <div>
            <div className="space-y-3">
              <label className="flex items-center"><input type="checkbox" name="insurance" checked={options.insurance} onChange={handleOptionChange} className="ms-2" /> تأمين شامل (+50 ريال/يوم)</label>
              <label className="flex items-center"><input type="checkbox" name="extra_driver" checked={options.extra_driver} onChange={handleOptionChange} className="ms-2" /> سائق إضافي (+50 ريال)</label>
              <label className="flex items-center"><input type="checkbox" name="open_km" checked={options.open_km} onChange={handleOptionChange} className="ms-2" /> كيلومترات مفتوحة (حسب السياسة)</label>
              <label className="flex items-center"><input type="checkbox" name="child_seat" checked={options.child_seat} onChange={handleOptionChange} className="ms-2" /> كرسي أطفال (+30 ريال)</label>
              <label className="flex items-center"><input type="checkbox" name="internationalPermit" checked={options.internationalPermit} onChange={handleOptionChange} className="ms-2" /> تفويض دولي (+100 ريال)</label>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-between">
                <Button onClick={handlePrev} variant="secondary">السابق</Button>
                <Button onClick={handleNext}>التالي</Button>
            </div>
          </div>
        );
      case 6: // Summary & Confirm
        return (
            <div>
                <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between"><span>مدة الإيجار</span> <span>{days} يوم</span></div>
                    <div className="flex justify-between"><span>السعر الأساسي</span> <span>{price.base.toFixed(2)} ريال</span></div>
                    {price.extras > 0 && <div className="flex justify-between"><span>الإضافات</span> <span>{price.extras.toFixed(2)} ريال</span></div>}
                    <div className="flex justify-between"><span>ضريبة القيمة المضافة (15%)</span> <span>{price.tax.toFixed(2)} ريال</span></div>
                    <hr className="my-2"/>
                    <div className="flex justify-between font-bold text-xl"><span>الإجمالي</span> <span>{price.total.toFixed(2)} ريال</span></div>
                </div>
                 <p className="text-xs text-gray-500 mt-4">خيارات الدفع المتاحة: دفع كامل الآن, دفع عربون, أو الحجز بدون دفع (حسب سياسة الفرع).</p>
                <div className="mt-6 pt-4 border-t flex justify-between">
                    <Button onClick={handlePrev} variant="secondary">السابق</Button>
                    <Button onClick={onConfirm}>تأكيد الحجز المبدئي</Button>
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
    <div>
        {isCarDetailsVisible && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
                        <p className="text-gray-500">{car.category}</p>
                    </div>
                     <div className="text-left">
                        <p className="text-2xl font-extrabold text-orange-600">{car.daily_price} ريال</p>
                        <p className="text-gray-500">/يوم</p>
                    </div>
                </div>
            </div>
        )}
        <div className="my-8 pb-4">
            <Stepper />
        </div>
        
        <div className="mt-8">
          {renderMainStepContent()}
        </div>
    </div>
  );
};

export default BookingForm;
