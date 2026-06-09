import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Car, Booking, FullCarDetails } from '../../types';
import api from '../../api';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease';
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, changeType }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-6">
        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {change && (
                <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </p>
            )}
        </div>
    </div>
);


const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [fleet, setFleet] = useState<FullCarDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsRes, fleetRes] = await Promise.all([
                    api.get('/bookings/all'), 
                    api.get('/data/fleet')
                ]);
                setBookings(bookingsRes.data);
                setFleet(fleetRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const isBranchScoped = user?.role === UserRole.BranchAdmin || user?.role === UserRole.Operator;

    const filteredData = useMemo(() => {
        const userBookings = isBranchScoped ? bookings.filter(b => b.branchId === user.branchId) : bookings;
        const userCars = isBranchScoped ? fleet.filter(c => c.branchId === user.branchId) : fleet;
        return { bookings: userBookings, cars: userCars };
    }, [bookings, fleet, isBranchScoped, user]);

    const stats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const activeBookings = filteredData.bookings.filter(b => b.status === 'active').length;
        const availableCars = filteredData.cars.filter(c => c.status === 'available').length;
        const totalCars = filteredData.cars.length;

        const monthlyRevenue = filteredData.bookings
            .filter(b => b.status === 'completed' && new Date(b.endDate) >= startOfMonth)
            .reduce((sum, b) => sum + b.priceBreakdown.total, 0);

        return { activeBookings, availableCars, totalCars, monthlyRevenue };
    }, [filteredData]);

    if (loading) return <div>جاري تحميل لوحة التحكم...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">مرحباً, {user?.name}!</h1>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="حجوزات نشطة"
                    value={stats.activeBookings}
                />
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="سيارات متاحة"
                    value={`${stats.availableCars} / ${stats.totalCars}`}
                />
                 <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l-1 1-1-1H6a3 3 0 010-6h3l1 1 1-1z" /></svg>}
                    title="إيرادات الشهر"
                    value={`${stats.monthlyRevenue.toLocaleString()} ريال`}
                />
                 <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    title="عملاء جدد"
                    value="12"
                    change="+5 هذا الأسبوع"
                    changeType="increase"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">الحجوزات الأخيرة</h3>
                    <div className="text-center text-gray-400 py-10">
                        مخطط بياني للحجوزات الأخيرة
                    </div>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">أداء الفروع</h3>
                    <div className="text-center text-gray-400 py-10">
                        مخطط بياني لأداء الفروع
                    </div>
                 </div>
            </div>

        </div>
    );
};

export default AdminDashboardPage;