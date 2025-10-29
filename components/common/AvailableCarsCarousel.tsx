import React, { useState, useMemo, useEffect } from 'react';
import { FullCarDetails, Branch } from '../../types';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import api from '../../api';

const AvailableCarsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableCars, setAvailableCars] = useState<(FullCarDetails & { branchName: string })[]>([]);
  
  useEffect(() => {
    const fetchAvailable = async () => {
        try {
            const [fleetRes, branchesRes] = await Promise.all([
                api.get('/data/fleet'),
                api.get('/data/branches')
            ]);
            const allCars: FullCarDetails[] = fleetRes.data;
            const allBranches: Branch[] = branchesRes.data;
            const branchesMap = new Map(allBranches.map(b => [b.id, b.name]));

            const cars = allCars
                .filter(car => car.available)
                .map(car => {
                    const branchName = branchesMap.get(car.branchId);
                    if (!branchName) return null;
                    return { ...car, branchName };
                })
                .filter((c): c is (FullCarDetails & { branchName: string }) => c !== null);
            
            setAvailableCars(cars);
        } catch (error) {
            console.error("Failed to fetch available cars:", error);
        }
    };
    fetchAvailable();
  }, []);

  if (availableCars.length === 0) {
    return <p className="text-center text-gray-400">لا توجد سيارات متاحة حالياً.</p>;
  }

  const handlePrev = () => setCurrentIndex(prev => (prev === 0 ? availableCars.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex(prev => (prev === availableCars.length - 1 ? 0 : prev + 1));
  
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
                        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{car.make} {car.model} ({car.year})</h3>
                        <p className="text-gray-500 dark:text-gray-400">{car.category}</p>
                    </div>
                    <div className="mt-auto pt-4 w-full">
                        <p className="text-gray-600 dark:text-gray-300">يبدأ من</p>
                        <p>
                            <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{car.daily_price} ريال</span>
                            <span className="text-gray-500 dark:text-gray-400">/يوم</span>
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
      <button onClick={handlePrev} className="absolute top-1/2 -translate-y-1/2 start-0 md:-start-12 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
       <button onClick={handleNext} className="absolute top-1/2 -translate-y-1/2 end-0 md:-end-12 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};

export default AvailableCarsCarousel;
