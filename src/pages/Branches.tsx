import React from 'react';
import { useBookings } from '../context/BookingContext';
import { Card } from '../components/ui/Card';
import { MapPin, Phone, Mail, Clock, Compass } from 'lucide-react';
import RevealOnScroll from '../components/common/RevealOnScroll';

export const Branches: React.FC = () => {
  const { branches, loading } = useBookings();

  const extraBranchData: { [key: string]: { schedule: string, phone: string, coords: string } } = {
    'riyadh-airport': {
      schedule: 'طوال أيام الأسبوع: على مدار ٢٤ ساعة',
      phone: '+966 11 9200 4410',
      coords: 'مطار الملك خالد الدولي، الصالة رقم ٣ ورقم ٤ الإقليمية والدولية'
    },
    'riyadh-main': {
      schedule: 'السبت - الخميس: من ٨:٠٠ صباحاً إلى ١٠:٠٠ مساءً، الجمعة: من ٤:٠٠ مساءً إلى ١٠:٠٠ مساءً',
      phone: '+966 11 9200 4420',
      coords: 'طريق الملك فهد الفرعي، حي الصحافة قرب برج رافال'
    },
    'jeddah-airport': {
      schedule: 'طوال أيام الأسبوع: على مدار ٢٤ ساعة',
      phone: '+966 12 9200 4430',
      coords: 'مطار الملك عبدالعزيز الصالة الجديدة الصالة رقم ١'
    },
    'jeddah-shati': {
      schedule: 'السبت - الخميس: من ٨:٣٠ صباحاً إلى ٩:٣٠ مساءً',
      phone: '+966 12 9200 4440',
      coords: 'طريق الميناء، حي الشاطئ قرب رد سي مول'
    },
    'dammam-airport': {
      schedule: 'طوال أيام الأسبوع: على مدار ٢٤ ساعة',
      phone: '+966 13 9200 4450',
      coords: 'مطار الملك فهد الدولي، الطابق الأرضي للخدمات والمكاتب'
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <svg className="animate-spin h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Title */}
      <RevealOnScroll>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
            <Compass className="w-4 h-4 animate-spin-subtle text-orange-500" />
            <span>نرافقكم حيثما ارتحلتم</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white leading-tight">
            فروع شبكة مسارات في المملكة
          </h1>
          <p className="text-gray-500 dark:text-gray-450 text-sm sm:text-base mt-2">
            تنتشر فروعنا في المطارات الرئيسية والمدن الكبرى لتسهيل إجراءات استلام وتسليم سيارتك المستأجرة بأي وقت وفي ثوانٍ معدودة.
          </p>
        </div>
      </RevealOnScroll>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {branches.map((branch, idx) => {
          const detail = extraBranchData[branch.id] || {
            schedule: 'طوال أيام الأسبوع: من ٩:٠٠ صباحاً إلى ٩:٠٠ مساءً',
            phone: '+966 9200 12345',
            coords: 'المملكة العربية السعودية، فرع معتمد للرحلات المريحة'
          };

          return (
            <RevealOnScroll key={branch.id} delay={idx * 100}>
              <Card hoverable className="flex flex-col h-full overflow-hidden p-6 gap-5 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
                
                {/* Branch name & Badge */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>{branch.name}</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 border border-orange-500/20`}>
                    نشط بالكامل
                  </span>
                </div>

                {/* Details body */}
                <div className="flex-grow flex flex-col gap-3.5 text-xs text-gray-600 dark:text-gray-350 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{detail.coords}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{detail.schedule}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="font-mono tracking-wider">{detail.phone}</span>
                  </div>
                </div>

                {/* Simulated Maps indicator */}
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/40 text-xs flex justify-between items-center text-orange-600">
                  <span className="font-medium hover:underline cursor-pointer">
                    عرض على خرائط Google
                  </span>
                  <Compass className="w-4 h-4 opacity-50" />
                </div>

              </Card>
            </RevealOnScroll>
          );
        })}
      </div>

    </div>
  );
};

export default Branches;
