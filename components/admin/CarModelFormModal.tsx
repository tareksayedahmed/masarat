import React, { useState, useEffect } from 'react';
import { CarModel } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface CarModelFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (model: CarModel) => void;
    model: CarModel | null;
}

const CarModelFormModal: React.FC<CarModelFormModalProps> = ({ isOpen, onClose, onSave, model }) => {
    const initialModelState: CarModel = {
        key: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'اقتصادية',
        daily_price: 0,
        weekly_price: 0,
        monthly_price: 0,
        images: ['https://i.ibb.co/9vj7h2b/car-placeholder.png'],
    };

    const [formData, setFormData] = useState<CarModel>(initialModelState);

    useEffect(() => {
        if (model) {
            setFormData(model);
        } else {
            setFormData(initialModelState);
        }
    }, [model, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['year', 'daily_price', 'weekly_price', 'monthly_price'].includes(name);
        setFormData({
            ...formData,
            [name]: isNumeric ? parseFloat(value) || 0 : value,
        });
    };
    
     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, images: [e.target.value] });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const modelToSave = {
            ...formData,
            // Generate key if it's a new model
            key: formData.key || `${formData.make}-${formData.model}-${formData.year}`.toLowerCase().replace(/\s+/g, '-')
        };
        onSave(modelToSave);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={model ? 'تعديل طراز سيارة' : 'إضافة طراز جديد'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="الشركة المصنعة" name="make" value={formData.make} onChange={handleChange} required />
                    <Input label="الموديل" name="model" value={formData.model} onChange={handleChange} required />
                    <Input label="سنة الصنع" name="year" type="number" value={formData.year} onChange={handleChange} required />
                     <Select label="الفئة" name="category" value={formData.category} onChange={handleChange}>
                        <option value="اقتصادية">اقتصادية</option>
                        <option value="سيدان">سيدان</option>
                        <option value="SUV">SUV</option>
                        <option value="شاحنة">شاحنة</option>
                    </Select>
                </div>
                 <Input label="رابط الصورة" name="image" type="url" value={formData.images[0]} onChange={handleImageChange} required />

                <hr />
                <h4 className="font-bold">التسعير الموحد</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="السعر اليومي" name="daily_price" type="number" value={formData.daily_price} onChange={handleChange} required />
                    <Input label="السعر الأسبوعي" name="weekly_price" type="number" value={formData.weekly_price} onChange={handleChange} />
                    <Input label="السعر الشهري" name="monthly_price" type="number" value={formData.monthly_price} onChange={handleChange} />
                </div>

                <div className="flex justify-end space-i-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
                    <Button type="submit">حفظ</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CarModelFormModal;
