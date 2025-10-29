import React, { useState, useMemo, useEffect } from 'react';
import { Booking, Branch, FullCarDetails, User } from '../../types';
import Card from '../../components/ui/Card';
import api from '../../api';

// StatCard and SortIcon components remain the same

const AdminReportsPage: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week' | 'day'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: 'endDate' | 'total', direction: 'desc' | 'asc' }>({ key: 'endDate', direction: 'desc' });
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [fleet, setFleet] = useState<FullCarDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsRes, branchesRes, usersRes, fleetRes] = await Promise.all([
                    api.get('/bookings/all'),
                    api.get('/data/branches'),
                    api.get('/data/users'),
                    api.get('/data/fleet')
                ]);
                setBookings(bookingsRes.data);
                setBranches(branchesRes.data);
                setUsers(usersRes.data);
                setFleet(fleetRes.data);
            } catch (error) {
                console.error("Failed to fetch report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    // Data processing hooks (useMemo for filteredBookings, completedBookings, sortedBookings, reportData)
    // now use the state variables (bookings, branches, users, fleet)

    const reportData = useMemo(() => {
        // This logic needs to be adapted to use the fetched state
        const completedBookings = bookings.filter(b => b.status === 'completed');
        const totalRevenue = completedBookings.reduce((sum, b) => sum + b.priceBreakdown.total, 0);
        
        const revenueByBranch = completedBookings.reduce((acc, booking) => {
            const branchId = booking.branchId;
            if (!acc[branchId]) acc[branchId] = { revenue: 0, count: 0 };
            acc[branchId].revenue += booking.priceBreakdown.total;
            acc[branchId].count += 1;
            return acc;
        // FIX: Provide a typed initial value to reduce to ensure correct type inference.
        }, {} as Record<string, { revenue: number; count: number }>);

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
            {/* Page content using `reportData` */}
        </div>
    );
};

export default AdminReportsPage;