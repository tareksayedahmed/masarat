import React, { useState } from 'react';
import { CAR_MODELS } from '../../constants';
import { CarModel } from '../../types';
import Button from '../../components/ui/Button';
import CarModelFormModal from '../../components/admin/CarModelFormModal';
import Input from '../../components/ui/Input';

const AdminPricingPage: React.FC = () => {
    const [models, setModels] = useState<CarModel[]>(CAR_MODELS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);

    const handleOpenModal = (model: CarModel | null = null) => {
        setSelectedModel(model);
        setIsModalOpen(true);
    };

    const handleSaveModel = (modelToSave: CarModel) => {
        if (selectedModel) {
            setModels(models.map(m => m.key === modelToSave.key ? modelToSave : m));
        } else {
            setModels([...models, modelToSave]);
        }
        setIsModalOpen(false);
        setSelectedModel(null);
    };
    
    const handlePriceChange = (modelKey: string, priceType: 'daily_price' | 'weekly_price' | 'monthly_price', newPrice: number) => {
        setModels(currentModels => 
            currentModels.map(model => 
                model.key === modelKey ? { ...model, [priceType]: newPrice } : model
            )
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة طرازات وأسعار الشركة</h1>
                <Button onClick={() => handleOpenModal()}>إضافة طراز جديد</Button>
            </div>
            <p className="text-gray-500 mb-6 -mt-4">الأسعار هنا موحدة وتطبق على جميع السيارات من نفس الطراز في كل الفروع.</p>

            {/* Desktop Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto hidden lg:block">
                <table className="w-full whitespace-no-wrap">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50 text-xs">
                            <th className="px-4 py-3">الطراز</th>
                            <th className="px-2 py-3">السعر (يومي)</th>
                            <th className="px-2 py-3">السعر (أسبوعي)</th>
                            <th className="px-2 py-3">السعر (شهري)</th>
                            <th className="px-4 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {models.map(model => (
                            <tr key={model.key} className="text-gray-700">
                                <td className="px-4 py-3">
                                    <div className="flex items-center text-sm">
                                        <div className="relative w-10 h-10 me-3 rounded-lg md:block bg-gray-100">
                                            <img className="object-cover w-full h-full rounded-lg" src={model.images[0]} alt={`${model.make} ${model.model}`} loading="lazy" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{model.make} {model.model}</p>
                                            <p className="text-xs text-gray-600">{model.year} - {model.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-2 py-3">
                                    <Input type="number" value={model.daily_price} onChange={e => handlePriceChange(model.key, 'daily_price', parseFloat(e.target.value) || 0)} className="max-w-[120px] text-sm" />
                                </td>
                                <td className="px-2 py-3">
                                    <Input type="number" value={model.weekly_price} onChange={e => handlePriceChange(model.key, 'weekly_price', parseFloat(e.target.value) || 0)} className="max-w-[120px] text-sm" />
                                </td>
                                <td className="px-2 py-3">
                                    <Input type="number" value={model.monthly_price} onChange={e => handlePriceChange(model.key, 'monthly_price', parseFloat(e.target.value) || 0)} className="max-w-[120px] text-sm" />
                                </td>
                                <td className="px-4 py-3">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(model)}>تعديل</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile & Tablet Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {models.map(model => (
                    <div key={model.key} className="bg-white p-4 rounded-lg shadow">
                         <div className="flex justify-between items-start">
                             <div>
                                 <p className="font-bold">{model.make} {model.model}</p>
                                 <p className="text-sm text-gray-500">{model.year} - {model.category}</p>
                             </div>
                             <Button variant="outline" size="sm" onClick={() => handleOpenModal(model)}>تعديل</Button>
                         </div>
                         <div className="border-t my-3"></div>
                         <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Input label="اليومي" type="number" value={model.daily_price} onChange={e => handlePriceChange(model.key, 'daily_price', parseFloat(e.target.value) || 0)} />
                                <Input label="الأسبوعي" type="number" value={model.weekly_price} onChange={e => handlePriceChange(model.key, 'weekly_price', parseFloat(e.target.value) || 0)} />
                                <Input label="الشهري" type="number" value={model.monthly_price} onChange={e => handlePriceChange(model.key, 'monthly_price', parseFloat(e.target.value) || 0)} />
                            </div>
                         </div>
                    </div>
                ))}
            </div>

            <CarModelFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveModel}
                model={selectedModel}
            />
        </div>
    );
};

export default AdminPricingPage;
