import React, { useState, useMemo, useEffect } from 'react';
import { CarModel } from '../../types';
import Button from '../../components/ui/Button';
import CarModelFormModal from '../../components/admin/CarModelFormModal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import api from '../../api';

const AdminPricingPage: React.FC = () => {
    const [models, setModels] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    
    const fetchModels = async () => {
        setLoading(true);
        try {
            const res = await api.get('/data/carmodels');
            setModels(res.data);
        } catch (error) {
            console.error("Failed to fetch car models:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    const filteredModels = useMemo(() => {
        return models.filter(model => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchLower === '' || model.make.toLowerCase().includes(searchLower) || model.model.toLowerCase().includes(searchLower);
            const matchesCategory = categoryFilter === 'all' || model.category === categoryFilter;
            return matchesSearch && matchesCategory;
        }).sort((a,b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));
    }, [models, searchQuery, categoryFilter]);

    const handleOpenModal = (model: CarModel | null = null) => {
        setSelectedModel(model);
        setIsModalOpen(true);
    };

    const handleSaveModel = async (modelToSave: CarModel) => {
        try {
            if (selectedModel) {
                await api.put(`/carmodels/${modelToSave.key}`, modelToSave);
            } else {
                await api.post('/carmodels', modelToSave);
            }
            fetchModels();
            setIsModalOpen(false);
            setSelectedModel(null);
        } catch (error) {
            console.error("Failed to save car model:", error);
            alert("فشل حفظ الطراز.");
        }
    };
    
    // handlePriceChange, resetFilters, etc.
    
    if (loading) return <div>جاري تحميل الطرازات...</div>;

    return (
        <div>
            {/* Page content with filters and mapping over `filteredModels` */}
             <CarModelFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveModel}
                model={selectedModel}
            />
            {/* ... other modals */}
        </div>
    );
};

export default AdminPricingPage;
