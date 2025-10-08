import React, { useState, useEffect } from 'react';
import { Car, User, CarModel } from '../../types';
import { BRANCHES } from '../../constants';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface CarFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (car: Car) => void;
    car: Car | null;
    user: User | null;
    carModels: CarModel[]; // Pass the master list of models
}

const CarFormModal: React.FC<CarFormModalProps> = ({ isOpen, onClose, onSave, car, user, carModels }) => {
    const initialCarState: Car = {
        id: '',
        modelKey: '',
        branchId: user?.role === 'BranchAdmin' ? user.branchId || '' : '',
        license_plate: '',
        available: true,
        status: 'available',
    };

    const [formData, setFormData] = useState<Car>(initialCarState);

    useEffect(() => {
        if (car) {
            setFormData(car);
        } else {
            // If adding a new car, default to the first model if available
            const defaultState = { ...initialCarState };
            if (carModels.length > 0) {
                defaultState.modelKey = carModels[0].key;
            }
            setFormData(defaultState);
        }
    }, [car, isOpen, carModels]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.modelKey) {
            alert('الرجاء اختيار طراز السيارة.');
            return;
        }
        if(!formData.branchId) {
            alert('الرجاء تحديد الفرع.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={car ? 'تعديل سيارة' : 'إضافة سيارة جديدة للأسطول'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="طراز السيارة (من القائمة الرئيسية)" name="modelKey" value={formData.modelKey} onChange={handleChange} required>
                    <option value="" disabled>اختر الطراز</option>
                    {carModels.map(m => (
                        <option key={m.key} value={m.key}>{m.make} {m.model} ({m.year})</option>
                    ))}
                </Select>
                 <Input label="رقم اللوحة" name="license_plate" value={formData.license_plate} onChange={handleChange} required />
                 {user?.role === 'HeadAdmin' && (
                     <Select label="الفرع" name="branchId" value={formData.branchId} onChange={handleChange} required>
                        <option value="">اختر فرع</option>
                        {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                     </Select>
                )}
                 <Select label="الحالة التشغيلية" name="status" value={formData.status} onChange={handleChange}>
                    <option value="available">متاحة</option>
                    <option value="maintenance">صيانة</option>
                    <option value="booked">محجوزة</option>
                </Select>
                 <div>
                    <label className="flex items-center">
                         <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={handleToggle}
                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <span className="ms-2 text-sm font-medium text-gray-900">متاحة للحجز الفوري</span>
                    </label>
                 </div>
                <div className="flex justify-end space-i-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
                    <Button type="submit">حفظ</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CarFormModal;
