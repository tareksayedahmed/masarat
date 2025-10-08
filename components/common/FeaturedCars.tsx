
import React, { useState, useEffect } from 'react';
import { CAR_MODELS } from '../../constants';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';

const FeaturedCars: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = CAR_MODELS.filter(c => ['SUV', 'سيدان'].includes(c.category)).slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featured.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(timer);
  }, [featured.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="relative h-96 overflow-hidden rounded-lg">
        {featured.map((car, index) => (
          <div
            key={car.key}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'
            }`}
          >
            <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 p-8 text-white">
                <h3 className="text-3xl font-bold">{car.make} {car.model}</h3>
                <p className="mt-2">ابتداءً من <span className="text-2xl font-bold text-orange-400">{car.daily_price} ريال</span>/يوم</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute z-20 flex space-i-3 -bottom-5 transform -translate-x-1/2 start-1/2">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-orange-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCars;
