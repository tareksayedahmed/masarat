import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { CarCard } from '../booking/CarCard';
import { BookingForm } from '../booking/BookingForm';
import { Modal } from '../ui/Modal';
import { CarModel } from '../../types';
import RevealOnScroll from './RevealOnScroll';

export const FeaturedCars: React.FC = () => {
  const { carModels, loading } = useBookings();
  const { t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg className="animate-spin h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white leading-tight mb-3">
              {t('featuredCars')}
            </h2>
            <p className="text-gray-500 dark:text-gray-450 text-sm sm:text-base">
              {t('featuredSubtitle')}
            </p>
          </div>
        </RevealOnScroll>

        {/* Carousel / Grid list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carModels.slice(0, 6).map((model, idx) => (
            <RevealOnScroll key={model.id} delay={idx * 100}>
              <CarCard model={model} onBook={(m) => setSelectedModel(m)} />
            </RevealOnScroll>
          ))}
        </div>

      </div>

      {/* Booking Form Dialog */}
      {selectedModel && (
        <Modal
          isOpen={!!selectedModel}
          onClose={() => setSelectedModel(null)}
          title={`حجز سيارة ${selectedModel.brand} ${selectedModel.name}`}
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

export default FeaturedCars;
