import React, { createContext, useState, useContext, useEffect, PropsWithChildren, useCallback } from 'react';

// Embedded locales for simplicity in this environment
const translations = {
  ar: {
    // Header
    home: 'الرئيسية',
    branch_cars: 'سيارات الفروع',
    about_company: 'عن الشركة',
    contact_us: 'اتصل بنا',
    my_bookings: 'حجوزاتي',
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    // Profile Page
    my_profile: 'صفحتي الشخصية',
    personal_info: 'معلوماتي الشخصية',
    settings: 'الإعدادات',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    no_bookings_yet: 'لا توجد لديك حجوزات حالياً.',
    status: 'الحالة',
    total: 'الإجمالي',
    from: 'من',
    to: 'إلى',
    cancel_booking: 'إلغاء الحجز',
    edit_booking: 'تعديل الحجز',
    time_left_to_cancel_edit: 'الوقت المتبقي للإلغاء/التعديل',
    modification_time_ended: 'انتهى الوقت المسموح به للإلغاء أو التعديل',
    // Settings
    app_settings: 'إعدادات التطبيق',
    dark_mode: 'الوضع الداكن',
    dark_mode_desc: 'قم بتفعيل الوضع الداكن لراحة عينيك.',
    language: 'اللغة',
    language_desc: 'اختر لغة العرض المفضلة لديك.',
    arabic: 'العربية',
    english: 'English',
    status_pending: 'قيد الانتظار',
    status_confirmed: 'مؤكد',
    status_active: 'جاري الإيجار',
    status_completed: 'مكتمل',
    status_cancelled: 'ملغي',
  },
  en: {
    // Header
    home: 'Home',
    branch_cars: 'Branch Cars',
    about_company: 'About Us',
    contact_us: 'Contact Us',
    my_bookings: 'My Bookings',
    dashboard: 'Dashboard',
    logout: 'Logout',
    login: 'Login',
    // Profile Page
    my_profile: 'My Profile',
    personal_info: 'Personal Info',
    settings: 'Settings',
    name: 'Name',
    email: 'Email',
    no_bookings_yet: 'You have no bookings yet.',
    status: 'Status',
    total: 'Total',
    from: 'From',
    to: 'To',
    cancel_booking: 'Cancel Booking',
    edit_booking: 'Edit Booking',
    time_left_to_cancel_edit: 'Time left to cancel/edit',
    modification_time_ended: 'The allowed time for cancellation or modification has ended.',
    // Settings
    app_settings: 'Application Settings',
    dark_mode: 'Dark Mode',
    dark_mode_desc: 'Activate dark mode for a more comfortable view.',
    language: 'Language',
    language_desc: 'Choose your preferred display language.',
    arabic: 'العربية',
    english: 'English',
    status_pending: 'Pending',
    status_confirmed: 'Confirmed',
    status_active: 'Active',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
  }
};

type Language = 'ar' | 'en';
export type TranslationKey = keyof typeof translations.ar;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const storedLang = window.localStorage.getItem('language') as Language | null;
      return storedLang || 'ar';
    } catch {
      return 'ar';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem('language', language);
    } catch (e) {
      console.error("Failed to save language to localStorage", e);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
