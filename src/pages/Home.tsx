import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../context/BookingContext';
import FeaturedCars from '../components/common/FeaturedCars';
import AvailableCarsCarousel from '../components/common/AvailableCarsCarousel';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Button } from '../components/ui/Button';
import { Sparkles, Calendar, Car, ShieldCheck, Zap, Users, ArrowUpRight } from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const { branches, carModels } = useBookings();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'كيف يمكنني إنهاء طلب حجز سيارة عبر مسارات؟',
      a: 'ببساطة شديدة! تصفح طرازات وفئات سياراتنا الفاخرة والعملية، حدد فرع وتواريخ الاستلام والتسليم المرغوبة، واضغط "تأكيد الحجز". سيتم إرسال طلبك فوراً لمشرف الفرع للمراجعة والقبول.'
    },
    {
      q: 'هل يشمل السعر المعلن درع التأمين الشامل وضريبة القيمة المضافة؟',
      a: 'تلتزم مسارات بالشفافية الكاملة. يشمل حساب الفواتير إمكانية اختيار درع التأمين الشامل لراحة بالك الكاملة، ويتم احتساب ضريبة القيمة المضافة الإدارية (١٥٪) بالتفصيل التام قبل الدفع، دون أي رسوم مخفية عند الاستلام.'
    },
    {
      q: 'هل يتوفر لديكم خدمة تسليم السيارة في مدينة أخرى؟',
      a: 'نعم بالتأكيد! تتيح ميزة الإرجاع الذكي بين المدن في مسارات استلام السيارة من أي من فروعنا وتسليمها بأمان في فرع مدينة أخرى، ويتم تقدير رسوم رمزية مرنة مقابل هذه الميزة من الإعدادات التفاعلية.'
    }
  ];

  return (
    <div className="w-full flex flex-col overflow-hidden pb-10">
      
      {/* 1. Immersive Hero Banner */}
      <section className="relative min-h-[85vh] flex items-center bg-gray-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        
        {/* Deep ambient grid overlay */}
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.25] pointer-events-none transition-all duration-700 select-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent pointer-events-none"></div>

        {/* Content Wrapper */}
        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Slogan details column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-right animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/35 rounded-xl w-max text-orange-500 text-xs font-bold font-mono tracking-wide">
              {/* Micro decoration banner */}
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
              <span>مستقبل التنقل في المملكة العربية السعودية</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              عيش متعة الرحلة مع <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">مسارات</span>
            </h1>

            <p className="text-gray-450 text-base sm:text-lg max-w-2xl leading-relaxed">
              نوفر لك أحدث أسطول متكامل للسيارات الفاخرة، العائلية، والسيارات الصديقة للبيئة في كافة مدن ومطارات المملكة وبأسعار تفاعلية ممتازة، بدعم ذكي وخدمة متواصلة على مدار الساعة لشعور دائم بالأمان والراحة التامة.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mt-4">
              <a href="#available-fleet">
                <Button size="lg" className="gap-2.5 shadow-xl shadow-orange-600/30 font-bold px-8">
                  <span>تصفح الأسطول المتاح</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#who-we-are">
                <Button size="lg" variant="outline" className="border-gray-700 hover:border-gray-500 text-white font-bold px-8 bg-transparent">
                  من نحن؟
                </Button>
              </a>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-8 mt-10 border-t border-gray-800 pt-8 max-w-xl">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-orange-500 font-mono">+٣٠٠</span>
                <p className="text-xs text-gray-500 mt-1">سيارة حديثة ومجهزة</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-orange-500 font-mono">١٠٠٪</span>
                <p className="text-xs text-gray-500 mt-1">تأمين شامل بالكامل</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-orange-500 font-mono">+٥ فروع</span>
                <p className="text-xs text-gray-500 mt-1">في جميع أرجاء المملكة</p>
              </div>
            </div>

          </div>

          {/* Minimal visual image card */}
          <div className="lg:col-span-5 hidden lg:flex justify-end animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="relative p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-orange-500/5 group">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600"
                alt="Masarat Premium Fleet"
                className="w-full max-w-md h-96 object-cover rounded-xl brightness-90 group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 right-6 text-right">
                <span className="text-2xl font-black text-amber-500 font-mono">Porsche Taycan 4S</span>
                <p className="text-xs text-gray-400 mt-1">فئة السيارات الكهربائية الفاخرة</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Characteristics Bento Grid */}
      <section id="who-we-are" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/10 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-widest">مزايا استثنائية تفوق التوقعات</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white mt-2">لماذا يفضل مئات العملاء مسارات؟</h2>
              <p className="text-md text-gray-400 mt-2">نهتم بأدق التفاصيل التشغيلية ونسرع إتمام الإجراءات بخيارات دفع الكترونية آمنة ودعم مستمر لراحتك المطلقة</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RevealOnScroll delay={100}>
              <div className="p-8 bg-white dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:border-orange-500/15">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">سرعة قصوى للحجز</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  يمكنك إنهاء واختيار سيارتك المحببة وتأكيد تواريخ حجزها بكبسة زر واحدة، مع موافقة مباشرة وفورية من مشرفي الفروع.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="p-8 bg-white dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:border-orange-500/15">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">أمان وثقة تامة</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  كل أسطول فريد من نوعه، مجهز بأعلى مستويات الصيانة المعتمدة ومع برامج حماية وتأمين كامل وبطاقات تشغيل مرخصة.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="p-8 bg-white dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:border-orange-500/15">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">أسطول حديث وفئات متنوعة</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  سواء كنت بحاجة لسيارة بورشه كهربائية فاخرة أو تويوتا لاندكروزر للمهام العائلية الدقيقة، نوفر الموديل المناسب لك بأبهى حلة.
                </p>
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </section>

      {/* 3. Featured Cars list segment */}
      <FeaturedCars />

      {/* 4. Complete Catalog of models with Branch Select controls */}
      <div id="available-fleet">
        <AvailableCarsCarousel />
      </div>

      {/* 5. Frequently Asked Accordion FAQs */}
      <section className="py-20 bg-white dark:bg-gray-900/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white">الأسئلة الشائعة ومخاوف العملاء</h2>
              <p className="text-sm text-gray-400 mt-1">نجيب بكل حب وشفافية لأهم التساؤلات المتكررة حول شروط تأجير مسارات</p>
            </div>
          </RevealOnScroll>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-850 text-right font-bold text-gray-900 dark:text-white outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-orange-600 dark:text-orange-500 font-mono text-xl">{activeFaq === idx ? '−' : '＋'}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-350 bg-white dark:bg-gray-900 border-t border-gray-150 dark:border-gray-800 animate-in fade-in duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
