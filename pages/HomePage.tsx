
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import RevealOnScroll from '../components/common/RevealOnScroll';
import FeaturedCars from '../components/common/FeaturedCars';
import AvailableCarsCarousel from '../components/common/AvailableCarsCarousel';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showSubContent, setShowSubContent] = useState(false);

  const textToType = ["أفضل تجربة تأجير", "أسطول متنوع وحديث", "أسعار لا تقبل المنافسة"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % textToType.length;
      const fullText = textToType[i];

      setTypedText(
        isDeleting
          ? fullText.substring(0, typedText.length - 1)
          : fullText.substring(0, typedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 80 : 150);

      if (!isDeleting && typedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const typingTimer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimer);
  }, [typedText, isDeleting, typingSpeed, loopNum]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center rounded-xl py-24 px-8 text-center text-white min-h-[50vh] flex flex-col justify-center items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 rounded-xl"></div>
        <div className="relative z-10">
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 h-24 sm:h-16 flex items-center justify-center">
             <span className="border-r-2 border-orange-400 animate-pulse pe-1">{typedText}</span>
          </h1>
          <p className={`text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto transition-opacity duration-1000 ${showSubContent ? 'opacity-100' : 'opacity-0'}`}>
            اكتشف المملكة بكل راحة وأناقة مع أسطول سياراتنا المتنوع الذي يلبي كافة احتياجاتك.
          </p>
          <div className={`transition-all duration-1000 delay-200 ${showSubContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <Button onClick={() => navigate('/branches')} size="lg" className="animate-pulse-subtle">
               اكتشف فروعنا وابدأ الحجز
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Cars Section */}
      <RevealOnScroll>
          <section className="text-center pt-8">
             <h2 className="text-3xl font-bold mb-2">سياراتنا المميزة</h2>
             <p className="text-gray-500 mb-12">نظرة على بعض السيارات الأكثر طلباً في أسطولنا.</p>
             <FeaturedCars />
          </section>
      </RevealOnScroll>
      
      {/* Available Cars Carousel Section */}
      <RevealOnScroll>
          <section className="text-center pt-8">
             <h2 className="text-3xl font-bold mb-2">سيارات متاحة الآن في فروعنا</h2>
             <p className="text-gray-500 mb-12">احجز سيارتك المفضلة مباشرة من أقرب فرع إليك.</p>
             <AvailableCarsCarousel />
          </section>
      </RevealOnScroll>


      {/* How it works Section */}
      <section className="text-center pt-8">
        <h2 className="text-3xl font-bold mb-2">رحلتك تبدأ بثلاث خطوات بسيطة</h2>
        <p className="text-gray-500 mb-12">نظام حجز سهل وسريع مصمم لراحتك.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <RevealOnScroll delay="delay-0">
              <div className="flex flex-col items-center">
                <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">اختر الفرع</h3>
                <p className="text-gray-600">حدد المدينة والفرع الأقرب لاستلام سيارتك.</p>
              </div>
          </RevealOnScroll>
          <RevealOnScroll delay="delay-200">
              <div className="flex flex-col items-center">
                <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">اختر السيارة</h3>
                <p className="text-gray-600">تصفح أسطولنا المتنوع واختر ما يناسب احتياجك.</p>
              </div>
          </RevealOnScroll>
          <RevealOnScroll delay="delay-400">
              <div className="flex flex-col items-center">
                <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">أكمل الحجز</h3>
                <p className="text-gray-600">أدخل بياناتك وأكمل حجزك في دقائق معدودة.</p>
              </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center pt-8">
        <h2 className="text-3xl font-bold mb-2">لماذا تختار مسارات؟</h2>
        <p className="text-gray-500 mb-8">نحن نقدم أكثر من مجرد سيارة.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <RevealOnScroll>
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-2">أسطول حديث</h3>
                <p>سيارات موديل السنة مجهزة بأحدث التقنيات لراحتك وأمانك.</p>
            </Card>
          </RevealOnScroll>
          <RevealOnScroll delay="delay-200">
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-2">أسعار لا تقبل المنافسة</h3>
                <p>نقدم أفضل الأسعار والعروض المستمرة على جميع فئات السيارات.</p>
            </Card>
          </RevealOnScroll>
          <RevealOnScroll delay="delay-400">
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-2">دعم على مدار الساعة</h3>
                <p>فريقنا جاهز لمساعدتك في أي وقت وأي مكان خلال فترة الإيجار.</p>
            </Card>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default HomePage;