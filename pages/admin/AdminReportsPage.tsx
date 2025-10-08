

import React, { useState, useMemo } from 'react';
import { BOOKINGS, BRANCHES, CARS, CAR_MODELS, USERS } from '../../constants';
import { Booking, FullCarDetails } from '../../types';
import Card from '../../components/ui/Card';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-i-4">
        <div className="bg-orange-100 text-orange-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <h3 className="text-gray-500 text-base">{title}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    </div>
);

const SortIcon: React.FC<{ direction: 'asc' | 'desc' }> = ({ direction }) => (
    <svg className="w-4 h-4 inline-block ms-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        {direction === 'asc' ? 
            <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /> : 
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        }
    </svg>
);


const AdminReportsPage: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week' | 'day'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: 'endDate' | 'total', direction: 'desc' | 'asc' }>({ key: 'endDate', direction: 'desc' });
    
    // --- Data processing ---
    const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);
    const carsMap = useMemo(() => new Map(CARS.map(c => [c.id, c])), []);
    const usersMap = useMemo(() => new Map(USERS.map(u => [u.id, u])), []);

    const getFullCarDetails = (carId: string): FullCarDetails | null => {
        const car = carsMap.get(carId);
        if (!car) return null;
        const model = carModelsMap.get(car.modelKey);
        if (!model) return null;
        return { ...car, ...model };
    };

    const filteredBookings = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - dayOfWeek);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return (BOOKINGS as unknown as Booking[]).filter(booking => {
            if (timeFilter === 'all') return true;
            const bookingEndDate = new Date(booking.endDate);
            if (timeFilter === 'day') return bookingEndDate >= startOfDay;
            if (timeFilter === 'week') return bookingEndDate >= startOfWeek;
            if (timeFilter === 'month') return bookingEndDate >= startOfMonth;
            return true;
        });
    }, [timeFilter]);

    const completedBookings = useMemo(() => filteredBookings.filter(b => b.status === 'completed'), [filteredBookings]);
    
    const sortedBookings = useMemo(() => {
        const detailed = completedBookings.map(booking => ({
            ...booking,
            customerName: (usersMap.get(booking.userId) || USERS.find(u => u.role === 'Customer'))?.name || 'عميل غير معروف',
            carDetails: getFullCarDetails(booking.carId),
        }));

        return detailed.sort((a, b) => {
            let valA, valB;
            if (sortConfig.key === 'endDate') {
                valA = new Date(a.endDate).getTime();
                valB = new Date(b.endDate).getTime();
            } else { // 'total'
                valA = a.priceBreakdown.total;
                valB = b.priceBreakdown.total;
            }
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [completedBookings, sortConfig, usersMap, carsMap, carModelsMap]);

    const reportData = useMemo(() => {
        const activeAndConfirmed = filteredBookings.filter(b => ['active', 'confirmed'].includes(b.status));
        const totalRevenue = completedBookings.reduce((sum, b) => sum + b.priceBreakdown.total, 0);
        const projectedRevenue = activeAndConfirmed.reduce((sum, b) => sum + b.priceBreakdown.total, 0);
        const avgBookingValue = completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0;

        // FIX: Explicitly typed the accumulator in the reduce function to prevent type inference issues.
        const revenueByBranch = completedBookings.reduce((acc: Record<string, { revenue: number; count: number }>, booking) => {
            const branchId = booking.branchId;
            if (!acc[branchId]) {
                acc[branchId] = { revenue: 0, count: 0 };
            }
            acc[branchId].revenue += booking.priceBreakdown.total;
            acc[branchId].count += 1;
            return acc;
        }, {});

        const branchReport = Object.entries(revenueByBranch).map(([branchId, data]) => ({
            branchId,
            branchName: BRANCHES.find(b => b.id === branchId)?.name || 'فرع غير معروف',
            revenue: data.revenue,
            count: data.count,
        })).sort((a, b) => b.revenue - a.revenue);

        return { totalRevenue, projectedRevenue, completedBookingsCount: completedBookings.length, avgBookingValue, branchReport };
    }, [completedBookings, filteredBookings]);
    
    // --- Handlers & Formatters ---
    const handleSort = (key: 'endDate' | 'total') => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);
    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' });
    
    const filterButtonClasses = (filterName: typeof timeFilter) => 
        `px-4 py-2 text-sm font-medium rounded-md transition-colors ${timeFilter === filterName ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">التقارير المالية</h1>
                <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                    <button onClick={() => setTimeFilter('all')} className={filterButtonClasses('all')}>الكل</button>
                    <button onClick={() => setTimeFilter('month')} className={filterButtonClasses('month')}>هذا الشهر</button>
                    <button onClick={() => setTimeFilter('week')} className={filterButtonClasses('week')}>هذا الأسبوع</button>
                    <button onClick={() => setTimeFilter('day')} className={filterButtonClasses('day')}>اليوم</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard title="إجمالي الإيرادات (مكتملة)" value={formatCurrency(reportData.totalRevenue)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                 <StatCard title="الإيرادات المتوقعة (نشطة)" value={formatCurrency(reportData.projectedRevenue)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                 <StatCard title="الحجوزات المكتملة" value={reportData.completedBookingsCount} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                 <StatCard title="متوسط قيمة الحجز" value={formatCurrency(reportData.avgBookingValue)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>} />
            </div>
            
            <Card className="p-0">
                <h2 className="text-xl font-bold p-6">ملخص الإيرادات حسب الفرع</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-right font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50 text-sm">
                                <th className="px-6 py-3">الفرع</th>
                                <th className="px-6 py-3">الحجوزات المكتملة</th>
                                <th className="px-6 py-3">إجمالي الإيرادات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {reportData.branchReport.map(item => (
                                <tr key={item.branchId} className="text-gray-700">
                                    <td className="px-6 py-4 font-semibold">{item.branchName}</td>
                                    <td className="px-6 py-4">{item.count}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">{formatCurrency(item.revenue)}</td>
                                </tr>
                            ))}
                            {reportData.branchReport.length === 0 && (
                                <tr><td colSpan={3} className="text-center py-10 text-gray-500">لا توجد بيانات.</td></tr>
                            )}
                        </tbody>
                         <tfoot className="bg-gray-50 border-t">
                            <tr className="font-bold text-gray-800">
                                <td className="px-6 py-4">الإجمالي</td>
                                <td className="px-6 py-4">{reportData.completedBookingsCount}</td>
                                <td className="px-6 py-4 text-green-700">{formatCurrency(reportData.totalRevenue)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>

            <Card className="p-0">
                <h2 className="text-xl font-bold p-6">أحدث الحجوزات المكتملة</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-right font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50 text-sm">
                                <th className="px-6 py-3">العميل</th>
                                <th className="px-6 py-3">السيارة</th>
                                <th className="px-6 py-3">
                                    <button className="flex items-center" onClick={() => handleSort('endDate')}>
                                        تاريخ الاكتمال {sortConfig.key === 'endDate' && <SortIcon direction={sortConfig.direction} />}
                                    </button>
                                </th>
                                <th className="px-6 py-3">
                                     <button className="flex items-center" onClick={() => handleSort('total')}>
                                        الإجمالي {sortConfig.key === 'total' && <SortIcon direction={sortConfig.direction} />}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {sortedBookings.map(booking => (
                                <tr key={booking.id} className="text-gray-700">
                                    <td className="px-6 py-4">{booking.customerName}</td>
                                    <td className="px-6 py-4">{booking.carDetails ? `${booking.carDetails.make} ${booking.carDetails.model}` : 'N/A'}</td>
                                    <td className="px-6 py-4">{formatDate(booking.endDate)}</td>
                                    <td className="px-6 py-4 font-semibold">{formatCurrency(booking.priceBreakdown.total)}</td>
                                </tr>
                            ))}
                            {sortedBookings.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-10 text-gray-500">لا توجد حجوزات مكتملة لعرضها.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default AdminReportsPage;