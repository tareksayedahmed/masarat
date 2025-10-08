import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BOOKINGS, CARS } from '../../constants';
import { UserRole, Car } from '../../types';

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

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        {children}
    </div>
);


const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth();

    const isBranchScoped = user?.role === UserRole.BranchAdmin || user?.role === UserRole.Operator;

    const bookings = isBranchScoped
        ? BOOKINGS.filter(b => b.branchId === user.branchId)
        : BOOKINGS;

    const cars = isBranchScoped
        ? CARS.filter(c => c.branchId === user.branchId)
        : CARS;
        
    const activeBookings = bookings.filter(b => b.status === 'active').length;
    const availableCars = cars.filter(c => c.available).length;
    const totalCars = cars.length;

    // Data for charts
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('ar-SA', { weekday: 'short' });
    }).reverse();
    const bookingsData = [12, 19, 8, 15, 12, 13, 9]; // Mock data
    const maxBooking = Math.max(...bookingsData);

    const fleetStatus = cars.reduce((acc, car) => {
        const status = car.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<Car['status'], number>);
    
    const statusConfig = {
        available: { label: 'متاحة', color: '#34D399', value: fleetStatus.available || 0 },
        booked: { label: 'محجوزة', color: '#FBBF24', value: fleetStatus.booked || 0 },
        maintenance: { label: 'صيانة', color: '#F87171', value: fleetStatus.maintenance || 0 },
    };

    const totalFleetForChart = Object.values(statusConfig).reduce((sum, s) => sum + s.value, 0);

    let accumulatedPercentage = 0;
    const donutSegments = Object.values(statusConfig).map(status => {
        const percentage = totalFleetForChart > 0 ? (status.value / totalFleetForChart) * 100 : 0;
        const segment = { ...status, percentage, offset: accumulatedPercentage };
        accumulatedPercentage += percentage;
        return segment;
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">مرحباً, {user?.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="إجمالي الحجوزات" value={bookings.length} icon={<svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <StatCard title="الحجوزات النشطة" value={activeBookings} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="السيارات المتاحة" value={availableCars} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="إجمالي الأسطول" value={totalCars} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <ChartCard title="الحجوزات في آخر 7 أيام">
                        <div className="flex justify-between items-end h-64 border-b border-gray-200 pb-4 gap-1 sm:gap-2">
                            {bookingsData.map((value, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                                    <span className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity -mb-4">{value}</span>
                                    <div className="w-3/5 bg-orange-200 hover:bg-orange-400 rounded-t-lg transition-colors" style={{ height: `${(value / maxBooking) * 100}%` }}></div>
                                    <span className="text-xs text-gray-500 mt-2">{last7Days[index]}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
                <div className="lg:col-span-2">
                    <ChartCard title="حالة الأسطول">
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" className="stroke-current text-gray-200" strokeWidth="3"></circle>
                                    {donutSegments.map(segment => (
                                         <circle
                                            key={segment.label}
                                            cx="18"
                                            cy="18"
                                            r="15.915"
                                            fill="transparent"
                                            stroke={segment.color}
                                            strokeWidth="3.5"
                                            strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                                            strokeDashoffset={-segment.offset}
                                            transform="rotate(-90 18 18)"
                                        ></circle>
                                    ))}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold">{totalFleetForChart}</span>
                                    <span className="text-sm text-gray-500">سيارة</span>
                                </div>
                            </div>
                            <ul className="space-y-2">
                               {Object.values(statusConfig).map(s => (
                                    <li key={s.label} className="flex items-center text-sm">
                                        <span className="w-3 h-3 rounded-full me-2" style={{ backgroundColor: s.color }}></span>
                                        <span>{s.label} ({s.value})</span>
                                    </li>
                               ))}
                            </ul>
                        </div>
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
