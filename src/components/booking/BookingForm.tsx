import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { CarModel } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Modal } from '../ui/Modal';
import { AuthForm } from '../auth/AuthForm';
import { 
  Calendar, 
  MapPin, 
  Calculator, 
  ShieldCheck, 
  CheckCircle, 
  Upload, 
  CreditCard, 
  Smartphone, 
  Trash2, 
  FileImage, 
  ShieldAlert, 
  Fingerprint, 
  RefreshCw,
  X,
  SmartphoneIcon
} from 'lucide-react';

interface BookingFormProps {
  model: CarModel;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ model, onSuccess, onCancel }) => {
  const { user, isAuthenticated } = useAuth();
  const { branches, settings, createBooking } = useBookings();
  const { t } = useLanguage();

  const [pickupBranchId, setPickupBranchId] = useState('');
  const [dropoffBranchId, setDropoffBranchId] = useState('');
  
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [dropoffDate, setDropoffDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow.toISOString().split('T')[0];
  });

  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  // Identity verification states
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'stc_pay' | 'apple_pay'>('cash');
  const [stcPhone, setStcPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [validationError, setValidationError] = useState<string | null>(null);

  // Simulation overlays
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [stcStep, setStcStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [stcOtp, setStcOtp] = useState('');
  const [applePayStep, setApplePayStep] = useState<'scanning' | 'success'>('scanning');
  const [creditStep, setCreditStep] = useState<'processing' | 'success'>('processing');

  // Initialize branches
  useEffect(() => {
    if (branches.length > 0) {
      setPickupBranchId(branches[0].id);
      setDropoffBranchId(branches[0].id);
    }
  }, [branches]);

  // Calculations
  const getDays = () => {
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const days = getDays();

  const getRatePerDay = () => {
    if (days >= 30) {
      return model.pricePerMonth || Math.round(model.pricePerDay * 0.75);
    } else if (days >= 7) {
      return model.pricePerWeek || Math.round(model.pricePerDay * 0.85);
    } else {
      return model.pricePerDay;
    }
  };

  const ratePerDay = getRatePerDay();
  const baseRate = ratePerDay * days;
  
  const insFee = includeInsurance ? (settings?.insuranceFeePerDay || 35) * days : 0;
  const requireIntercityFee = settings?.allowIntercityDropoff && pickupBranchId !== dropoffBranchId;
  const interFee = requireIntercityFee ? (settings?.intercityFee || 150) : 0;
  
  const subtotal = baseRate + insFee + interFee;
  const taxRate = (settings?.rentalTax || 15) / 100;
  const tax = subtotal * taxRate;
  const totalPrice = subtotal + tax;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'id') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationError('حجم الملف كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'license') {
          setLicenseImage(reader.result as string);
        } else {
          setIdCardImage(reader.result as string);
        }
        setValidationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeSubmitBooking = async (paidStatus: 'paid' | 'unpaid') => {
    setLoading(true);
    try {
      const pBranch = branches.find(b => b.id === pickupBranchId);
      const dBranch = branches.find(b => b.id === dropoffBranchId);

      const bookingPayload = {
        userId: user?.id,
        carModelId: model.id,
        startDate: pickupDate,
        endDate: dropoffDate,
        pickupBranchId,
        pickupBranchName: pBranch ? pBranch.name : 'فرع الاستلام',
        dropoffBranchId,
        dropoffBranchName: dBranch ? dBranch.name : 'فرع التسليم',
        totalPrice: Math.round(totalPrice),
        licenseImage,
        idCardImage,
        paymentMethod,
        paymentStatus: paidStatus,
      };

      const result = await createBooking(bookingPayload);
      setSuccessBookingId(result.id);
      setPaymentModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('نأمل التأكد من تعبئة الحقول والمحاولة مجدداً');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }

    if (!licenseImage) {
      setValidationError('يرجى رفع أو التقاط صورة رخصة القيادة الصالحة لإتمام حجزك');
      return;
    }

    if (!idCardImage) {
      setValidationError('يرجى رفع صورة الهوية الوطنية أو الإقامة لإثبات الهوية الشخصية');
      return;
    }

    if (paymentMethod === 'apple_pay') {
      setApplePayStep('scanning');
      setPaymentModalOpen(true);
      setTimeout(() => {
        setApplePayStep('success');
        setTimeout(() => {
          executeSubmitBooking('paid');
        }, 1500);
      }, 2000);
    } else if (paymentMethod === 'stc_pay') {
      if (!stcPhone || !stcPhone.startsWith('05') || stcPhone.length !== 10) {
        setValidationError('يرجى إدخال رقم جوال STC Pay صحيح مكون من 10 أرقام (مثال: 0512345678)');
        return;
      }
      setStcStep('phone');
      setPaymentModalOpen(true);
    } else if (paymentMethod === 'credit') {
      if (!cardNumber || cardNumber.length < 15) {
        setValidationError('يرجى إدخال رقم بطاقة ائتمانية صحيح مكتمل الرقم');
        return;
      }
      setCreditStep('processing');
      setPaymentModalOpen(true);
      setTimeout(() => {
        setCreditStep('success');
        setTimeout(() => {
          executeSubmitBooking('paid');
        }, 1400);
      }, 2000);
    } else {
      // Cash payment
      await executeSubmitBooking('unpaid');
    }
  };

  const handleStcPhoneConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setStcStep('otp');
  };

  const handleStcOtpConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (stcOtp.length !== 4) {
      alert('الرجاء كتابة رمز التحقق المكون من 4 أرقام المرسل لجوالك');
      return;
    }
    setStcStep('success');
    setTimeout(() => {
      executeSubmitBooking('paid');
    }, 1500);
  };

  if (successBookingId) {
    return (
      <div className="text-center py-8 px-4 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">تم تأكيد طلب الحجز!</h3>
        <p className="text-gray-500 text-sm max-w-sm mb-2">
          شكراً لاختيارك مسارات. طلب حجزك الآن قيد المراجعة الفورية للموافقة عليه من قبل موظف الفرع.
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700/50 p-4.5 rounded-xl text-center w-full max-w-xs font-semibold mb-6">
          <span className="text-xs text-gray-400 block mb-1 font-sans">رقم الحجز الخاص بك:</span>
          <span className="text-xl text-orange-600 dark:text-orange-500 font-mono tracking-wider">{successBookingId}</span>
        </div>
        <Button onClick={onSuccess} className="w-full sm:w-auto px-10">
          حسناً، فهمت
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-right">
        
        {validationError && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-sm font-semibold animate-in fade-in duration-200">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Branch selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label={t('pickupBranch')}
            value={pickupBranchId}
            onChange={(e) => setPickupBranchId(e.target.value)}
            options={branches.map(b => ({ value: b.id, label: b.name }))}
          />
          <Select
            label={t('dropoffBranch')}
            value={dropoffBranchId}
            onChange={(e) => setDropoffBranchId(e.target.value)}
            options={branches.map(b => ({ value: b.id, label: b.name }))}
          />
        </div>

        {/* Date pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pickupDate')}</label>
            <input
              type="date"
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 outline-none focus:border-orange-500 font-sans"
              value={pickupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('dropoffDate')}</label>
            <input
              type="date"
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 outline-none focus:border-orange-500 font-sans"
              value={dropoffDate}
              min={pickupDate}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
          </div>
        </div>

        {/* Identity & driving license document uploads */}
        <div className="border border-gray-150 dark:border-gray-850 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/10">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3.5 flex items-center gap-2">
            <FileImage className="w-4 h-4 text-orange-500" />
            <span>الوثائق والمستندات الثبوتية المطلوبة لحجز سيارة</span>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Driving License Option */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                صورة رخصة القيادة <span className="text-red-500 font-sans">*</span>
              </span>
              <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-all bg-white dark:bg-gray-850 overflow-hidden shadow-sm">
                {licenseImage ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <img src={licenseImage} alt="رخصة القيادة" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLicenseImage(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <Upload className="w-7 h-7 text-orange-500 mb-1.5" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">رفع رخصة القيادة</span>
                    <span className="text-[10px] text-gray-400 mt-1 font-sans">PNG, JPG (حد أقصى 5MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 'license')}
                />
              </label>
            </div>

            {/* National ID / Iqama Option */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                صورة الهوية الوطنية / الإقامة <span className="text-red-500 font-sans">*</span>
              </span>
              <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-all bg-white dark:bg-gray-850 overflow-hidden shadow-sm">
                {idCardImage ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <img src={idCardImage} alt="الهوية الشخصية" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdCardImage(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <Upload className="w-7 h-7 text-orange-500 mb-1.5" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">رفع الهوية / الإقامة</span>
                    <span className="text-[10px] text-gray-400 mt-1 font-sans">PNG, JPG (حد أقصى 5MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 'id')}
                />
              </label>
            </div>

          </div>
        </div>

        {/* Payment Selectors */}
        <div className="border border-gray-150 dark:border-gray-850 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/10">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3.5 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span>اختر طريقة وطريقة سداد الفاتورة</span>
          </h4>

          <div className="grid grid-cols-2 gap-3 mb-4.5">
            {/* Cash at branch */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                paymentMethod === 'cash'
                  ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/10 text-orange-605 dark:text-orange-400 font-bold shadow-sm'
                  : 'border-gray-200 dark:border-gray-805 bg-white dark:bg-gray-850 hover:border-gray-300 text-gray-600 dark:text-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-300" />
              <span className="text-xs">الدفع عند الفرع</span>
            </button>

            {/* Apple Pay card button */}
            <button
              type="button"
              onClick={() => setPaymentMethod('apple_pay')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                paymentMethod === 'apple_pay'
                  ? 'border-black dark:border-white bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/95 text-white dark:text-black font-extrabold shadow-md transform scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-805 bg-white dark:bg-gray-850 hover:border-gray-300 text-gray-600 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-sans font-black tracking-tighter"> Pay</span>
              </div>
              <span className="text-xs">Apple Pay</span>
            </button>

            {/* STC Pay option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('stc_pay')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                paymentMethod === 'stc_pay'
                  ? 'border-purple-600 bg-purple-650 hover:bg-purple-700 text-white font-extrabold shadow-md transform scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-805 bg-white dark:bg-gray-850 hover:border-gray-300 text-gray-600 dark:text-gray-300'
              }`}
            >
              <SmartphoneIcon className="w-5 h-5 mb-1 text-purple-500" />
              <span className="text-xs font-sans tracking-tight">STC Pay</span>
            </button>

            {/* Credit Card payment */}
            <button
              type="button"
              onClick={() => setPaymentMethod('credit')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                paymentMethod === 'credit'
                  ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                  : 'border-gray-200 dark:border-gray-805 bg-white dark:bg-gray-850 hover:border-gray-300 text-gray-600 dark:text-gray-300'
              }`}
            >
              <FileImage className="w-5 h-5 mb-1 text-blue-500" />
              <span className="text-xs">فيزا / ماستر / مدى</span>
            </button>
          </div>

          {/* Conditional Input UI: STC Pay input */}
          {paymentMethod === 'stc_pay' && (
            <div className="p-3.5 bg-purple-500/5 rounded-xl border border-purple-500/10 flex flex-col gap-2.5 animate-in slide-in-from-top-1 duration-200 text-right">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">حساب سداد المحفظة الرقمية STC Pay</span>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-400">رقم جوال المحفظة المسجل بSTC Pay:</label>
                <input
                  type="text"
                  placeholder="05xxxxxxxx"
                  maxLength={10}
                  className="w-full text-center tracking-widest font-mono text-md border border-purple-300/30 dark:border-purple-900/40 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={stcPhone}
                  onChange={(e) => setStcPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          )}

          {/* Conditional Input UI: Credit Card Inputs */}
          {paymentMethod === 'credit' && (
            <div className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/10 flex flex-col gap-3.5 animate-in slide-in-from-top-1 duration-200">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">معلومات بطاقتك الائتمانية الآمنة (مدى، فيزا)</span>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500">رقم البطاقة:</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    className="w-full text-left font-mono text-xs border border-gray-200 dark:border-gray-800 rounded-lg pr-3 pl-10 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  />
                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500">انتهاء البطاقة (YY/MM):</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/28"
                    className="w-full text-center font-mono text-xs border border-gray-200 dark:border-gray-800 rounded-lg py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500">رمز التحقق الخلفي (CVV):</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="•••"
                    className="w-full text-center font-mono text-xs border border-gray-200 dark:border-gray-800 rounded-lg py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500">اسم صاحب البطاقة الكامل:</label>
                <input
                  type="text"
                  placeholder="Mohammed Al-Fulan"
                  className="w-full text-left font-mono text-xs border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </div>

            </div>
          )}

        </div>

        {/* Insurance toggler */}
        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/40 rounded-xl p-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-start gap-2 max-w-[80%]">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">إضافة درع التأمين الشامل</p>
              <p className="text-xs text-gray-400 mt-1">يغطي الأضرار والتلفيات الشاملة بالكامل مقابل ٢٥ ريال إضافي فقط لليوم.</p>
            </div>
          </div>
          <Checkbox checked={includeInsurance} onChange={(e) => setIncludeInsurance(e.target.checked)} />
        </div>

        {/* Calculations invoice */}
        <div className="border border-gray-150 dark:border-gray-800 rounded-xl p-5 bg-orange-50/10 dark:bg-orange-950/5 flex flex-col gap-3.5">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-150 dark:border-gray-800">
            <Calculator className="w-4 h-4 text-orange-500" />
            <span>تفاصيل تسعير الفاتورة المالية ({days} {t('days')})</span>
          </h4>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex flex-col">
              <span>معدل الإيجار اليومي المحتسب:</span>
              <span className="text-[10px] text-gray-400">
                {days >= 30 ? '🎁 باقة التوفير الكبرى للإيجار الشهري' :
                 days >= 7 ? '✨ باقة التوفير للإيجار الأسبوعي' :
                 '🍂 باقة الإيجار اليومي العادي'}
              </span>
            </span>
            <span className="font-medium font-mono text-gray-800 dark:text-gray-200">{ratePerDay} ريال/يوم</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">إجمالي مدة الحجز الأساسية:</span>
            <span className="font-medium font-mono text-gray-800 dark:text-gray-200">{baseRate} ريال</span>
          </div>

          {includeInsurance && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">رسوم التأمين الشامل:</span>
              <span className="font-medium font-mono text-gray-800 dark:text-gray-200">+{insFee} ريال</span>
            </div>
          )}

          {requireIntercityFee && (
            <div className="flex items-center justify-between text-sm text-amber-600 dark:text-amber-400">
              <span className="text-gray-500">رسوم التسليم في مدينة أخرى:</span>
              <span className="font-medium font-mono">+{interFee} ريال</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-150 dark:border-gray-800">
            <span className="text-gray-500">الضريبة المضافة والرسوم الإدارية ({settings?.rentalTax || 15}%):</span>
            <span className="font-medium font-mono text-gray-800 dark:text-gray-200">+{Math.round(tax)} ريال</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-orange-500/25">
            <span className="font-extrabold text-md text-gray-950 dark:text-white">المبلغ الإجمالي النهائي:</span>
            <span className="font-extrabold text-xl text-orange-600 dark:text-orange-500 font-mono">{Math.round(totalPrice)} ريال</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {!isAuthenticated ? 'سجل دخولك لتأكيد الحجز' : t('confirmBooking')}
          </Button>
        </div>

      </form>

      {/* Auth Modal sub-overlay if need login */}
      <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} title="يجب تسجيل الدخول لإتمام الحجز">
        <AuthForm onSuccess={() => { setIsAuthOpen(false); }} />
      </Modal>

      {/* PAYMENT PROCESSOR OVERLAY DIALOG */}
      <Modal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} title="بوابة الدفع الآمنة والبيومترية لـ مسارات">
        <div className="p-4 flex flex-col items-center gap-5 text-center">
          
          {/* Apple Pay Simulator UI */}
          {paymentMethod === 'apple_pay' && (
            <div className="w-full flex flex-col items-center gap-4.5 py-4">
              <div className="relative">
                <div className={`w-18 h-18 rounded-full border-2 flex items-center justify-center transition-all bg-black text-white ${
                  applePayStep === 'success' 
                    ? 'border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/20' 
                    : 'border-white/20 animate-pulse'
                }`}>
                  {applePayStep === 'success' ? (
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <Fingerprint className="w-10 h-10 animate-pulse-subtle" />
                  )}
                </div>
              </div>

              <div>
                <dt className="text-md font-sans font-black text-black dark:text-white"> Pay</dt>
                {applePayStep === 'scanning' ? (
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">
                    جاري فحص Touch ID أو Face ID لإتمام عملية المدفوعات التابعة لك...
                  </p>
                ) : (
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                    تمت معالجة المدفوعات والتوثيق الحيوي بنجاح!
                  </p>
                )}
              </div>

              <div className="text-xs font-mono text-gray-400 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-150 dark:border-gray-700/40 w-full justify-center">
                <span>تأمين الاتصال والمصادقة الحيوية بواسطة رمز أمان آبل المشفّر</span>
              </div>
            </div>
          )}

          {/* STC Pay Simulator UI */}
          {paymentMethod === 'stc_pay' && (
            <div className="w-full flex flex-col items-center py-2">
              <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 flex items-center justify-center mb-2">
                <Smartphone className="w-7 h-7" />
              </div>
              
              <h4 className="text-md font-bold text-gray-900 dark:text-white mb-1.5">بوابة الدفع الفوري STC Pay</h4>
              <p className="text-xs text-gray-500 mb-5">
                {stcStep === 'phone' && 'يرجى تأكيد حساب المحفظة لبدء الخصم الرقمي المباشر'}
                {stcStep === 'otp' && `تم إرسال رمز تحقق مؤقت مكون من ٤ أرقام لجوالك: ${stcPhone}`}
                {stcStep === 'success' && 'تم استقطاع المدفوعات من محفظتك بنجاح!'}
              </p>

              {stcStep === 'phone' && (
                <form onSubmit={handleStcPhoneConfirm} className="w-full flex flex-col gap-3">
                  <div className="p-3 bg-purple-500/5 rounded-lg text-center font-bold font-mono tracking-widest text-[15px] border border-purple-500/10">
                    {stcPhone}
                  </div>
                  <Button type="submit" className="w-full bg-purple-650 hover:bg-purple-700 text-white font-extrabold gap-2">
                    <span>إرسال رمز الدفع المباشر (OTP)</span>
                    <RefreshCw className="w-4 h-4 animate-spin-reverse" />
                  </Button>
                </form>
              )}

              {stcStep === 'otp' && (
                <form onSubmit={handleStcOtpConfirm} className="w-full flex flex-col gap-3 text-right">
                  <label className="text-xs text-gray-500 text-center">أدخل الرمز لإنهاء الخصم:</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="رمز OTP المباشر"
                    className="w-full text-center tracking-widest text-lg font-bold font-mono rounded-lg border border-purple-500 bg-white dark:bg-gray-800 py-1.5 focus:outline-none"
                    value={stcOtp}
                    onChange={(e) => setStcOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1 py-1" onClick={() => setStcStep('phone')}>رجوع</Button>
                    <Button type="submit" className="flex-1 py-1 bg-purple-600 hover:bg-purple-700 font-extrabold">تأكيد الدفع</Button>
                  </div>
                </form>
              )}

              {stcStep === 'success' && (
                <div className="text-center flex flex-col items-center gap-2">
                  <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
                  <span className="text-sm font-extrabold text-emerald-600 mt-1">تم خصم {Math.round(totalPrice)} ريال بنجاح!</span>
                </div>
              )}
            </div>
          )}

          {/* Credit Card Simulator UI */}
          {paymentMethod === 'credit' && (
            <div className="w-full flex flex-col items-center py-4 gap-4.5">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                  creditStep === 'success' 
                    ? 'border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/10 bg-emerald-50 dark:bg-emerald-950/20' 
                    : 'border-orange-500 text-orange-500 animate-spin bg-orange-50/10'
                }`}>
                  {creditStep === 'success' ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-md font-bold text-gray-900 dark:text-white">معالجة دفع البطاقة (مدى/فيزا)</h4>
                {creditStep === 'processing' ? (
                  <p className="text-xs text-gray-500 mt-2">
                    جاري فحص الرصيد المتاح للبطاقة رقم •••• {cardNumber.slice(-4) || 'إلكتروني'} وإتمام عملية الخصم الآمنة...
                  </p>
                ) : (
                  <p className="text-xs font-bold text-emerald-600 mt-2">
                    تم سداد واحتساب العملية بالكامل بنجاح من بطاقتك الائتمانية البنكية!
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </Modal>

    </div>
  );
};

export default BookingForm;
