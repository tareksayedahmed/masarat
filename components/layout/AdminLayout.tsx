
import React, { useState, useMemo } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getRoleName = (role?: UserRole) => {
        switch(role) {
            case UserRole.HeadAdmin: return 'مدير عام';
            case UserRole.BranchAdmin: return 'مدير فرع';
            case UserRole.Operator: return 'موظف';
            default: return '';
        }
    }
    
    // --- DESKTOP SIDEBAR ---
    const desktopNavLinkClasses = ({ isActive }: { isActive: boolean }) => 
        `flex items-center px-4 py-3 text-lg transition-colors duration-200 transform rounded-md ${
            isActive 
            ? 'bg-orange-600 text-white' 
            : 'text-gray-200 hover:bg-gray-700 hover:text-white'
        } ${isSidebarCollapsed && 'justify-center'}`;
    
    const DesktopSidebarContent = () => (
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-center h-20 border-b border-gray-700 flex-shrink-0">
                <Logo isDark={true} compact={isSidebarCollapsed} />
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                <NavLink to="/admin" end className={desktopNavLinkClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    {!isSidebarCollapsed && <span className="mx-4 font-medium">نظرة عامة</span>}
                </NavLink>
                <NavLink to="/admin/bookings" className={desktopNavLinkClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     {!isSidebarCollapsed && <span className="mx-4 font-medium">الحجوزات</span>}
                </NavLink>
                {(user?.role === UserRole.HeadAdmin || user?.role === UserRole.BranchAdmin) && (
                    <NavLink to="/admin/fleet" className={desktopNavLinkClasses}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {!isSidebarCollapsed && <span className="mx-4 font-medium">إدارة الأسطول</span>}
                    </NavLink>
                )}
                {user?.role === UserRole.HeadAdmin && (
                    <>
                        <NavLink to="/admin/pricing" className={desktopNavLinkClasses}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                            {!isSidebarCollapsed && <span className="mx-4 font-medium">إدارة الأسعار</span>}
                        </NavLink>
                        <NavLink to="/admin/logs" className={desktopNavLinkClasses}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            {!isSidebarCollapsed && <span className="mx-4 font-medium">سجل النشاط</span>}
                        </NavLink>
                        <NavLink to="/admin/settings" className={desktopNavLinkClasses}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {!isSidebarCollapsed && <span className="mx-4 font-medium">الإعدادات</span>}
                        </NavLink>
                        <NavLink to="/admin/reports" className={desktopNavLinkClasses}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            {!isSidebarCollapsed && <span className="mx-4 font-medium">التقارير</span>}
                        </NavLink>
                    </>
                )}
            </nav>
            <div className="px-2 py-4 border-t border-gray-700 mt-auto flex-shrink-0">
                <Link to="/" className={`w-full flex items-center px-4 py-3 mb-2 text-lg text-gray-200 hover:bg-gray-700 hover:text-white rounded-md ${isSidebarCollapsed && 'justify-center'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {!isSidebarCollapsed && <span className="mx-4 font-medium">العودة للموقع</span>}
                </Link>
                <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'px-2' : 'px-4 py-3 bg-gray-900/50 rounded-md'}`}>
                   {!isSidebarCollapsed ? (<div><p className="font-medium text-white truncate">{user?.name}</p><p className="text-sm text-gray-400">{getRoleName(user?.role)}</p></div>) : (<div className="flex justify-center items-center p-3 bg-gray-900/50 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>)}
                </div>
                 <button onClick={handleLogout} className={`w-full flex items-center mt-2 px-4 py-3 text-lg text-red-300 hover:bg-red-700 hover:text-white rounded-md ${isSidebarCollapsed && 'justify-center'}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    {!isSidebarCollapsed && <span className="mx-4 font-medium">تسجيل الخروج</span>}
                </button>
            </div>
        </div>
    );
    
    // --- MOBILE BOTTOM NAV ---
    const navItems = useMemo(() => {
        // FIX: Explicitly define the type for `items` to allow for different shapes (links vs buttons).
        const items: Array<{
            path?: string;
            icon: React.ReactNode;
            label: string;
            exact?: boolean;
            type?: 'button';
        }> = [
            { path: "/admin", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>, label: "نظرة عامة", exact: true },
            { path: "/admin/bookings", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>, label: "الحجوزات" }
        ];
        if (user?.role === UserRole.HeadAdmin || user?.role === UserRole.BranchAdmin) {
            items.push({ path: "/admin/fleet", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>, label: "الأسطول" });
        }
        if (user?.role === UserRole.HeadAdmin) {
            items.push({ type: 'button', label: "المزيد", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg> });
        }
        return items;
    }, [user?.role]);

    const MobileBottomNav = () => (
        <div className="fixed bottom-0 start-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-t-lg md:hidden">
            <div className={`grid h-full max-w-lg grid-cols-${navItems.length} mx-auto font-medium`}>
                {navItems.map(item => {
                    if (item.type === 'button') {
                        return (
                             <button key={item.label} type="button" onClick={() => setMoreMenuOpen(true)} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 text-gray-500 hover:text-orange-600">
                                {item.icon}
                                <span className="text-xs">{item.label}</span>
                            </button>
                        )
                    }
                    const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path!);
                    return (
                        <NavLink key={item.path} to={item.path!} end={item.exact} className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 ${isActive ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                        </NavLink>
                    )
                })}
            </div>
        </div>
    );
    
    return (
        <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col w-64 bg-gray-800 text-white transform transition-all duration-300 ease-in-out md:w-${isSidebarCollapsed ? '20' : '64'}`}>
                <button
                    onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden md:flex items-center justify-center absolute top-24 -end-4 z-50 bg-gray-700 hover:bg-orange-600 text-white w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 border-4 border-white"
                    aria-label={isSidebarCollapsed ? "توسيع القائمة" : "طي القائمة"}
                >
                    <svg className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <DesktopSidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Navigation */}
            <MobileBottomNav />
            
            <Modal isOpen={isMoreMenuOpen} onClose={() => setMoreMenuOpen(false)} title="القائمة">
                <div className="space-y-2">
                    {user?.role === UserRole.HeadAdmin && (
                        <>
                            <Link to="/admin/pricing" onClick={() => setMoreMenuOpen(false)}>
                                <Button variant="secondary" className="w-full justify-start text-base">إدارة الأسعار</Button>
                            </Link>
                            <Link to="/admin/logs" onClick={() => setMoreMenuOpen(false)}>
                                <Button variant="secondary" className="w-full justify-start text-base">سجل النشاط</Button>
                            </Link>
                             <Link to="/admin/settings" onClick={() => setMoreMenuOpen(false)}>
                                <Button variant="secondary" className="w-full justify-start text-base">الإعدادات</Button>
                            </Link>
                             <Link to="/admin/reports" onClick={() => setMoreMenuOpen(false)}>
                                <Button variant="secondary" className="w-full justify-start text-base">التقارير</Button>
                            </Link>
                             <hr className="my-2"/>
                        </>
                    )}
                    <Link to="/" onClick={() => setMoreMenuOpen(false)}>
                        <Button variant="secondary" className="w-full justify-start text-base">العودة للموقع</Button>
                    </Link>
                    <Button variant="danger" className="w-full justify-start text-base" onClick={handleLogout}>تسجيل الخروج</Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminLayout;