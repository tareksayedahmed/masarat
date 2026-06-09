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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedModel(null);
    }

    const handleSaveModel = async (modelToSave: CarModel) => {
        try {
            if (selectedModel) {
                await api.put(`/carmodels/${modelToSave.key}`, modelToSave);
            } else {
                await api.post('/carmodels', modelToSave);
            }
            fetchModels();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save car model:", error);
            alert("فشل حفظ الطراز.");
        }
    };
    
    const handleResetFilters = () => {
        setSearchQuery('');
        setCategoryFilter('all');
    };
    
    if (loading) return <div>جاري تحميل الطرازات...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">إدارة الأسعار والطرازات</h1>
                <Button onClick={() => handleOpenModal()}>إضافة طراز جديد</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="ابحث بالشركة المصنعة أو الموديل..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value="all">كل الفئات</option>
                    <option value="اقتصادية">اقتصادية</option>
                    <option value="سيدان">سيدان</option>
                    <option value="SUV">SUV</option>
                    <option value="شاحنة">شاحنة</option>
                </Select>
                <Button variant="secondary" onClick={handleResetFilters}>إعادة تعيين الفلاتر</Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm">
                            <th className="px-4 py-3">الطراز</th>
                            <th className="px-4 py-3">الفئة</th>
                            <th className="px-4 py-3">السعر اليومي</th>
                            <th className="px-4 py-3">السعر الأسبوعي</th>
                            <th className="px-4 py-3">السعر الشهري</th>
                            <th className="px-4 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
                        {filteredModels.map(model => (
                            <tr key={model.key} className="text-gray-700 dark:text-gray-300">
                                <td className="px-4 py-3">
                                    <div className="flex items-center text-sm">
                                        <div className="relative hidden w-12 h-12 mr-3 rounded-full md:block flex-shrink-0">
                                            <img className="object-cover w-full h-full rounded-md" src={model.images[0]} alt="" loading="lazy" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{model.make} {model.model}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{model.year}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm">{model.category}</td>
                                <td className="px-4 py-3 text-sm font-semibold">{model.daily_price} ريال</td>
                                <td className="px-4 py-3 text-sm">{model.weekly_price} ريال</td>
                                <td className="px-4 py-3 text-sm">{model.monthly_price} ريال</td>
                                <td className="px-4 py-3"><Button size="sm" onClick={() => handleOpenModal(model)}>تعديل</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <CarModelFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveModel}
                model={selectedModel}
            />
        </div>
    );
};

export default AdminPricingPage;
