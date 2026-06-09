import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Nav & Common
    appName: "مسارات لتأجير السيارات",
    home: "الرئيسية",
    branches: "الفروع",
    about: "من نحن",
    contact: "اتصل بنا",
    profile: "الملف الشخصي",
    adminDashboard: "لوحة التحكم",
    fleet: "الأسطول",
    bookings: "الحجوزات",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    register: "حساب جديد",
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    search: "بحث",
    all: "الكل",
    status: "الحالة",
    actions: "الإجراءات",
    unauthorized: "غير مصرح لك بالدخول",

    // Home Page
    heroTitle: "مساراتك أسهل مع سياراتنا",
    heroSubtitle: "نوفر لك أفضل السيارات وأحدث الموديلات بأسعار تنافسية وخدمة عملاء على مدار الساعة.",
    findCar: "ابحث عن سيارتك الآن",
    pickupBranch: "فرع الاستلام",
    dropoffBranch: "فرع التسليم",
    pickupDate: "تاريخ الاستلام",
    dropoffDate: "تاريخ التسليم",
    searchCarsButton: "ابحث عن سيارات متوفرة",
    featuredCars: "سيارات مميزة",
    featuredSubtitle: "اختر من بين تشكيلة واسعة من السيارات التي تناسب احتياجاتك",

    // Cars & Booking
    pricePerDay: "ريال / يوم",
    seatCount: "مقاعد",
    transmissionType: "ناقل الحركة",
    fuelType: "نوع الوقود",
    automatic: "أوتوماتيك",
    manual: "يدوي",
    gasoline: "بنزين",
    hybrid: "هجين",
    electric: "كهربائي",
    diesel: "ديزل",
    bookNow: "احجز الآن",
    bookingSummary: "ملخص الحجز",
    rentalPeriod: "مدة الإيجار",
    days: "أيام",
    subtotal: "المجموع الفرعي",
    tax: "الضريبة والرسوم (15%)",
    totalPrice: "السعر الإجمالي",
    confirmBooking: "تأكيد الحجز",
    bookingSuccess: "تم الحجز بنجاح! رقم الحجز هو:",
    noCarsAvailable: "لا توجد سيارات متوفرة حالياً في هذا الفرع.",

    // Admin Dashboard
    adminTitle: "لوحة إدارة مسارات",
    totalBookings: "إجمالي الحجوزات",
    activeRentals: "الإيجارات النشطة",
    maintenanceCars: "سيارات في الصيانة",
    revenue: "الإيرادات الإجمالية",
    recentBookings: "آخر الحجوزات",
    sysLogs: "سجل العمليات",
    pricingRules: "إدارة الأسعار",
    reports: "التقارير",
    settings: "الإعدادات",
    branchAdminName: "مشرف الفرع",
    operatorName: "موظف التشغيل",
    headAdminName: "المدير العام",
  },
  en: {
    // Nav & Common
    appName: "Masarat Car Rental",
    home: "Home",
    branches: "Branches",
    about: "About Us",
    contact: "Contact Us",
    profile: "Profile",
    adminDashboard: "Admin Dashboard",
    fleet: "Fleet",
    bookings: "Bookings",
    login: "Login",
    logout: "Logout",
    register: "Register",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    all: "All",
    status: "Status",
    actions: "Actions",
    unauthorized: "Unauthorized Access",

    // Home Page
    heroTitle: "Your Journeys Made Easier With Our Cars",
    heroSubtitle: "We provide the best cars and latest models at competitive rates with 24/7 customer support.",
    findCar: "Find Your Car Now",
    pickupBranch: "Pickup Branch",
    dropoffBranch: "Dropoff Branch",
    pickupDate: "Pickup Date",
    dropoffDate: "Dropoff Date",
    searchCarsButton: "Search Available Cars",
    featuredCars: "Featured Cars",
    featuredSubtitle: "Choose from our wide collection of vehicles tailormade for you",

    // Cars & Booking
    pricePerDay: "SAR / Day",
    seatCount: "Seats",
    transmissionType: "Transmission",
    fuelType: "Fuel Type",
    automatic: "Automatic",
    manual: "Manual",
    gasoline: "Gasoline",
    hybrid: "Hybrid",
    electric: "Electric",
    diesel: "Diesel",
    bookNow: "Book Now",
    bookingSummary: "Booking Summary",
    rentalPeriod: "Rental Period",
    days: "Days",
    subtotal: "Subtotal",
    tax: "Tax & Fees (15%)",
    totalPrice: "Total Price",
    confirmBooking: "Confirm Booking",
    bookingSuccess: "Booking confirmed successfully! Booking ID:",
    noCarsAvailable: "No vehicles available at this branch right now.",

    // Admin Dashboard
    adminTitle: "Masarat Admin Dashboard",
    totalBookings: "Total Bookings",
    activeRentals: "Active Rentals",
    maintenanceCars: "Cars in Maintenance",
    revenue: "Total Revenue",
    recentBookings: "Recent Bookings",
    sysLogs: "System Logs",
    pricingRules: "Pricing Rules",
    reports: "Reports",
    settings: "Settings",
    branchAdminName: "Branch Admin",
    operatorName: "Operator",
    headAdminName: "Head Admin",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  const isRtl = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
