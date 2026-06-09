import React, { useState, useMemo, useEffect } from 'react';
import { Booking, Branch, FullCarDetails, User } from '../../types';
import Card from '../../components/ui/Card';
import api from '../../api';

const AdminReportsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsRes, branchesRes] = await Promise.all([
                    api.get('/bookings/all'),
                    api.get('/data/branches'),
                ]);
                setBookings(bookingsRes.data);
                setBranches(branchesRes.data);
            } catch (error) {
                console.error("Failed to fetch report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const reportData = useMemo(() => {
        const completedBookings = bookings.filter(b => b.status === 'completed');
        const totalRevenue = completedBookings.reduce((sum, b) => sum + b.priceBreakdown.total, 0);
        
        // FIX: Use a generic type argument for `reduce` to properly type the accumulator. This resolves 'unknown' property access errors.
        const revenueByBranch = completedBookings.reduce<Record<string, { revenue: number; count: number }>>((acc, booking) => {
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
            branchName: branches.find(b => b.id === branchId)?.name || 'N/A',
            revenue: data.revenue,
            count: data.count,
        })).sort((a, b) => b.revenue - a.revenue);

        return { totalRevenue, completedBookingsCount: completedBookings.length, branchReport };
    }, [bookings, branches]);

    if (loading) return <div>جاري تحميل التقارير...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">التقارير</h1>
        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-white dark:bg-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400">إجمالي الإيرادات</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{reportData.totalRevenue.toLocaleString()} ريال</p>
                </Card>
                <Card className="p-6 bg-white dark:bg-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400">الحجوزات المكتملة</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{reportData.completedBookingsCount}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">الإيرادات حسب الفرع</h3>
                    <div className="space-y-4">
                        {reportData.branchReport.map(item => (
                            <div key={item.branchId}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{item.branchName}</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{item.revenue.toLocaleString()} ريال</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className="bg-orange-600 h-2.5 rounded-full" 
                                        style={{ width: reportData.totalRevenue > 0 ? `${(item.revenue / reportData.totalRevenue) * 100}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">أداء السيارات</h3>
                    <div className="text-center text-gray-400 py-10">
                        مخطط بياني لأداء السيارات (قريباً)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;