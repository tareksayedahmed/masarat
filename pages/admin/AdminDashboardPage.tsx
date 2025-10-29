import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Car, Booking } from '../../types';
import api from '../../api';

// StatCard and ChartCard components remain the same

const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsRes, carsRes] = await Promise.all([
                    api.get('/bookings/all'), // Admin route to get all bookings
                    api.get('/data/fleet') // Using fleet which includes car model details
                ]);
                setBookings(bookingsRes.data);
                setCars(carsRes.data);
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
        const userCars = isBranchScoped ? cars.filter(c => c.branchId === user.branchId) : cars;
        return { bookings: userBookings, cars: userCars };
    }, [bookings, cars, isBranchScoped, user]);

    const activeBookings = filteredData.bookings.filter(b => b.status === 'active').length;
    const availableCars = filteredData.cars.filter(c => c.status === 'available').length;
    const totalCars = filteredData.cars.length;

    // Chart data generation would be similar, using filteredData
    // ...

    if (loading) return <div>جاري تحميل لوحة التحكم...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">مرحباً, {user?.name}!</h1>
            
            {/* Stat Cards would use the new state */}
            {/* Charts would use the new state */}
        </div>
    );
};

export default AdminDashboardPage;
