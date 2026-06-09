import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { CarCard } from '../booking/CarCard';
import { BookingForm } from '../booking/BookingForm';
import { Modal } from '../ui/Modal';
import { CarModel } from '../../types';
import { RevealOnScroll } from './RevealOnScroll';

export const AvailableCarsCarousel: React.FC = () => {
  const { carModels, branches, loading } = useBookings();
  const { t } = useLanguage();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);

  if (loading) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <RevealOnScroll>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white">السيارات المتاحة بالفروع</h2>
              <p className="text-sm text-gray-400 mt-1">اختر الفرع الأقرب إليك لبدء تصفح السيارات المتوفرة فوراً للاستلام</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBranch('all')}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedBranch === 'all'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/15'
                    : 'bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                }`}
              >
                جميع الفروع
              </button>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranch(b.id)}
                  className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedBranch === b.id
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/15'
                      : 'bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {b.name.replace('فرع ', '')}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Cars List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carModels.map((model, idx) => (
            <RevealOnScroll key={model.id} delay={idx * 50}>
              <CarCard model={model} onBook={(m) => setSelectedModel(m)} />
            </RevealOnScroll>
          ))}
        </div>

      </div>

      {/* Booking Dialog */}
      {selectedModel && (
        <Modal
          isOpen={!!selectedModel}
          onClose={() => setSelectedModel(null)}
          title={`حجز سيارات ${selectedModel.brand} ${selectedModel.name}`}
          size="lg"
        >
          <BookingForm
            model={selectedModel}
            onSuccess={() => setSelectedModel(null)}
            onCancel={() => setSelectedModel(null)}
          />
        </Modal>
      )}
    </section>
  );
};

export default AvailableCarsCarousel;
