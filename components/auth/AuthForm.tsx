
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

// SVG Icons for Social Login & Success
const GoogleIcon = () => (
    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
    </svg>
);

const FacebookIcon = () => (
    <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
    </svg>
);

const SuccessIcon = () => (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    </div>
);


interface AuthFormProps {
    onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const { login, register, forgotPassword, loginWithProvider } = useAuth();
    const [view, setView] = useState<'login' | 'signup' | 'forgotPassword' | 'forgotPasswordSuccess'>('login');
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const isSignUp = view === 'signup';

    const handleLoginOrRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (isSignUp) {
            // Registration logic
            if (password !== confirmPassword) {
                setError('كلمتا المرور غير متطابقتين.');
                setIsLoading(false);
                return;
            }
            if (!name) {
                setError('الاسم مطلوب.');
                setIsLoading(false);
                return;
            }
            const success = await register(name, email, password);
            if (success) {
                onSuccess();
            } else {
                setError('هذا البريد الإلكتروني مسجل بالفعل أو حدث خطأ ما.');
            }
        } else {
            // Login logic
            const success = await login(email, password);
            if (success) {
                onSuccess();
            } else {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
            }
        }
        setIsLoading(false);
    };
    
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) {
            setError('الرجاء إدخال البريد الإلكتروني.');
            return;
        }
        setIsLoading(true);
        const success = await forgotPassword(email);
        setIsLoading(false);
        if (success) {
            setView('forgotPasswordSuccess');
        } else {
            setError('حدث خطأ ما. لم نتمكن من العثور على حساب بهذا البريد الإلكتروني.');
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        setError('');
        setIsLoading(true);
        const success = await loginWithProvider(provider);
        if (success) {
            onSuccess();
        } else {
            setError(`فشل تسجيل الدخول باستخدام ${provider}.`);
        }
        setIsLoading(false);
    };
    
    if (view === 'forgotPasswordSuccess') {
        return (
            <div className="text-center space-y-4">
                <SuccessIcon />
                <h3 className="text-xl font-bold text-gray-800">تم الإرسال بنجاح</h3>
                <p className="text-gray-600">تم إرسال رابط استعادة كلمة المرور إلى <strong>{email}</strong>. الرجاء التحقق من صندوق الوارد الخاص بك (والبريد المزعج).</p>
                <Button onClick={onSuccess} className="w-full">إغلاق</Button>
            </div>
        );
    }
    
    if (view === 'forgotPassword') {
        return (
            <div className="space-y-4">
                <p className="text-center text-gray-600">أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.</p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <Input 
                        label="البريد الإلكتروني"
                        type="email" 
                        placeholder="example@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                    </Button>
                </form>
                <p className="text-center text-sm">
                    <button onClick={() => { setView('login'); setError('') }} className="font-medium text-orange-600 hover:text-orange-500">
                        العودة لتسجيل الدخول
                    </button>
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Social logins */}
            <div className="space-y-3">
                 <button type="button" onClick={() => handleSocialLogin('google')} disabled={isLoading} className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50">
                    <GoogleIcon />
                    <span className="ms-3">المتابعة باستخدام Google</span>
                </button>
                 <button type="button" onClick={() => handleSocialLogin('facebook')} disabled={isLoading} className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm bg-[#1877F2] text-white hover:bg-[#166fe5] font-medium transition-colors disabled:opacity-50">
                    <FacebookIcon />
                    <span className="ms-3">المتابعة باستخدام Facebook</span>
                </button>
            </div>
            
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">أو</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <form onSubmit={handleLoginOrRegister} className="space-y-4">
                {isSignUp && (
                    <Input 
                        label="الاسم الكامل"
                        type="text" 
                        placeholder="الاسم الكامل" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <Input 
                    label="البريد الإلكتروني"
                    type="email" 
                    placeholder="example@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input 
                    label="كلمة المرور"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                 {isSignUp && (
                    <Input 
                        label="تأكيد كلمة المرور"
                        type="password" 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                )}

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'جاري التحميل...' : (isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول')}
                </Button>
            </form>

            <p className="text-center text-sm">
                {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
                <button onClick={() => {setView(isSignUp ? 'login' : 'signup'); setError('')}} className="font-medium text-orange-600 hover:text-orange-500 ms-1">
                    {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                </button>
            </p>
            {!isSignUp && (
                 <p className="text-center text-sm">
                    <button type="button" onClick={() => { setView('forgotPassword'); setError(''); }} className="font-medium text-gray-500 hover:text-orange-500">
                        هل نسيت كلمة المرور؟
                    </button>
                </p>
            )}
        </div>
    );
};

export default AuthForm;
