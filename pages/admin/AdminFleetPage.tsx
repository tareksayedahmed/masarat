import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CARS, BRANCHES, CAR_MODELS } from '../../constants';
import { UserRole, Car, FullCarDetails } from '../../types';
import Button from '../../components/ui/Button';
import CarFormModal from '../../components/admin/CarFormModal';

const AdminFleetPage: React.FC = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [cars, setCars] = useState<Car[]>(CARS);

    const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);

    const fullCarDetails: FullCarDetails[] = useMemo(() => {
        const details = cars.map(car => {
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
        }).filter((c): c is FullCarDetails => c !== null);

        if (user?.role === UserRole.BranchAdmin) {
            return details.filter(c => c.branchId === user.branchId);
        }
        return details;
    }, [cars, user, carModelsMap]);

    const handleOpenModal = (car: Car | null = null) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    const handleSaveCar = (carToSave: Car) => {
        if (selectedCar) {
            setCars(cars.map(c => c.id === carToSave.id ? carToSave : c));
        } else {
            const newCar = { ...carToSave, id: `car-${Date.now()}` };
            setCars([...cars, newCar]);
        }
        handleCloseModal();
    };

    const handleToggleAvailability = (carId: string, available: boolean) => {
        setCars(cars.map(c => c.id === carId ? { ...c, available } : c));
    };

    const getStatusChip = (status: Car['status']) => {
      const styles = {
        available: 'bg-green-100 text-green-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
        booked: 'bg-blue-100 text-blue-800',
      };
      const text = {
        available: 'متاحة',
        maintenance: 'صيانة',
        booked: 'محجوزة',
      };
      return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{text[status]}</span>
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الأسطول الفعلي</h1>
                <Button onClick={() => handleOpenModal()}>إضافة سيارة للأسطول</Button>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto hidden lg:block">
                <table className="w-full whitespace-no-wrap">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50">
                            <th className="px-4 py-3">السيارة</th>
                            <th className="px-4 py-3 hidden xl:table-cell">الفئة</th>
                            {user?.role === UserRole.HeadAdmin && <th className="px-4 py-3">الفرع</th>}
                            <th className="px-4 py-3">السعر/يوم</th>
                            <th className="px-4 py-3">الحالة</th>
                            <th className="px-4 py-3">تفعيل للحجز</th>
                            <th className="px-4 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {fullCarDetails.map(car => {
                            const branch = BRANCHES.find(b => b.id === car.branchId);
                            return (
                                <tr key={car.id} className="text-gray-700">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-sm">
                                            <div className="relative w-8 h-8 me-3 rounded-full md:block">
                                                <img className="object-cover w-full h-full rounded-full" src={car.images[0]} alt="" loading="lazy" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{car.make} {car.model}</p>
                                                <p className="text-xs text-gray-600">L.P: {car.license_plate} | {car.year}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden xl:table-cell">{car.category}</td>
                                    {user?.role === UserRole.HeadAdmin && <td className="px-4 py-3">{branch?.name}</td>}
                                    <td className="px-4 py-3 font-semibold">{car.daily_price} ريال</td>
                                    <td className="px-4 py-3">{getStatusChip(car.status)}</td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={car.available} onChange={(e) => handleToggleAvailability(car.id, e.target.checked)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleOpenModal(car)} className="text-orange-600 hover:text-orange-800">تعديل</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile & Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {fullCarDetails.map(car => {
                    const branch = BRANCHES.find(b => b.id === car.branchId);
                    return (
                        <div key={car.id} className="bg-white p-4 rounded-lg shadow space-y-3">
                             <div className="flex items-center space-i-3">
                                <img className="object-cover w-16 h-16 rounded-md" src={car.images[0]} alt="" loading="lazy" />
                                <div className="flex-1">
                                    <p className="font-bold">{car.make} {car.model} <span className="text-sm font-normal text-gray-500">({car.year})</span></p>
                                    <p className="text-xs text-gray-500">L.P: {car.license_plate} {user?.role === UserRole.HeadAdmin && ` - ${branch?.name}`}</p>
                                    <p className="font-semibold text-orange-600">{car.daily_price} ريال/يوم</p>
                                </div>
                                {getStatusChip(car.status)}
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                <div className="flex items-center space-i-2">
                                    <span className="text-sm font-medium">متاحة للحجز:</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={car.available} onChange={(e) => handleToggleAvailability(car.id, e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                    </label>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => handleOpenModal(car)}>تعديل</Button>
                            </div>
                        </div>
                    );
                })}
            </div>


            <CarFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCar}
                car={selectedCar}
                user={user}
                carModels={CAR_MODELS}
            />
        </div>
    );
};

export default AdminFleetPage;
