import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface CarModelFormModalProps {
  onClose: () => void;
}

export const CarModelFormModal: React.FC<CarModelFormModalProps> = ({ onClose }) => {
  const { addPricingRule } = useBookings();
  const [loading, setLoading] = useState(false);

  // States
  const [name, setName] = useState('');
  const [type, setType] = useState<'seasonal' | 'weekend' | 'holiday'>('seasonal');
  const [multiplier, setMultiplier] = useState('1.15');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPricingRule({
        name,
        type,
        multiplier: parseFloat(multiplier) || 1.0,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('نأسف، حدث خطأ أثناء إضافة قاعدة الأسعار');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
      <Input
        label="اسم قاعدة التسعير الاستثنائية"
        required
        placeholder="مثال: ذروة إجازة الصيف، عطلة نهاية الأسبوع"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Select
        label="نوع القاعدة الضريبية/الموسمية"
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        options={[
          { value: 'seasonal', label: 'مواسم الصيف والذورة الزرقاء' },
          { value: 'weekend', label: 'عطل نهاية الأسبوع (الجمعة والسبت)' },
          { value: 'holiday', label: 'أعياد ومناسبات وطنية سعيدة' },
        ]}
      />

      <Input
        label="مضاعف التكلفة وضريبة الموسم الحرة (مثال: 1.15 يعني زيادة 15% باليوم)"
        type="number"
        step="0.01"
        required
        value={multiplier}
        onChange={(e) => setMultiplier(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">تبدأ من تاريخ:</label>
          <input
            type="date"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">تنتهي بتاريخ:</label>
          <input
            type="date"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-4 border-t border-gray-150 pt-4 dark:border-gray-800">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          إلغاء الإجراء
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          إدراج قاعدة التسعير فوراً
        </Button>
      </div>
    </form>
  );
};

export default CarModelFormModal;
