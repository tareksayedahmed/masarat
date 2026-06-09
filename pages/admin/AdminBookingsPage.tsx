import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Branch, UserRole, Booking, FullCarDetails } from '../../types';
import BookingDetailsModal from '../../components/admin/BookingDetailsModal';
import Button from '../../components/ui/Button';
import { useBookings } from '../../context/BookingContext';
import api from '../../api';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const AdminBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { bookings, updateBooking, fetchBookings, loading } = useBookings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [fleet, setFleet] = useState<FullCarDetails[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchRelatedData = async () => {
            try {
                const [fleetRes, usersRes, branchesRes] = await Promise.all([
                    api.get('/data/fleet'),
                    api.get('/data/users'), 
                    api.get('/data/branches'),
                ]);
                setFleet(fleetRes.data);
                setUsers(usersRes.data);
                setBranches(branchesRes.data);
            } catch (error) {
                console.error("Failed to fetch related data for bookings:", error);
            }
        };
        fetchBookings(); 
        fetchRelatedData();
    }, []);
    
    const isBranchScoped = user?.role === UserRole.BranchAdmin || user?.role === UserRole.Operator;

    const displayedBookings = useMemo(() => {
        let filtered = isBranchScoped
            ? bookings.filter(b => b.branchId === user?.branchId)
            : bookings;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(b => b.status === statusFilter);
        }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(b => {
                const customer = getUser(b.userId);
                const car = getFullCarDetails(b.carId);
                return b.bookingNumber.toLowerCase().includes(lowerCaseQuery) ||
                       customer?.name.toLowerCase().includes(lowerCaseQuery) ||
                       car?.model.toLowerCase().includes(lowerCaseQuery);
            });
        }
        
        return filtered;
    }, [bookings, isBranchScoped, user, statusFilter, searchQuery]);
    
    const getFullCarDetails = (carId: string): FullCarDetails | null => fleet.find(c => c.id === carId) || null;
    const getUser = (userId: string): User | undefined => users.find(u => u.id === userId);
    const getBranch = (branchId: string): Branch | undefined => branches.find(b => b.id === branchId);

    const handleDetailsClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleSaveBooking = (updatedBooking: Booking) => {
        updateBooking(updatedBooking);
        handleCloseModal();
    };

    const getStatusChip = (status: Booking['status']) => {
        const baseClasses = "px-2 py-1 font-semibold leading-tight text-xs rounded-full whitespace-nowrap";
        const statusMap = {
            pending: `bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300`,
            confirmed: `bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300`,
            active: `bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300`,
            completed: `bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-300`,
            cancelled: `bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300`
        };
        return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
    };
    
    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' });
    }

    if(loading) return <div>جاري تحميل الحجوزات...</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">إدارة الحجوزات</h1>
                <Button>إضافة حجز جديد</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input placeholder="ابحث برقم الحجز، العميل..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">كل الحالات</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="active">نشط</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                </Select>
            </div>
            
            {/* Desktop Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto hidden lg:block">
                <table className="w-full">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm">
                            <th className="px-4 py-3">رقم الحجز</th>
                            <th className="px-4 py-3">العميل</th>
                            <th className="px-4 py-3">السيارة</th>
                            <th className="px-4 py-3">المدة</th>
                            <th className="px-4 py-3">الإجمالي</th>
                            <th className="px-4 py-3">الحالة</th>
                            <th className="px-4 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
                        {displayedBookings.map(booking => {
                            const car = getFullCarDetails(booking.carId);
                            const customer = getUser(booking.userId);
                            return (
                                <tr key={booking.id} className="text-gray-700 dark:text-gray-300">
                                    <td className="px-4 py-3 font-mono text-sm">{booking.bookingNumber}</td>
                                    <td className="px-4 py-3 text-sm">{customer?.name || 'غير معروف'}</td>
                                    <td className="px-4 py-3 text-sm">{car ? `${car.make} ${car.model}` : 'غير متوفر'}</td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">{formatDateTime(booking.startDate)} <br/> {formatDateTime(booking.endDate)}</td>
                                    <td className="px-4 py-3 text-sm">{booking.priceBreakdown.total.toFixed(2)} ريال</td>
                                    <td className="px-4 py-3 text-xs">{getStatusChip(booking.status)}</td>
                                    <td className="px-4 py-3"><Button size="sm" onClick={() => handleDetailsClick(booking)}>التفاصيل</Button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

             {/* Mobile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {displayedBookings.map(booking => {
                    const car = getFullCarDetails(booking.carId);
                    const customer = getUser(booking.userId);
                    return (
                    <div key={booking.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
                        <div className="flex justify-between items-start">
                            <p className="font-bold font-mono text-gray-800 dark:text-gray-100">{booking.bookingNumber}</p>
                            {getStatusChip(booking.status)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{customer?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{car ? `${car.make} ${car.model}` : 'سيارة محذوفة'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">من: {formatDateTime(booking.startDate)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">إلى: {formatDateTime(booking.endDate)}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
                            <p className="font-bold">{booking.priceBreakdown.total.toFixed(2)} ريال</p>
                            <Button size="sm" onClick={() => handleDetailsClick(booking)}>التفاصيل</Button>
                        </div>
                    </div>
                )})}
            </div>

            {selectedBooking && (
                <BookingDetailsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    booking={selectedBooking}
                    onSave={handleSaveBooking}
                />
            )}
        </div>
    );
};

export default AdminBookingsPage;