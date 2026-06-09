import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* About column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-lg">
              م
            </div>
            <span className="text-xl font-bold text-white select-none">مسارات</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            شركة مسارات لتأجير السيارات هي الخيار الأمثل والحل الشامل لاحتياجات تنقلك بأمان وراحة تامة في كافة أنحاء المملكة العربية السعودية.
          </p>
          <div className="flex items-center gap-2 text-xs text-orange-500 font-bold bg-orange-950/20 px-3 py-1.5 rounded-lg border border-orange-500/25 w-max">
            <ShieldCheck className="w-4 h-4" />
            <span>مرخصة من الهيئة العامة للنقل</span>
          </div>
        </div>

        {/* Dynamic Branches address */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-md border-r-4 border-orange-500 pr-3">
            الفروع الرئيسية
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">فرع الرياض</p>
                <p className="text-xs text-gray-500">مطار الملك خالد الدولي، الصالة رقم 3</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 font-medium">فرع جدة</p>
                <p className="text-xs text-gray-500">طريق الملك عبدالعزيز، حي الشاطئ</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Quick Contacts column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-md border-r-4 border-orange-500 pr-3">
            اتصل بنا
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="dir-ltr text-gray-300">+966 9200 12345</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="text-gray-300">support@masarat.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="text-gray-300">خدمة عملاء ممتازة على مدار 24 ساعة</span>
            </li>
          </ul>
        </div>

        {/* App stats simplified */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-md border-r-4 border-orange-500 pr-3">
            لماذا مسارات؟
          </h4>
          <p className="text-sm">
            نوفر لكم أكثر من 300 سيارة حديثة مجهزة بالكامل بأسعار مرنة تتناسب مع احتياجات رحلتك اليومية أو الطويلة.
          </p>
          <div className="text-xs text-gray-500 pt-2 leading-loose">
            • حجز فوري مبسط بكبسة زر<br/>
            • صيانة وقائية دورية معتمدة<br/>
            • خدمة تسليم واستلام بين فروع المدن
          </div>
        </div>

      </div>

      {/* Copy footer */}
      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
        <div>
          © {new Date().getFullYear()} مسارات لتأجير السيارات. جميع الحقوق محفوظة لشركة مسارات المحدودة.
        </div>
        <div className="flex items-center gap-1.5">
          <span>صنع بكل</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>في المملكة العربية السعودية</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
