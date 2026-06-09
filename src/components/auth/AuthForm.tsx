import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, User, Phone, BookOpen, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        if (!name || !email || !password || !phone) {
          throw new Error('يرجى ملء جميع الحقول الإلزامية');
        }
        await register({ name, email, password, phone, licenseNumber });
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'register' && (
          <Input
            label="الاسم الكامل"
            type="text"
            required
            placeholder="أحمد محمد"
            icon={<User className="w-5 h-5" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <Input
          label="البريد الإلكتروني"
          type="email"
          required
          placeholder="example@mail.com"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-left dir-ltr"
        />

        <Input
          label="كلمة المرور"
          type="password"
          required
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-left dir-ltr"
        />

        {mode === 'register' && (
          <>
            <Input
              label="رقم الجوال"
              type="tel"
              required
              placeholder="+966 50 123 4567"
              icon={<Phone className="w-5 h-5" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-left dir-ltr"
            />

            <Input
              label="رقم رخصة القيادة (اختياري)"
              type="text"
              placeholder="DL-123456"
              icon={<BookOpen className="w-5 h-5" />}
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="text-left dir-ltr"
            />
          </>
        )}

        <Button type="submit" loading={loading} className="w-full mt-2">
          {mode === 'login' ? t('login') : t('register')}
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
        {mode === 'login' ? (
          <p>
            ليس لديك حساب؟{' '}
            <button
              onClick={() => setMode('register')}
              className="text-orange-600 dark:text-orange-500 font-bold hover:underline"
            >
              أنشئ حساباً جديداً
            </button>
          </p>
        ) : (
          <p>
            لديك حساب بالفعل؟{' '}
            <button
              onClick={() => setMode('login')}
              className="text-orange-600 dark:text-orange-500 font-bold hover:underline"
            >
              سجل دخولك الآن
            </button>
          </p>
        )}
      </div>

      {mode === 'login' && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-150 dark:border-gray-800/50 text-xs text-gray-500 dark:text-gray-450 text-right">
          <p className="font-semibold mb-1">💡 حسابات تجريبية سريعة:</p>
          <ul className="list-disc pr-4 space-y-1">
            <li><strong>المدير العام:</strong> admin@masarat.com / admin123</li>
            <li><strong>مشرف فرع:</strong> branch@masarat.com / branch123</li>
            <li><strong>موظف تشغيل:</strong> op@masarat.com / op123</li>
            <li><strong>العميل السريع:</strong> customer@masarat.com / customer123</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
