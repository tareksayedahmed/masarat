import React, { useState, useEffect } from 'react';
import { Car, User, CarModel, Branch } from '../../types';
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
    carModels: CarModel[];
    branches: Branch[];
}

const CarFormModal: React.FC<CarFormModalProps> = ({ isOpen, onClose, onSave, car, user, carModels, branches }) => {
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
            const defaultState = { ...initialCarState };
            if (carModels.length > 0) defaultState.modelKey = carModels[0].key;
            setFormData(defaultState);
        }
    }, [car, isOpen, carModels]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.modelKey || !formData.branchId) {
            alert('الرجاء تعبئة جميع الحقول المطلوبة.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={car ? 'تعديل سيارة' : 'إضافة سيارة جديدة للأسطول'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="طراز السيارة" name="modelKey" value={formData.modelKey} onChange={handleChange} required>
                    <option value="" disabled>اختر الطراز</option>
                    {carModels.map(m => <option key={m.key} value={m.key}>{m.make} {m.model} ({m.year})</option>)}
                </Select>
                 <Input label="رقم اللوحة" name="license_plate" value={formData.license_plate} onChange={handleChange} required />
                 {user?.role === 'HeadAdmin' && (
                     <Select label="الفرع" name="branchId" value={formData.branchId} onChange={handleChange} required>
                        <option value="">اختر فرع</option>
                        {branches.filter(b => b.id !== 'e-branch').map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                     </Select>
                )}
                 {/* ... other form fields ... */}
                <div className="flex justify-end space-i-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
                    <Button type="submit">حفظ</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CarFormModal;
