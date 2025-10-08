
import React, { useState, useMemo } from 'react';
import { CARS, CAR_MODELS, BRANCHES } from '../../constants';
import { FullCarDetails } from '../../types';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const AvailableCarsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);
  const branchesMap = useMemo(() => new Map(BRANCHES.map(b => [b.id, b.name])), []);

  const availableCars: (FullCarDetails & { branchName: string })[] = useMemo(() => {
    return CARS
        .filter(car => car.available)
        .map(car => {
            const model = carModelsMap.get(car.modelKey);
            const branchName = branchesMap.get(car.branchId);
            if (!model || !branchName) return null;
            return {
                ...car,
                make: model.make,
                model: model.model,
                year: model.year,
                category: model.category,
                daily_price: model.daily_price,
                weekly_price: model.weekly_price,
                monthly_price: model.monthly_price,
                images: model.images,
                branchName,
            };
        })
        .filter((c): c is (FullCarDetails & { branchName: string }) => c !== null);
  }, [carModelsMap, branchesMap]);

  if (availableCars.length === 0) {
    return <p className="text-center text-gray-500">لا توجد سيارات متاحة للحجز حالياً.</p>;
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? availableCars.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === availableCars.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="relative h-[28rem] overflow-hidden rounded-lg">
        {availableCars.map((car, index) => (
          <div
            key={car.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 translate-x-0' : 
              index === (currentIndex - 1 + availableCars.length) % availableCars.length ? 'opacity-0 -translate-x-full' : 
              'opacity-0 translate-x-full'
            }`}
          >
            <Card className="w-full h-full flex flex-col md:flex-row items-center overflow-hidden">
                <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full md:w-1/2 h-64 md:h-full object-cover" />
                <div className="p-6 flex flex-col justify-between items-start flex-grow h-full text-right w-full md:w-1/2">
                    <div>
                        <p className="text-sm font-semibold text-orange-600">{car.branchName}</p>
                        <h3 className="text-2xl font-bold mt-1">{car.make} {car.model} ({car.year})</h3>
                        <p className="text-gray-500">{car.category}</p>
                    </div>
                    <div className="mt-auto pt-4 w-full">
                        <p className="text-gray-600">يبدأ من</p>
                        <p>
                            <span className="text-3xl font-extrabold text-gray-800">{car.daily_price} ريال</span>
                            <span className="text-gray-500">/يوم</span>
                        </p>
                        <Link to={`/cars/${car.branchId}`}>
                           <Button className="mt-6 w-full">احجز الآن</Button>
                        </Link>
                    </div>
                </div>
            </Card>
          </div>
        ))}
      </div>
      {/* Navigation Buttons */}
      <button onClick={handlePrev} className="absolute top-1/2 -translate-y-1/2 start-0 md:-start-12 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
       <button onClick={handleNext} className="absolute top-1/2 -translate-y-1/2 end-0 md:-end-12 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};

export default AvailableCarsCarousel;
