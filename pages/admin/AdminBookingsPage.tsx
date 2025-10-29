import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Branch, UserRole, Booking, FullCarDetails } from '../../types';
import BookingDetailsModal from '../../components/admin/BookingDetailsModal';
import Button from '../../components/ui/Button';
import { useBookings } from '../../context/BookingContext';
import api from '../../api';

const AdminBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { bookings, updateBooking, fetchBookings, loading } = useBookings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [fleet, setFleet] = useState<FullCarDetails[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const fetchRelatedData = async () => {
            try {
                const [fleetRes, usersRes, branchesRes] = await Promise.all([
                    api.get('/data/fleet'),
                    api.get('/data/users'), // Assuming an admin endpoint for users
                    api.get('/data/branches'),
                ]);
                setFleet(fleetRes.data);
                setUsers(usersRes.data);
                setBranches(branchesRes.data);
            } catch (error) {
                console.error("Failed to fetch related data for bookings:", error);
            }
        };
        fetchBookings(); // From context
        fetchRelatedData();
    }, []);
    
    const isBranchScoped = user?.role === UserRole.BranchAdmin || user?.role === UserRole.Operator;

    const displayedBookings = useMemo(() => {
        return isBranchScoped
            ? bookings.filter(b => b.branchId === user?.branchId)
            : bookings;
    }, [bookings, isBranchScoped, user]);
    
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

    // getStatusChip, formatDateTime, exportToCSV functions remain similar...

    if(loading) return <div>جاري تحميل الحجوزات...</div>

    return (
        <div>
            {/* Page content, mapping over `displayedBookings` */}
            {/* Desktop Table */}
            {/* Mobile Cards */}

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
