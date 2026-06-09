import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Car, FullCarDetails, CarModel, Branch } from '../../types';
import Button from '../../components/ui/Button';
import CarFormModal from '../../components/admin/CarFormModal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import api from '../../api';

const AdminFleetPage: React.FC = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [fleet, setFleet] = useState<FullCarDetails[]>([]);
    const [carModels, setCarModels] = useState<CarModel[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [branchFilter, setBranchFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState<'all' | Car['status']>('all');

    const fetchFleet = async () => {
        setLoading(true);
        try {
            const [fleetRes, modelsRes, branchesRes] = await Promise.all([
                api.get('/data/fleet'),
                api.get('/data/carmodels'),
                api.get('/data/branches')
            ]);
            setFleet(fleetRes.data);
            setCarModels(modelsRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.error("Failed to fetch fleet data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleet();
    }, []);

    const userVisibleFleet = useMemo(() => {
        if (user?.role === UserRole.BranchAdmin) {
            return fleet.filter(c => c.branchId === user.branchId);
        }
        return fleet;
    }, [fleet, user]);

    const filteredCars = useMemo(() => {
        return userVisibleFleet.filter(car => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchLower === '' || car.make.toLowerCase().includes(searchLower) || car.model.toLowerCase().includes(searchLower) || car.license_plate.toLowerCase().includes(searchLower);
            
            let matchesBranch = true;
            if (user?.role === 'HeadAdmin') {
                matchesBranch = branchFilter === 'all' || car.branchId === branchFilter;
            }

            const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
            return matchesSearch && matchesBranch && matchesStatus;
        });
    }, [userVisibleFleet, searchQuery, branchFilter, statusFilter, user]);

    const handleOpenModal = (car: Car | null = null) => {
        setSelectedCar(car);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    const handleSaveCar = async (carToSave: Car) => {
        try {
            if (selectedCar) {
                // Update
                await api.put(`/fleet/${carToSave.id}`, carToSave);
            } else {
                // Create
                await api.post('/fleet', carToSave);
            }
            fetchFleet(); // Re-fetch to get updated list
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save car:", error);
            alert("فشل حفظ السيارة.");
        }
    };
    
    const getStatusChip = (status: Car['status']) => {
        const baseClasses = "px-2 py-1 font-semibold leading-tight text-xs rounded-full whitespace-nowrap";
        const statusMap = {
            available: `bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300`,
            maintenance: `bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300`,
            booked: `bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300`
        };
        const statusText = {
            available: 'متاحة',
            maintenance: 'صيانة',
            booked: 'محجوزة'
        };
        return <span className={`${baseClasses} ${statusMap[status]}`}>{statusText[status]}</span>;
    };

    const getBranchName = (branchId: string) => branches.find(b => b.id === branchId)?.name || 'N/A';

    if (loading) return <div>جاري تحميل الأسطول...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">إدارة الأسطول</h1>
                <Button onClick={() => handleOpenModal()}>إضافة سيارة جديدة</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="ابحث بالاسم, الموديل, رقم اللوحة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {user?.role === 'HeadAdmin' && (
                    <Select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
                        <option value="all">كل الفروع</option>
                        {branches.filter(b => b.id !== 'e-branch').map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                )}
                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                    <option value="all">كل الحالات</option>
                    <option value="available">متاحة</option>
                    <option value="booked">محجوزة</option>
                    <option value="maintenance">صيانة</option>
                </Select>
            </div>
            
            {/* Desktop Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto hidden lg:block">
                <table className="w-full">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm">
                            <th className="px-4 py-3">السيارة</th>
                            <th className="px-4 py-3">رقم اللوحة</th>
                            {user?.role === 'HeadAdmin' && <th className="px-4 py-3">الفرع</th>}
                            <th className="px-4 py-3">الحالة</th>
                            <th className="px-4 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
                        {filteredCars.map(car => (
                            <tr key={car.id} className="text-gray-700 dark:text-gray-300">
                                <td className="px-4 py-3">
                                    <div className="flex items-center text-sm">
                                        <div className="relative hidden w-12 h-12 mr-3 rounded-full md:block flex-shrink-0">
                                            <img className="object-cover w-full h-full rounded-md" src={car.images[0]} alt="" loading="lazy" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{car.make} {car.model}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{car.year}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-mono">{car.license_plate}</td>
                                {user?.role === 'HeadAdmin' && <td className="px-4 py-3 text-sm">{getBranchName(car.branchId)}</td>}
                                <td className="px-4 py-3 text-xs">{getStatusChip(car.status)}</td>
                                <td className="px-4 py-3"><Button size="sm" onClick={() => handleOpenModal(car)}>تعديل</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {filteredCars.map(car => (
                <div key={car.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100">{car.make} {car.model} ({car.year})</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{car.license_plate}</p>
                        </div>
                        {getStatusChip(car.status)}
                    </div>
                    {user?.role === 'HeadAdmin' && <p className="text-xs text-gray-500 dark:text-gray-400">الفرع: {getBranchName(car.branchId)}</p>}
                    <div className="flex justify-end pt-2 border-t dark:border-gray-700">
                        <Button size="sm" onClick={() => handleOpenModal(car)}>تعديل</Button>
                    </div>
                </div>
                ))}
            </div>
            
            <CarFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCar}
                car={selectedCar}
                user={user}
                carModels={carModels}
                branches={branches}
            />
        </div>
    );
};

export default AdminFleetPage;
