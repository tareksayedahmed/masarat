import React, { useState } from 'react';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Title */}
      <RevealOnScroll>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-widest">تواصل تفاعلي فوري</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white leading-tight mt-1">
            يسعدنا الإجابة عن استفساراتك
          </h1>
          <p className="text-gray-500 dark:text-gray-450 text-sm mt-2">
            فريق رعاية عملاء مسارات متواجد على مدار الساعة لتقديم الدعم والمساندة وضمان أن تكون رحلاتكم خالية من أي عقبات.
          </p>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <RevealOnScroll delay={100}>
            <Card className="p-8 bg-gray-900 border border-gray-800 text-gray-400 space-y-8 h-full">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">معلومات مكتب الاتصال</h3>
                <p className="text-xs">نسعد بتوجيه استفسارك للقسم المختص لمتابعتك الفورية.</p>
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/15 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold leading-none">رقم الاتصال الموحد</h4>
                    <p className="dir-ltr text-xs text-gray-400 mt-2 text-right">+966 9200 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/15 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold leading-none">مراسلة الدعم والشكاوى</h4>
                    <p className="text-xs text-gray-400 mt-2">support@masarat.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/15 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold leading-none">ساعات عمل الإدارة</h4>
                    <p className="text-xs text-gray-400 mt-2">من الأحد إلى الخميس: ٩:٠٠ صباحاً إلى ٥:٠٠ مساءً</p>
                  </div>
                </div>
              </div>
            </Card>
          </RevealOnScroll>
        </div>

        {/* Contact Form Formular (col-span-7) */}
        <div className="lg:col-span-7">
          <RevealOnScroll delay={200}>
            <Card className="p-8 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-950 dark:text-white">وصلت رسالتك بنجاح!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-450 max-w-sm leading-relaxed">
                    نشكرك للتواصل مع شبكة مسارات. سيقوم أحد موظفي رعاية العملاء بالتواصل معك والرد عبر البريد الإلكتروني أو الهاتف خلال ٢٤ ساعة القادمة.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4">
                    إرسال استفسار جديد
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">أرسل لنا استفسارا سريعا</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="الاسم الكامل"
                      required
                      placeholder="أحمد محمد"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      required
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-left dir-ltr"
                    />
                  </div>

                  <Input
                    label="رقم الجوال لتسريع التواصل"
                    type="tel"
                    placeholder="+966 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-left dir-ltr"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نص الرسالة أو مسألة الدعم:</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="يرجى كتابة تفاصيل استفسارك ومواصفات السيارت المرغوبة بدقة..."
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm placeholder:text-gray-400"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <Button type="submit" loading={loading} className="mt-2 w-full sm:w-auto self-start gap-2">
                    <Send className="w-4 h-4 transform rotate-180" />
                    <span>إرسال الرسالة الآن</span>
                  </Button>
                </form>
              )}
            </Card>
          </RevealOnScroll>
        </div>

      </div>

    </div>
  );
};

export default Contact;
