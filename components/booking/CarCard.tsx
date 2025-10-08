import React from 'react';
import { FullCarDetails } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface CarCardProps {
  car: FullCarDetails;
  onBook: (car: FullCarDetails) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onBook }) => {
  return (
    <Card className="flex flex-col">
      <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
        <p className="text-gray-500">{car.category} - {car.year}</p>
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
