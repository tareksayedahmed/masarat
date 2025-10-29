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
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
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
            const matchesBranch = user?.role !== UserRole.HeadAdmin || branchFilter === 'all' || car.branchId === branchFilter;
            const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
            return matchesSearch && matchesBranch && matchesStatus;
        });
    }, [userVisibleFleet, searchQuery, branchFilter, statusFilter, user]);

    // FIX: Define handleCloseModal function.
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    // Handlers for modal, save, toggle, etc. will now be API calls
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
    
    // other handlers (handleOpenModal, getStatusChip, etc.)
    
    if (loading) return <div>جاري تحميل الأسطول...</div>;

    return (
        <div>
            {/* Page content with filters and mapping over `filteredCars` */}
            <CarFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCar}
                car={selectedCar}
                user={user}
                carModels={carModels}
                branches={branches}
            />
            {/* ... other modals ... */}
        </div>
    );
};

export default AdminFleetPage;