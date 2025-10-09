import React from 'react';
import { FullCarDetails } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface CarCardProps {
  car: FullCarDetails & { branchName?: string };
  onBook: (car: FullCarDetails) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  return (
    <Card className="flex flex-col">
      <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
        <p className="text-gray-500">{car.category} - {car.year}</p>
        {car.branchName && (
            <p className="text-xs font-semibold text-orange-800 bg-orange-100 rounded-full px-2 py-0.5 mt-2 self-start flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                متوفر في: {car.branchName}
            </p>
        )}
        <div className="mt-4 flex-grow">
            <span className="text-2xl font-extrabold text-orange-600">{car.daily_price} ريال</span>
            <span className="text-gray-500">/يوم</span>
        </div>
        <Button onClick={() => onBook(car)} disabled={!car.available} className="mt-4 w-full">
          {car.available ? 'احجز الآن' : 'غير متاحة'}
        </Button>
      </div>
    </Card>
  );
};

export default CarCard;