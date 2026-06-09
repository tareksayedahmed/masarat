import React from 'react';
import { CarModel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Fuel, ShieldAlert, Cpu, Heart } from 'lucide-react';

interface CarCardProps {
  model: CarModel;
  onBook: (model: CarModel) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ model, onBook }) => {
  const { t } = useLanguage();

  return (
    <Card hoverable className="flex flex-col h-full overflow-hidden !p-0">
      {/* Image container */}
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={model.imageUrl}
          alt={model.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow px-2.5 py-1 rounded-lg text-xs font-bold text-orange-600">
          {model.brand}
        </div>
        {model.fuelType === 'electric' && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white shadow px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>كهربائية 100%</span>
          </div>
        )}
      </div>

      {/* Body specifications */}
      <div className="p-5 flex-grow flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {model.name}
          </h3>
          <span className="text-xs text-gray-400 font-mono tracking-wide uppercase">{model.type}</span>
        </div>

        {/* Features Specs list */}
        <div className="grid grid-cols-2 gap-2 text-xs border-y border-gray-100 dark:border-gray-800 py-3.5 text-gray-600 dark:text-gray-350">
          <div className="flex items-center gap-1.5 justify-start">
            <Fuel className="w-4 h-4 text-orange-500" />
            <span>{model.fuelType === 'electric' ? 'كهرباء' : 'بنزين 91/95'}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-start">
            <span className="font-bold text-orange-500 font-mono">⚡</span>
            <span>{model.transmission === 'automatic' ? 'أوتوماتيك' : 'يدوي'}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-start">
            <span className="font-bold text-orange-500">👥</span>
            <span>{model.seats} {t('seatCount')}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-start">
            <span className="font-bold text-orange-500">⭐</span>
            <span className="truncate">تأمين شامل مدرج</span>
          </div>
        </div>

        {/* Features list */}
        <div className="flex flex-wrap gap-1">
          {model.features.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md"
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Tiered pricing details display */}
        <div className="bg-gray-50 dark:bg-gray-800/20 p-3 rounded-xl border border-gray-100 dark:border-gray-800/40 text-xs space-y-2 text-right">
          <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">باقات وأسعار المدد المخفّضة:</div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">إيجار يومي (أقل من أسبوع):</span>
            <span className="font-bold text-gray-850 dark:text-gray-200 font-mono">{model.pricePerDay} ريال/يوم</span>
          </div>
          <div className="flex justify-between items-center text-orange-600 dark:text-orange-400">
            <span className="text-gray-500 font-medium">باقة أسبوعية (أكثر من ٧ أيام):</span>
            <span className="font-bold font-mono">{model.pricePerWeek || Math.round(model.pricePerDay * 0.85)} ريال/يوم</span>
          </div>
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-gray-500 font-medium">باقة شهرية (أكثر من ٣٠ يوم):</span>
            <span className="font-bold font-mono">{model.pricePerMonth || Math.round(model.pricePerDay * 0.75)} ريال/يوم</span>
          </div>
        </div>

        {/* Bottom Booking rate & Action */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-gray-50 dark:border-gray-800/40">
          <div>
            <span className="text-lg font-extrabold text-orange-600 dark:text-orange-500 font-mono">
              {model.pricePerDay}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">تبدأ من ريال/يوم</p>
          </div>
          <Button size="sm" onClick={() => onBook(model)} className="px-4.5 py-2">
            {t('bookNow')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CarCard;
