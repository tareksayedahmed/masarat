import React, { useState, useEffect } from 'react';
import { Car, CarModel, Branch } from '../../types';
import { useBookings } from '../../context/BookingContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface CarFormModalProps {
  car?: Car | null; // Null if adding
  onClose: () => void;
}

export const CarFormModal: React.FC<CarFormModalProps> = ({ car, onClose }) => {
  const { carModels, branches, addCar, updateCar } = useBookings();
  const [loading, setLoading] = useState(false);

  // States
  const [modelId, setModelId] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [branchId, setBranchId] = useState('');
  const [mileage, setMileage] = useState('');
  const [status, setStatus] = useState<'available' | 'rented' | 'maintenance'>('available');

  useEffect(() => {
    if (car) {
      setModelId(car.modelId);
      setPlateNumber(car.plateNumber);
      setColor(car.color);
      setYear(car.year.toString());
      setBranchId(car.branchId);
      setMileage(car.mileage.toString());
      setStatus(car.status);
    } else {
      if (carModels.length > 0) setModelId(carModels[0].id);
      if (branches.length > 0) setBranchId(branches[0].id);
      setPlateNumber('');
      setColor('');
      setYear('2024');
      setMileage('5000');
      setStatus('available');
    }
  }, [car, carModels, branches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        modelId,
        plateNumber,
        color,
        year: parseInt(year) || 2024,
        branchId,
        mileage: parseInt(mileage) || 0,
        status,
      };

      if (car) {
        await updateCar(car.id, payload);
      } else {
        await addCar(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('نأسف، حدث خطأ أثناء الحفظ. يرجى مراجعة المدخلات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
      <Select
        label="فئة موديل السيارة"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        options={carModels.map(m => ({ value: m.id, label: `${m.brand} - ${m.name}` }))}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="رقم اللوحة (مثال: أ ب ج 1234)"
          required
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
        />
        <Input
          label="اللون"
          required
          placeholder="أبيض لؤلؤي"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="سنة الموديل (تاريخ التصنيع)"
          type="number"
          required
          placeholder="2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Input
          label="قراءة العداد الحالية (كم)"
          type="number"
          required
          placeholder="12000"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="موقع الإرساء (الفرع الحالي)"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          options={branches.map(b => ({ value: b.id, label: b.name }))}
        />
        <Select
          label="حالة التشغيل الحالية"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          options={[
            { value: 'available', label: 'جاهزة للإيجار (متوفرة)' },
            { value: 'rented', label: 'مؤجرة حالياً' },
            { value: 'maintenance', label: 'في الصيانة الفنية والوقائية' },
          ]}
        />
      </div>

      <div className="flex gap-3 mt-4 border-t border-gray-150 pt-4 dark:border-gray-800">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          إلغاء الإجراء
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {car ? 'تحديث وحفظ التعديلات' : 'إضافة للأسطول فورا'}
        </Button>
      </div>
    </form>
  );
};

export default CarFormModal;
