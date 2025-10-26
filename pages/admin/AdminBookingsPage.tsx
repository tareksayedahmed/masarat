import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CARS, BRANCHES, USERS, CAR_MODELS } from '../../constants';
import { UserRole, Booking, FullCarDetails } from '../../types';
import BookingDetailsModal from '../../components/admin/BookingDetailsModal';
import Button from '../../components/ui/Button';
import { useBookings } from '../../context/BookingContext';

const AdminBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { bookings, updateBooking } = useBookings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    
    const isBranchScoped = user?.role === UserRole.BranchAdmin || user?.role === UserRole.Operator;

    const displayedBookings = useMemo(() => {
        return isBranchScoped
            ? bookings.filter(b => b.branchId === user?.branchId)
            : bookings;
    }, [bookings, isBranchScoped, user]);
    
    const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);
    const carsMap = useMemo(() => new Map(CARS.map(c => [c.id, c])), []);

    const getFullCarDetails = (carId: string): FullCarDetails | null => {
        const car = carsMap.get(carId);
        if (!car) return null;
        const model = carModelsMap.get(car.modelKey);
        if (!model) return null;
        return {
            ...car,
            make: model.make,
            model: model.model,
            year: model.year,
            category: model.category,
            daily_price: model.daily_price,
            weekly_price: model.weekly_price,
            monthly_price: model.monthly_price,
            images: model.images,
        };
    };

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
    }

    const getStatusChip = (status: string) => {
        const styles: { [key: string]: string } = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            active: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        const text: { [key: string]: string } = {
            pending: 'قيد الانتظار',
            confirmed: 'مؤكد',
            active: 'جاري الإيجار',
            completed: 'مكتمل',
            cancelled: 'ملغي',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{text[status]}</span>;
    }

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('ar-SA-u-nu-latn', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
    };
    
    const exportToCSV = () => {
        const headers = ["رقم الحجز", "العميل", "الجوال", "السيارة", "الفرع", "تاريخ البدء", "تاريخ الانتهاء", "الأيام", "الإجمالي", "الحالة"];
        const rows = displayedBookings.map(booking => {
            const car = getFullCarDetails(booking.carId);
            const customer = USERS.find(u => u.id === booking.userId);
            const branch = BRANCHES.find(b => b.id === booking.branchId);
            
            return [
                booking.bookingNumber,
                `"${customer?.name}"`,
                booking.contact.phone1,
                `"${car?.make} ${car?.model}"`,
                `"${branch?.name}"`,
                formatDateTime(booking.startDate),
                formatDateTime(booking.endDate),
                booking.days,
                booking.priceBreakdown.total,
                booking.status
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," 
            + "\uFEFF" // BOM for UTF-8 to support Arabic in Excel
            + headers.join(',') + "\n" 
            + rows.join('\n');
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bookings.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الحجوزات</h1>
                <Button onClick={exportToCSV}>تصدير إلى CSV</Button>
            </div>
            
            {/* Desktop Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto hidden lg:block">
                <table className="w-full whitespace-no-wrap">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50">
                            <th className="px-4 py-3"># الحجز / العميل</th>
                            <th className="px-4 py-3">السيارة</th>
                            {user?.role === UserRole.HeadAdmin && <th className="px-4 py-3 hidden xl:table-cell">الفرع</th>}
                            <th className="px-4 py-3">التواريخ</th>
                            <th className="px-4 py-3">الإجمالي</th>
                            <th className="px-4 py-3">الحالة</th>
                            <th className="px-4 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {displayedBookings.map(booking => {
                            const car = getFullCarDetails(booking.carId);
                            const customer = USERS.find(u => u.id === booking.userId);
                            const branch = BRANCHES.find(b => b.id === booking.branchId);
                            return (
                                <tr key={booking.id} className="text-gray-700">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold">{booking.bookingNumber}</p>
                                        <p className="text-sm text-gray-600">{customer?.name}</p>
                                        <p className="text-xs text-gray-500">{booking.contact.phone1}</p>
                                    </td>
                                    <td className="px-4 py-3">{car?.make} {car?.model}</td>
                                    {user?.role === UserRole.HeadAdmin && <td className="px-4 py-3 hidden xl:table-cell">{branch?.name}</td>}
                                    <td className="px-4 py-3 text-sm">
                                        <p>{formatDateTime(booking.startDate)}</p>
                                        <p>إلى {formatDateTime(booking.endDate)}</p>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{booking.priceBreakdown.total} ريال</td>
                                    <td className="px-4 py-3">{getStatusChip(booking.status)}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleDetailsClick(booking)} className="text-orange-600 hover:text-orange-800">تفاصيل</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile & Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {displayedBookings.map(booking => {
                     const car = getFullCarDetails(booking.carId);
                     const customer = USERS.find(u => u.id === booking.userId);
                     const branch = BRANCHES.find(b => b.id === booking.branchId);
                     return (
                        <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-500 text-xs">{booking.bookingNumber}</p>
                                    <p className="font-bold text-lg">{customer?.name}</p>
                                    <p className="text-sm text-gray-500">{booking.contact.phone1}</p>
                                    <p className="text-sm text-gray-600 mt-1">{car?.make} {car?.model}</p>
                                    {user?.role === UserRole.HeadAdmin && <p className="text-xs text-gray-500">{branch?.name}</p>}
                                </div>
                                {getStatusChip(booking.status)}
                            </div>
                            <div className="border-t my-3"></div>
                            <div className="text-sm space-y-2">
                                <p><strong>من:</strong> {formatDateTime(booking.startDate)}</p>
                                <p><strong>إلى:</strong> {formatDateTime(booking.endDate)}</p>
                                <p><strong>الإجمالي:</strong> <span className="font-bold text-orange-600">{booking.priceBreakdown.total} ريال</span></p>
                            </div>
                            <div className="mt-4 text-right">
                                <button onClick={() => handleDetailsClick(booking)} className="text-orange-600 font-semibold hover:text-orange-800">عرض التفاصيل</button>
                            </div>
                        </div>
                     )
                })}
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