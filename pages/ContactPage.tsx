
import React from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-center">تواصل معنا</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">معلومات التواصل</h2>
          <div className="space-y-4 text-gray-700">
            <p><strong>الرقم الموحد:</strong> 920012345</p>
            <p><strong>البريد الإلكتروني:</strong> info@masarat.com</p>
            <p><strong>ساعات العمل:</strong> يومياً من 09:00 صباحاً حتى 11:00 مساءً</p>
          </div>
        </Card>
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">أرسل لنا رسالة</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('شكراً لك، تم إرسال رسالتك بنجاح!'); }}>
            <Input label="الاسم" type="text" placeholder="اسمك الكامل" required />
            <Input label="البريد الإلكتروني" type="email" placeholder="email@example.com" required />
            <Input label="الموضوع" type="text" placeholder="موضوع الرسالة" required />
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">رسالتك</label>
                <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="اكتب رسالتك هنا..."
                    required
                ></textarea>
            </div>
            <Button type="submit" className="w-full">إرسال الرسالة</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
