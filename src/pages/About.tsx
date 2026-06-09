import React from 'react';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Card } from '../components/ui/Card';
import { Bookmark, Sparkles, Award, Shield, Eye, Target } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Visual Header Banner */}
      <RevealOnScroll>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>رواية فخر وإنجاز سعودي</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white leading-tight">
            عن مسارات لتأجير السيارات
          </h1>
          <p className="text-md text-gray-500 dark:text-gray-450 mt-2">
            تأسست شركة مسارات المحدودة برؤية تفاعلية حديثة لتسريع وتحسين تجارب تنقل الأفراد والعائلات، لنكون الداعم التشغيلي الأول لرحلاتك وسياحتك داخل المملكة.
          </p>
        </div>
      </RevealOnScroll>

      {/* Grid: Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <RevealOnScroll delay={100}>
          <Card className="p-8 flex flex-col gap-4 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-500 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-950 dark:text-white">رؤيتنا المكللة</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              أن نكون الخيار الرقمي والتنفيذي الأكثر ملاءمة وثقة لتأجير السيارات في المملكة العربية السعودية، عبر دمج تقنيات الذكاء الاصطناعي الصاعدة والمرونة العالية لتوفير أسلوب حياة استثنائي يتماشى بالكامل مع تطلعات رؤية السعودية ٢٠٣٠.
            </p>
          </Card>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <Card className="p-8 flex flex-col gap-4 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-500 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-950 dark:text-white">رسالتنا الفاعلة</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              توفير أسطول سيارات آمن ومتنوع ومعزز بأقوى برامج الحماية وتأمين استلام فوري رقمي، لتعزيز راحة عملائنا اليومية، ومرافقهم المهنية والترفيهية بقيم النزاهة والريادة والتنافسية العادلة.
            </p>
          </Card>
        </RevealOnScroll>
      </div>

      {/* Values Timeline */}
      <section className="py-8">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">الركائز الأساسية لشركة مسارات</h2>
            <p className="text-xs text-gray-400 mt-1">المبادئ الثابتة التي نقيم عليها جودة أعمالنا وعلاقتنا الممتدة مع المستأجرين وباقي الهيئات</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center font-bold">
              ١
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">النزاهة التامة</h4>
            <span className="text-xs text-gray-500">حسابات دقيقة وشفافة دون رسوم إدارية مفاجئة أو غرامات مستترة.</span>
          </Card>

          <Card className="p-6 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center font-bold">
              ٢
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">التطوير الرقمي المستمر</h4>
            <span className="text-xs text-gray-500">مساعد حجز قائم بالذكاء الاصطناعي وبطاقات تقفيل رحلة بالكامل دون استخدام ورق.</span>
          </Card>

          <Card className="p-6 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center font-bold">
              ٣
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">البيئة والاستدامة</h4>
            <span className="text-xs text-gray-500">ندعم التحول الأخضر بتوفير سيارات هجينة وكهربائية بكفاءة بطارية عالية.</span>
          </Card>
        </div>
      </section>

    </div>
  );
};

export default About;
