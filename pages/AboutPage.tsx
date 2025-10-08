
import React from 'react';
import Card from '../components/ui/Card';

const AboutPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-center">عن مسارات لتأجير السيارات</h1>
      <Card className="p-8 space-y-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-orange-600">رؤيتنا</h2>
        <p className="text-gray-600 leading-relaxed">
          أن نكون الخيار الأول والأكثر ثقة في قطاع تأجير السيارات في المملكة العربية السعودية، من خلال تقديم تجربة استثنائية تفوق توقعات عملائنا.
        </p>
        <h2 className="text-2xl font-bold text-orange-600">رسالتنا</h2>
        <p className="text-gray-600 leading-relaxed">
          نلتزم بتوفير أسطول سيارات حديث ومتنوع، وتقديم خدمات عالية الجودة بأسعار تنافسية، مع التركيز على سهولة الإجراءات وسرعة الخدمة لضمان راحة عملائنا ورضاهم التام في كل رحلة.
        </p>
         <h2 className="text-2xl font-bold text-orange-600">قيمنا</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>العميل أولاً:</strong> رضا العميل هو محور اهتمامنا.</li>
            <li><strong>المصداقية:</strong> الوضوح والشفافية في جميع تعاملاتنا.</li>
            <li><strong>الجودة:</strong> نحرص على تقديم أعلى معايير الجودة في سياراتنا وخدماتنا.</li>
            <li><strong>الابتكار:</strong> نسعى دائمًا لتطوير خدماتنا باستخدام أحدث التقنيات.</li>
        </ul>
      </Card>
    </div>
  );
};

export default AboutPage;
