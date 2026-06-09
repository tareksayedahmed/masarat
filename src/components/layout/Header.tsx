import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AuthForm } from '../auth/AuthForm';
import { Menu, X, Sun, Moon, Globe, LogIn, LogOut, User, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, isAuthOpen, setIsAuthOpen } = useAuth();
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggleLang = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" onClick={() => setIsOpenMenu(false)}>
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors">
            {t('home')}
          </Link>
          <Link to="/branches" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors">
            {t('branches')}
          </Link>
          <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors">
            {t('about')}
          </Link>
          <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition-colors">
            {t('contact')}
          </Link>
        </nav>

        {/* Utility Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-350 transition-colors"
            title={language === 'ar' ? 'English' : 'العربية'}
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-350 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {user.role !== 'customer' && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2 border-orange-500/30 text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>لوحة التحكم</span>
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <button className="flex items-center gap-2 p-1.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-750 transition-all">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                    {user.name[0]}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{user.name.split(' ')[0]}</span>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-950/15 text-gray-500 hover:text-red-600 transition-colors"
                title={t('logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Button size="sm" className="gap-2" onClick={() => setIsAuthOpen(true)}>
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </Button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme */}
          <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-600 dark:text-gray-300">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language */}
          <button onClick={toggleLang} className="p-2 text-gray-600 dark:text-gray-300">
            <Globe className="w-5 h-5" />
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 text-gray-600 dark:text-gray-350 transition-colors"
          >
            {isOpenMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpenMenu && (
        <div className="md:hidden border-t border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsOpenMenu(false)} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-white font-medium text-right">
            {t('home')}
          </Link>
          <Link to="/branches" onClick={() => setIsOpenMenu(false)} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-white font-medium text-right">
            {t('branches')}
          </Link>
          <Link to="/about" onClick={() => setIsOpenMenu(false)} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-white font-medium text-right">
            {t('about')}
          </Link>
          <Link to="/contact" onClick={() => setIsOpenMenu(false)} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-white font-medium text-right">
            {t('contact')}
          </Link>

          {isAuthenticated && user ? (
            <div className="flex flex-col gap-3 mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center gap-3 px-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                  {user.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <Link to="/profile" onClick={() => setIsOpenMenu(false)} className="px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span>الملف الشخصي</span>
              </Link>
              {user.role !== 'customer' && (
                <Link to="/admin" onClick={() => setIsOpenMenu(false)} className="px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-gray-400" />
                  <span>لوحة الإدارة الإدارية</span>
                </Link>
              )}
              <Button variant="danger" className="w-full gap-2" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                <span>{t('logout')}</span>
              </Button>
            </div>
          ) : (
            <Button className="w-full gap-2 mt-4" onClick={() => { setIsAuthOpen(true); setIsOpenMenu(false); }}>
              <LogIn className="w-5 h-5" />
              <span>{t('login')}</span>
            </Button>
          )}
        </div>
      )}

    </header>
  );
};

export default Header;
