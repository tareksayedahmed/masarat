import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { Booking, Car, PricingRule, AppSettings } from '../../types';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { logsAPI, reportsAPI } from '../../api';

// Admin Modals
import BookingDetailsModal from '../admin/BookingDetailsModal';
import CarFormModal from '../admin/CarFormModal';
import CarModelFormModal from '../admin/CarModelFormModal';

// Icons
import {
  LayoutDashboard,
  CalendarDays,
  Gauge,
  Tags,
  Sliders,
  History,
  FileBarChart2,
  Lock,
  Plus,
  RefreshCw,
  LogOut,
  ChevronLeft,
  Users,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Car as CarIcon,
  Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ModelPricingCard: React.FC<{ model: any }> = ({ model }) => {
  const { updateCarModel } = useBookings();
  const [editing, setEditing] = useState(false);
  const [dayPrice, setDayPrice] = useState(model.pricePerDay.toString());
  const [weekPrice, setWeekPrice] = useState((model.pricePerWeek || Math.round(model.pricePerDay * 0.85)).toString());
  const [monthPrice, setMonthPrice] = useState((model.pricePerMonth || Math.round(model.pricePerDay * 0.75)).toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCarModel(model.id, {
        pricePerDay: parseFloat(dayPrice) || 0,
        pricePerWeek: parseFloat(weekPrice) || 0,
        pricePerMonth: parseFloat(monthPrice) || 0,
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء حفظ الأسعار');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-right">
        <img src={model.imageUrl} alt={model.name} className="w-20 h-14 object-cover rounded-lg border border-gray-100 dark:border-gray-800" />
        <div>
          <h5 className="font-bold text-gray-950 dark:text-white">{model.brand} {model.name}</h5>
          <span className="text-[10px] text-gray-400 block uppercase">فئة: {model.type}</span>
          
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-650">
            <div>
              <span className="text-gray-400">يومي:</span>{' '}
              <span className="font-bold font-mono text-gray-900 dark:text-white">{model.pricePerDay} ريال</span>
            </div>
            <div>
              <span className="text-gray-400">أسبوعي (لليوم):</span>{' '}
              <span className="font-bold font-mono text-orange-600">{model.pricePerWeek || Math.round(model.pricePerDay * 0.85)} ريال</span>
            </div>
            <div>
              <span className="text-gray-400">شهري (لليوم):</span>{' '}
              <span className="font-bold font-mono text-emerald-600">{model.pricePerMonth || Math.round(model.pricePerDay * 0.75)} ريال</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-auto flex justify-end">
        {!editing ? (
          <Button size="xs" variant="outline" className="text-xs" onClick={() => setEditing(true)}>
            ✏️ تعديل باقات الأسعار
          </Button>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-3 w-full sm:min-w-[260px] text-right">
            <div className="text-xs font-bold text-gray-900 dark:text-white border-b pb-1">تحديث خيارات وباقات الأسعار</div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-medium font-bold">سعر إيجار يومي (أقل من 7 أيام):</label>
              <input
                type="number"
                className="rounded-lg border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs px-2.5 py-1.5 font-mono outline-none focus:border-orange-500"
                value={dayPrice}
                onChange={(e) => setDayPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-orange-600 font-medium font-bold">سعر اليوم للمدد الأسبوعية (7 ~ 29 يوم):</label>
              <input
                type="number"
                className="rounded-lg border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs px-2.5 py-1.5 font-mono outline-none focus:border-orange-500"
                value={weekPrice}
                onChange={(e) => setWeekPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-emerald-600 font-medium font-bold">سعر اليوم للمدد الشهرية (30 يوم أو أكثر):</label>
              <input
                type="number"
                className="rounded-lg border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs px-2.5 py-1.5 font-mono outline-none focus:border-orange-500"
                value={monthPrice}
                onChange={(e) => setMonthPrice(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mt-1">
              <Button size="xs" variant="primary" loading={saving} onClick={handleSave} className="flex-1 text-[10px] py-1.5">
                حفظ
              </Button>
              <Button size="xs" variant="outline" onClick={() => setEditing(false)} className="flex-1 text-[10px] py-1.5">
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    branches,
    carModels,
    cars,
    bookings,
    pricingRules,
    settings,
    loading: bookingLoading,
    deleteCar,
    deletePricingRule,
    updateSettings,
    refreshData
  } = useBookings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'fleet' | 'pricing' | 'settings' | 'reports' | 'logs'>('dashboard');
  
  // Audits logs search
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Reports details
  const [reports, setReports] = useState<any>(null);
  const [loadingReports, setLoadingReports] = useState(false);

  // Modal controls helpers
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // System Settings local controls
  const [taxInput, setTaxInput] = useState('15');
  const [minDays, setMinDays] = useState('1');
  const [insFeeInput, setInsFeeInput] = useState('25');
  const [intercityFeeInput, setIntercityFeeInput] = useState('150');
  const [allowIntercity, setAllowIntercity] = useState(true);

  // Load audit logs and reports when relevant
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const data = await logsAPI.getAll();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const data = await reportsAPI.get();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  // Load current settings values
  useEffect(() => {
    if (settings) {
      setTaxInput((settings.rentalTax ?? 15).toString());
      setMinDays((settings.minBookingDays ?? 1).toString());
      setInsFeeInput((settings.insuranceFeePerDay ?? 25).toString());
      setIntercityFeeInput((settings.intercityFee ?? 150).toString());
      setAllowIntercity(settings.allowIntercityDropoff ?? true);
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        rentalTax: Math.max(0, parseFloat(taxInput) || 0),
        minBookingDays: Math.max(1, parseInt(minDays) || 1),
        insuranceFeePerDay: Math.max(0, parseInt(insFeeInput) || 0),
        intercityFee: Math.max(0, parseInt(intercityFeeInput) || 0),
        allowIntercityDropoff: allowIntercity,
      });
      alert('تمت مزامنة وحفظ إعدادات النظام الإداري بنجاح!');
    } catch (err) {
      console.error(err);
      alert('تعذرت مزامنة الإعدادات، يرجى المحاولة لاحقاً');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'لوحة الإحصائيات العامة', icon: LayoutDashboard },
    { id: 'bookings', label: 'إدارة طلبات الحجز', icon: CalendarDays },
    { id: 'fleet', label: 'الأسطول الميداني والسيارات', icon: CarIcon },
    { id: 'pricing', label: 'شروط وباقات المواسم', icon: Tags },
    { id: 'settings', label: 'إعدادات وقواعد النظام', icon: Sliders },
    { id: 'reports', label: 'تقارير الأداء والأرباح', icon: FileBarChart2 },
    { id: 'logs', label: 'سجل عمليات الموظفين', icon: History },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row antialiased">
      
      {/* Dynamic Administrative Sidebar (RTL) */}
      <aside className="w-full md:w-80 bg-white dark:bg-gray-850 border-l border-gray-150 dark:border-gray-800 flex flex-col p-6 gap-6 flex-shrink-0">
        
        {/* Top brand */}
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/">
            <button className="p-2 rounded-xl text-gray-500 hover:text-orange-600 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-orange-500/25 transition-all" title="العودة للموقع الرئيسي">
              <Home className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Manager User account chip */}
        <div className="p-4 bg-orange-500/5 dark:bg-orange-950/10 border border-orange-500/15 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center shadow-md">
            {user.name[0]}
          </div>
          <div>
            <span className="text-xs text-gray-450 block font-medium">مرحباً بك:</span>
            <span className="text-sm font-bold text-gray-950 dark:text-white leading-tight">{user.name.split(' ')[0]}</span>
            <span className="text-[10px] bg-orange-600/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded-md block w-max mt-1 uppercase">
              {user.role}
            </span>
          </div>
        </div>

        {/* List of sidebar links inside operations */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            // Branch workers roles can bypass logs etc but restrict settings
            const isRestricted = ['settings', 'reports'].includes(item.id) && user.role !== 'head_admin';
            if (isRestricted) return null;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-3.5 px-4 rounded-xl text-sm font-bold text-right transition-all outline-none ${
                  activeTab === item.id
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/15'
                    : 'text-gray-600 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronLeft className={`w-4 h-4 opacity-70 transition-transform ${activeTab === item.id ? 'rotate-180' : ''}`} />
              </button>
            );
          })}
        </nav>

        {/* Exit link */}
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full mt-auto flex items-center gap-3 p-3.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/15 border border-transparent hover:border-red-500/20 rounded-xl font-bold"
        >
          <LogOut className="w-5 h-5" />
          <span>الخروج من لوحة الإشراف إداريا</span>
        </button>

      </aside>

      {/* Main Container Content */}
      <main className="flex-grow p-6 sm:p-10 flex flex-col gap-8 overflow-y-auto">
        
        {/* Dynamic header row with sync button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-gray-800 pb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-950 dark:text-white">بوابة الإدارة الشاملة</h1>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              تحث مسارات على استباقية قراراتك التشغيلية وتجهيز سيارات الأسطول لعملائنا في المطارات بكل دقة وسرعة.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { refreshData(); }} className="gap-2 self-start">
            <RefreshCw className="w-4 h-4" />
            <span>تحديث البيانات المباشرة</span>
          </Button>
        </div>

        {/* Dynamic components render based on tabs */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            
            {/* Direct counter blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  💰
                </div>
                <div>
                  <span className="text-xs text-gray-450 block font-medium">مجموع الإيرادات المحصلة:</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-gray-900 dark:text-white">
                    {bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0)} ريال
                  </span>
                </div>
              </Card>

              <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  🚗
                </div>
                <div>
                  <span className="text-xs text-gray-450 block font-medium">سيارات الأسطول المادي:</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-gray-900 dark:text-white">{cars.length} سيارات</span>
                </div>
              </Card>

              <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  📋
                </div>
                <div>
                  <span className="text-xs text-gray-450 block font-medium">طلبات الإيجار المؤكدة:</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-gray-900 dark:text-white">
                    {bookings.filter(b => b.status === 'approved').length} جارية
                  </span>
                </div>
              </Card>

              <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center text-lg font-bold flex-shrink-0 animate-pulse">
                  ⏳
                </div>
                <div>
                  <span className="text-xs text-gray-450 block font-medium">طلبات جديدة معلقة:</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                    {bookings.filter(b => b.status === 'pending').length} معلق
                  </span>
                </div>
              </Card>

            </div>

            {/* Sub-block charts overview layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Detailed Pending review list inside Dashboard */}
              <Card className="lg:col-span-8 p-6 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-950 dark:text-white">طلبات الحجوزات المعلقة للمراجعة</h3>
                  <span className="text-xs text-gray-450">مراجعة فورية لتأجير السيارات بالفروع</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 font-bold">
                        <th className="pb-3 text-right">رقم الحجز</th>
                        <th className="pb-3 text-right">اسم العميل</th>
                        <th className="pb-3 text-right">فئة الموديل</th>
                        <th className="pb-3 text-right">تواريخ الإيجار</th>
                        <th className="pb-3 text-right">الإجمالي</th>
                        <th className="pb-3 text-right">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40">
                      {bookings.filter(b => b.status === 'pending').slice(0, 5).map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                          <td className="py-3.5 font-bold font-mono">{booking.id}</td>
                          <td className="py-3.5 font-semibold text-gray-800 dark:text-gray-200">{booking.userName}</td>
                          <td className="py-3.5">{booking.carName}</td>
                          <td className="py-3.5 font-mono text-gray-500">{booking.startDate} إلی {booking.endDate} </td>
                          <td className="py-3.5 font-bold font-mono text-orange-600">{booking.totalPrice} ريال</td>
                          <td className="py-3.5">
                            <Button size="sm" onClick={() => setCurrentBooking(booking)} className="text-[10px] py-1 px-3">
                              معاينة وتأكيد الحجز
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {bookings.filter(b => b.status === 'pending').length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-450">لا تتوفر أي طلبات معلقة للمراجعة حالياً. تفقد أسطولك المأجور بأمان!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Multi-role guides details panel */}
              <Card className="lg:col-span-4 p-6 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850 space-y-4">
                <h3 className="font-bold text-gray-950 dark:text-white">صلاحيات الإشراف المتاحة لحسابك</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-750 text-xs">
                    <strong className="text-orange-600 block mb-1">المدير العام (Head Admin):</strong>
                    <span className="text-gray-500 leading-normal block">صلاحيات مطلقة: تعديل تكاليف الإيجار، تغيير قواعد الضرائب، أرشفة الفعاليات، متابعة تقارير الأرباح المجمعة وإضافة فروع.</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-750 text-xs">
                    <strong className="text-orange-600 block mb-1">مشرف الفرع (Branch Admin):</strong>
                    <span className="text-gray-500 leading-normal block">صلاحيات تسييرية: إضافة سيارات جديدة للفرع المختص وتحديث حالتها، تحصيل فواتير الإيجار والموافقة أو رفض طلبات الإتاحة المباشرة.</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-750 text-xs">
                    <strong className="text-orange-600 block mb-1">موظف التشغيل (Operator):</strong>
                    <span className="text-gray-500 leading-normal block">صلاحيات حقلية: تجهيز وتسليم السيارة، معاينة الأوراق، تسجيل قراءة عداد الكيلومتر والتحقق من رقم رخصة القيادة.</span>
                  </div>
                </div>
              </Card>

            </div>

          </div>
        )}

        {/* BOOKINGS MANAGEMENT TABS */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <Card className="p-6 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
              <div className="flex items-center justify-between mb-5 border-b pb-4 dark:border-gray-850">
                <h3 className="font-bold text-md text-gray-900 dark:text-white">قائمة حجوزات مسارات الموثقة ({bookings.length} حجوزات)</h3>
                <span className="text-xs text-gray-400">انقر لمعاينة أو تحديث التسجيل المالي وتخصيص رقم لوحة السيارة</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 font-bold">
                      <th className="pb-3 text-right">رقم العملية</th>
                      <th className="pb-3 text-right">العميل</th>
                      <th className="pb-3 text-right">الموديل الفئة</th>
                      <th className="pb-3 text-right">التاريخ المستهدف</th>
                      <th className="pb-3 text-right">قيمة التذكرة</th>
                      <th className="pb-3 text-right">التخصيص المادي</th>
                      <th className="pb-3 text-right">الدفعية</th>
                      <th className="pb-3 text-right">الوضعية الحالية</th>
                      <th className="pb-3 text-right">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40 font-medium">
                    {bookings.map((booking) => {
                      const assignedCar = cars.find(c => c.id === booking.carId);
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                          <td className="py-3.5 font-bold font-mono">{booking.id}</td>
                          <td className="py-3.5 text-gray-800 dark:text-gray-250 font-bold">{booking.userName}</td>
                          <td className="py-3.5">{booking.carName}</td>
                          <td className="py-3.5 font-mono text-gray-550">{booking.startDate} # {booking.endDate}</td>
                          <td className="py-3.5 font-black text-orange-600 font-mono">{booking.totalPrice} ريال</td>
                          <td className="py-3.5">
                            {assignedCar ? (
                              <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md border border-emerald-550/20">
                                {assignedCar.plateNumber}
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-500 font-bold">لم تخصص سيارة</span>
                            )}
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[10px] font-bold ${booking.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-red-500'}`}>
                              {booking.paymentStatus === 'paid' ? 'مسدد/مقبول' : 'عند الاستلام'}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className="text-[10px] font-extrabold block">
                              {booking.status === 'pending' && 'معلق مراجعة'}
                              {booking.status === 'approved' && 'نشط مستلم'}
                              {booking.status === 'completed' && 'مستلم ومكتمل'}
                              {booking.status === 'cancelled' && 'ملغي'}
                              {booking.status === 'rejected' && 'مرفوض'}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <Button size="sm" onClick={() => setCurrentBooking(booking)} className="text-[10px] py-1 px-3">
                              تغيير وإجراءات
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </Card>
          </div>
        )}

        {/* FLEET MANAGEMENT TAB */}
        {activeTab === 'fleet' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            
            {/* Header row with add btn */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">إدارة الأسطول الميداني والسيارات</h3>
                <p className="text-xs text-gray-450 mt-1">إضافة أرقام اللوحات الفيزيائية وتحديث العدادات والتعليقات الفنية بالفروع</p>
              </div>
              <Button size="sm" onClick={() => { setCurrentCar(null); setIsCarModalOpen(true); }} className="gap-2">
                <Plus className="w-4 h-4" />
                <span>إضافة سيارات للأسطول</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => {
                const model = carModels.find(m => m.id === car.modelId);
                const branch = branches.find(b => b.id === car.branchId);

                return (
                  <Card key={car.id} hoverable className="flex flex-col p-5 gap-4 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
                    
                    {/* Header: model and edit */}
                    <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
                      <div>
                        <h4 className="font-bold text-gray-950 dark:text-white leading-tight">
                          {model ? `${model.brand} ${model.name}` : 'فئة غير معرفة'}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono">سنة التصنيع: {car.year}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { setCurrentCar(car); setIsCarModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                          title="تعديل تفاصيل المركبة"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من رغبتك بشطب هذه السيارة نهائيا من سجلات الأسطول؟')) {
                              deleteCar(car.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="شطب السيارة"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-right leading-loose text-gray-650">
                      <div><strong className="text-gray-400">رقم لوحة العهدة:</strong> <span className="font-bold font-mono text-gray-900 dark:text-white text-xs block">{car.plateNumber}</span></div>
                      <div><strong className="text-gray-400">اللون المعتمد:</strong> <span className="text-gray-900 dark:text-white block">{car.color}</span></div>
                      <div><strong className="text-gray-400">قراءة العداد (كم):</strong> <span className="font-bold font-mono text-gray-900 dark:text-white block">{car.mileage} كم</span></div>
                      <div><strong className="text-gray-400">فرع الإرساء:</strong> <span className="text-gray-900 dark:text-white block">{branch ? branch.name : 'مجهول'}</span></div>
                    </div>

                    {/* Operating status badge */}
                    <div className="mt-auto pt-3 border-t border-gray-50 dark:border-gray-800/40 flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">الوضعية الحالية للعهدة:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        car.status === 'available' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        car.status === 'rented' ? 'bg-blue-600/10 text-blue-600 border border-blue-600/20' :
                        'bg-amber-600/10 text-amber-600 border border-amber-600/20'
                      }`}>
                        {car.status === 'available' ? 'شاغرة وجاهزة' :
                         car.status === 'rented' ? 'مستأخرة حالياً' : 'قيد الصيانة الدورية'}
                      </span>
                    </div>

                  </Card>
                );
              })}
            </div>

          </div>
        )}

        {/* PRICING AND BASE MULTIPLIERS TAB */}
        {activeTab === 'pricing' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">شروط وباقات المواسم التسعيرية</h3>
                <p className="text-xs text-gray-450 mt-1">تحديد فترات الذروة والمواسم السنوية السريعة ومضاعفاتها بالتاريخ</p>
              </div>
              <Button size="sm" onClick={() => { setIsPricingModalOpen(true); }} className="gap-2">
                <Plus className="w-4 h-4" />
                <span>إدراج شرط تسعيري جديد</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingRules.map((rule) => (
                <Card key={rule.id} className="p-6 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-950 dark:text-white leading-snug">{rule.name}</h4>
                      <span className="text-[10px] text-gray-400 uppercase font-mono block mt-1">نوع: {rule.type}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('هل ترغب في شطب قاعدة الأسعار الاستثنائية هذه بالكامل؟')) {
                          deletePricingRule(rule.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="p-3 bg-orange-500/5 border border-orange-500/15 rounded-xl text-center">
                    <span className="text-xs text-gray-450 block mb-0.5">ضريبة ومضاعف المواسم:</span>
                    <span className="text-xl font-black font-mono text-orange-600">x{rule.multiplier}</span>
                  </div>

                  <div className="text-[10px] text-gray-450 text-right leading-relaxed mt-2">
                    {rule.startDate && rule.endDate ? (
                      <p>صلاحية القاعدة: من <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{rule.startDate}</span> إلی <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{rule.endDate}</span></p>
                    ) : (
                      <p>القاعدة دائمة وتطبق على طوال أيام السنة للموديلات المستهدفة</p>
                    )}
                  </div>

                </Card>
              ))}
            </div>

            {/* Model pricing tier editor */}
            <div className="border-t border-gray-150 dark:border-gray-800 pt-8 mt-6">
              <div className="mb-6 text-right">
                <h4 className="text-lg font-bold text-gray-950 dark:text-white">باقات تسعير الفئات والمدد (أسبوعي / شهري)</h4>
                <p className="text-xs text-gray-450 mt-1">تعديل التسعير الأساسي لكل فئة سيارات بناءً على مدة الإيجار لتقديم خصومات تلقائية للمدد الطويلة (أسبوعي أو شهري)</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {carModels.map((model) => (
                  <ModelPricingCard key={model.id} model={model} />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SYSTEM SETTINGS CONFIGURATION TAB */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200 max-w-xl">
            <Card className="p-8 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
              <h3 className="font-bold text-gray-950 dark:text-white text-lg mb-6 border-b pb-4 dark:border-gray-800">إعدادات وقواعد النظام الإداري</h3>
              
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 text-right">
                
                <Input
                  label="رسم ضريبة الاستئجار والقيمة المضافة المباشرة (%)"
                  type="number"
                  value={taxInput}
                  onChange={(e) => setTaxInput(e.target.value)}
                />

                <Input
                  label="رسوم حماية درع التأمين الشامل لليوم الواحد (ريال)"
                  type="number"
                  value={insFeeInput}
                  onChange={(e) => setInsFeeInput(e.target.value)}
                />

                <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <ToggleSwitch
                    label="السماح بتسليم وإرجاع السيارة في فروع مدن أخرى"
                    checked={allowIntercity}
                    onChange={(checked) => setAllowIntercity(checked)}
                  />

                  {allowIntercity && (
                    <Input
                      label="رسوم خدمة التسليم الذكي بين الفروع (شحنة الإرجاع - ريال)"
                      type="number"
                      value={intercityFeeInput}
                      onChange={(e) => setIntercityFeeInput(e.target.value)}
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-150 dark:border-gray-850 mt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { refreshData(); }}>
                    إعادة تعيين
                  </Button>
                  <Button type="submit" className="flex-1">
                    مزامنة وحفظ التكوينات الإدارية
                  </Button>
                </div>

              </form>

            </Card>
          </div>
        )}

        {/* ANALYTICS REPORTS SUMMARY TAB */}
        {activeTab === 'reports' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">تقارير وإحصائيات الأداء والأرباح</h3>
                <p className="text-xs text-gray-450 mt-1">معاينة نسب الإنجاز والإشغال الفعلي للسيارات ومناطق النشاط المالي</p>
              </div>
            </div>

            {loadingReports || !reports ? (
              <div className="flex justify-center p-20">
                <svg className="animate-spin h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Branch occupancy visual index */}
                <Card className="lg:col-span-6 p-6 bg-white dark:bg-gray-850 border border-gray-150 space-y-4">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white border-r-4 border-orange-500 pr-2">نسب تفاعل فروع الإيجار</h4>
                  
                  <div className="space-y-4 font-semibold text-xs text-gray-650">
                    {reports.branchPerformance && reports.branchPerformance.map((bp: any, idx: number) => {
                      const totalBookingsCount = bookings.length || 1;
                      const percentage = Math.round((bp.bookingsCount / totalBookingsCount) * 100);
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between">
                            <span>{bp.branchName}</span>
                            <span className="font-mono text-orange-600">{bp.bookingsCount} عملية ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* 2. Occupancy summary */}
                <Card className="lg:col-span-6 p-6 bg-white dark:bg-gray-850 border border-gray-150 space-y-4">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white border-r-4 border-orange-500 pr-2">أرقام وإحصاءات الأمان والتشغيل</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 rounded-xl">
                      <span className="text-gray-400 block mb-1">نسبة إشغال الأسطول الميداني:</span>
                      <span className="text-lg font-black font-mono text-gray-900 dark:text-white">
                        {Math.round((cars.filter(c => c.status === 'rented').length / (cars.length || 1)) * 100)} %
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 rounded-xl">
                      <span className="text-gray-400 block mb-1">متوسط المدة لكل حجز:</span>
                      <span className="text-lg font-black font-mono text-gray-900 dark:text-white">
                        ٣ أيام تقريباً
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 rounded-xl">
                      <span className="text-gray-400 block mb-1">السيارات قيد الصيانة الفنية:</span>
                      <span className="text-lg font-black font-mono text-amber-600">
                        {cars.filter(c => c.status === 'maintenance').length} سيارات
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 rounded-xl">
                      <span className="text-gray-400 block mb-1">العملاء النشِطين بالنظام:</span>
                      <span className="text-lg font-black font-mono text-gray-900 dark:text-white">
                        +١٢٠ عميل مسجل
                      </span>
                    </div>
                  </div>
                </Card>

              </div>
            )}

          </div>
        )}

        {/* EVENTS LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <Card className="p-6 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-850">
              <h3 className="font-bold text-gray-950 dark:text-white text-md mb-4 border-b pb-3 dark:border-gray-800">سجل فعاليات الموظفين والتدقيق الأمني</h3>
              
              {loadingLogs ? (
                <div className="flex justify-center py-20">
                  <svg className="animate-spin h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : (
                <div className="flex flex-col gap-3 font-medium text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-750 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-orange-600">⚡</span>
                        <span>{log.action}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-center py-8 text-gray-400">سجل الفعاليات نظيف وفارغ.</p>
                  )}
                </div>
              )}

            </Card>
          </div>
        )}

      </main>

      {/* Floating active modals layout */}
      {currentBooking && (
        <Modal
          isOpen={!!currentBooking}
          onClose={() => setCurrentBooking(null)}
          title="معاينة تفاصيل وبيانات الحجز الإجرائية"
          size="lg"
        >
          <BookingDetailsModal
            booking={currentBooking}
            isOpen={!!currentBooking}
            onClose={() => setCurrentBooking(null)}
          />
        </Modal>
      )}

      {isCarModalOpen && (
        <Modal
          isOpen={isCarModalOpen}
          onClose={() => { setIsCarModalOpen(false); setCurrentCar(null); }}
          title={currentCar ? 'تحديث وتعديل سيارة بأسطول مسارات' : 'أضف سيارة مادية شاغرة للأسطول'}
          size="md"
        >
          <CarFormModal
            car={currentCar}
            onClose={() => { setIsCarModalOpen(false); setCurrentCar(null); }}
          />
        </Modal>
      )}

      {isPricingModalOpen && (
        <Modal
          isOpen={isPricingModalOpen}
          onClose={() => { setIsPricingModalOpen(false); }}
          title="إضافة وتفعيل باقة تسعير مواسم ومناسبات"
          size="md"
        >
          <CarModelFormModal
            onClose={() => { setIsPricingModalOpen(false); }}
          />
        </Modal>
      )}

    </div>
  );
};

export default AdminLayout;
