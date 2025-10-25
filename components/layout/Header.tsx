import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { UserRole, Branch } from '../../types';
import AuthForm from '../auth/AuthForm';
import { BRANCHES } from '../../constants';

const Header: React.FC = () => {
  const { user, logout, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBranchesMenuOpen, setBranchesMenuOpen] = useState(false);
  const branchesMenuRef = useRef<HTMLDivElement>(null);

  // Group branches by region for the dropdown
  const branchesByRegion = useMemo(() => {
    // FIX: Explicitly type the accumulator to prevent 'branches' from being typed as 'unknown'.
    return BRANCHES.reduce((acc: Record<string, Branch[]>, branch) => {
      const region = branch.region;
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(branch);
      return acc;
    }, {} as Record<string, Branch[]>);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (branchesMenuRef.current && !branchesMenuRef.current.contains(event.target as Node)) {
        setBranchesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isAdmin = user?.role === UserRole.HeadAdmin || user?.role === UserRole.BranchAdmin || user?.role === UserRole.Operator;

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setBranchesMenuOpen(false);
  };
  
  const NavLinks = () => (
    <>
      <Link to="/" onClick={closeAllMenus} className="px-4 py-2 text-gray-300 hover:text-orange-500 transition-colors">الرئيسية</Link>
      
      {/* Branches Dropdown */}
      <div className="relative" ref={branchesMenuRef}>
        <button 
          onClick={() => setBranchesMenuOpen(!isBranchesMenuOpen)}
          className="px-4 py-2 flex items-center text-gray-300 hover:text-orange-500 transition-colors"
        >
          سيارات الفروع
          <svg className={`w-4 h-4 ms-1 transition-transform ${isBranchesMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        {isBranchesMenuOpen && (
          <div className="absolute start-0 mt-2 w-max min-w-[400px] max-h-[70vh] overflow-y-auto bg-white rounded-md shadow-lg z-50 p-4 grid grid-cols-2 gap-4">
            {Object.entries(branchesByRegion).map(([region, branches]) => (
              <div key={region}>
                <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">{region}</h3>
                <ul className="space-y-1">
                  {branches.map(branch => (
                    <li key={branch.id}>
                      <Link to={`/cars/${branch.id}`} onClick={closeAllMenus} className="block px-3 py-1 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-md">
                        {branch.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Link to="/about" onClick={closeAllMenus} className="px-4 py-2 text-gray-300 hover:text-orange-500 transition-colors">عن الشركة</Link>
      <Link to="/contact" onClick={closeAllMenus} className="px-4 py-2 text-gray-300 hover:text-orange-500 transition-colors">اتصل بنا</Link>
    </>
  );

  const MobileNavLinks = () => (
    <nav className="flex flex-col p-4 space-y-2">
      <Link to="/" onClick={closeAllMenus} className="px-4 py-2 text-gray-600 hover:text-orange-600 rounded-md transition-colors">الرئيسية</Link>
      
      {/* Branches Accordion for Mobile */}
      <div>
        <button 
          onClick={() => setBranchesMenuOpen(!isBranchesMenuOpen)}
          className="w-full px-4 py-2 flex justify-between items-center text-gray-600 hover:text-orange-600 transition-colors"
        >
          سيارات الفروع
          <svg className={`w-4 h-4 transition-transform ${isBranchesMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        {isBranchesMenuOpen && (
          <div className="ps-4 mt-2 space-y-2 border-s-2 border-orange-100">
            {Object.entries(branchesByRegion).map(([region, branches]) => (
              <div key={region}>
                <h3 className="font-semibold text-gray-500 text-sm ps-2">{region}</h3>
                <ul className="space-y-1 mt-1">
                  {branches.map(branch => (
                    <li key={branch.id}>
                      <Link to={`/cars/${branch.id}`} onClick={closeAllMenus} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-md">
                        {branch.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Link to="/about" onClick={closeAllMenus} className="px-4 py-2 text-gray-600 hover:text-orange-600 rounded-md transition-colors">عن الشركة</Link>
      <Link to="/contact" onClick={closeAllMenus} className="px-4 py-2 text-gray-600 hover:text-orange-600 rounded-md transition-colors">اتصل بنا</Link>
      
      <hr className="my-4" />
      
       {user ? (
          <div className="px-4 space-y-3">
            <p className="font-medium">أهلاً, {user.name}</p>
            <Link to={isAdmin ? "/admin" : "/profile"} onClick={closeAllMenus}>
              <Button variant="outline" className="w-full">{isAdmin ? "لوحة التحكم" : "حجوزاتي"}</Button>
            </Link>
            <Button onClick={handleLogout} variant="danger" className="w-full">تسجيل الخروج</Button>
          </div>
        ) : (
          <div className="px-4">
            <Button onClick={() => { openLoginModal(); closeAllMenus(); }} className="w-full">تسجيل الدخول</Button>
          </div>
        )}
    </nav>
  );

  return (
    <header className="bg-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center text-white">
        <Link to="/" onClick={closeAllMenus}>
          <Logo isDark={true} />
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <nav className="flex items-center">
            <NavLinks />
          </nav>
          <div className="border-s border-gray-700 ms-4 ps-4">
             {user ? (
              <div className="flex items-center space-i-4">
                <Link to={isAdmin ? "/admin" : "/profile"} onClick={closeAllMenus}>
                  <Button variant="outline">{isAdmin ? "لوحة التحكم" : "حجوزاتي"}</Button>
                </Link>
                <Button onClick={handleLogout} variant="danger" size="sm">تسجيل الخروج</Button>
              </div>
            ) : (
              <Button onClick={() => { openLoginModal(); closeAllMenus(); }}>تسجيل الدخول</Button>
            )}
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </div>
      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-40">
            <MobileNavLinks />
        </div>
      )}
       <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="تسجيل الدخول أو إنشاء حساب">
          <AuthForm onSuccess={closeLoginModal} />
      </Modal>
    </header>
  );
};

export default Header;