import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Car, Branch, FullCarDetails } from '../types';
import { CARS, BRANCHES, CAR_MODELS, E_BRANCH_VISIBLE_REGIONS } from '../constants';
import CarCard from '../components/booking/CarCard';
import Modal from '../components/ui/Modal';
import BookingForm from '../components/booking/BookingForm';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';

const CarsPage: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [selectedCar, setSelectedCar] = useState<FullCarDetails | null>(null);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const { user } = useAuth();
  
  const carModelsMap = useMemo(() => new Map(CAR_MODELS.map(m => [m.key, m])), []);

  const branchCars: (FullCarDetails & { branchName?: string })[] = useMemo(() => {
    const branchesMap = new Map(BRANCHES.map(b => [b.id, b]));
    
    let physicalCarsInBranch: Car[];
    if (branchId === 'e-branch') {
        const allowedBranchIds = new Set(
            BRANCHES
                .filter(b => E_BRANCH_VISIBLE_REGIONS.includes(b.region))
                .map(b => b.id)
        );
        physicalCarsInBranch = CARS.filter(c => c.available && allowedBranchIds.has(c.branchId));
    } else {
        physicalCarsInBranch = CARS.filter(c => c.branchId === branchId);
    }


    // FIX: Add an explicit return type to the map callback to ensure correct type inference for the filter's type predicate.
    return physicalCarsInBranch.map((car): (FullCarDetails & { branchName?: string }) | null => {
        const model = carModelsMap.get(car.modelKey);
        if (!model) return null;

        const carBranch = branchesMap.get(car.branchId);

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
            branchName: branchId === 'e-branch' ? carBranch?.name : undefined,
        };
    }).filter((c): c is (FullCarDetails & { branchName?: string }) => c !== null);
  }, [branchId, carModelsMap]);

  const availableYears = useMemo(() => {
    const years = new Set(branchCars.map(car => car.year));
    return Array.from(years).sort((a, b) => b - a); // Sort years descending
  }, [branchCars]);

  const processedCars = useMemo(() => {
    let cars = [...branchCars];

    // Apply category filter
    if (categoryFilter !== 'all') {
        cars = cars.filter(car => car.category === categoryFilter);
    }

    // Apply year filter
    if (yearFilter !== 'all') {
        cars = cars.filter(car => car.year.toString() === yearFilter);
    }

    // Apply sorting
    switch (sortOrder) {
        case 'price_asc':
            cars.sort((a, b) => a.daily_price - b.daily_price);
            break;
        case 'price_desc':
            cars.sort((a, b) => b.daily_price - a.daily_price);
            break;
        default:
            // Default sort (e.g., by model year or make) can be added here
            break;
    }

    return cars;
  }, [branchCars, categoryFilter, yearFilter, sortOrder]);


  useEffect(() => {
    const currentBranch = BRANCHES.find(b => b.id === branchId) || null;
    setBranch(currentBranch);
  }, [branchId]);

  const handleBook = (car: FullCarDetails) => {
    setSelectedCar(car);
    setBookingModalOpen(true);
  };
  
  const handleConfirmBooking = () => {
    setBookingModalOpen(false);
    setConfirmationOpen(true);
  }
  
  if (!branch) {
    return <div>الفرع غير موجود.</div>;
  }

  return (
    <div>
      <Link to="/branches" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-4 group transition-colors duration-200">
        <span>العودة لاختيار فرع آخر</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ms-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
      <h1 className="text-4xl font-extrabold mb-2">السيارات المتاحة في {branch.name}</h1>
      <p className="text-lg text-gray-500 mb-8">تصفح أسطولنا واختر ما يناسبك.</p>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select id="categoryFilter" label="تصفية حسب الفئة" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">الكل</option>
            <option value="سيدان">سيدان</option>
            <option value="SUV">SUV</option>
            <option value="اقتصادية">اقتصادية</option>
            <option value="شاحنة">شاحنة</option>
        </Select>
         <Select id="yearFilter" label="تصفية حسب السنة" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="all">كل السنوات</option>
            {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
            ))}
        </Select>
        <Select id="sortOrder" label="ترتيب حسب" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">افتراضي</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processedCars.map(car => (
          <CarCard key={car.id} car={car} onBook={handleBook} />
        ))}
        {processedCars.length === 0 && <p>لا توجد سيارات مطابقة لمعايير البحث.</p>}
      </div>

      {selectedCar && (
        <Modal isOpen={isBookingModalOpen} onClose={() => setBookingModalOpen(false)} title={user ? `حجز ${selectedCar.make} ${selectedCar.model}` : "تسجيل الدخول للمتابعة"}>
          <BookingForm car={selectedCar} onClose={() => setBookingModalOpen(false)} onConfirm={handleConfirmBooking} />
        </Modal>
      )}

       <Modal isOpen={isConfirmationOpen} onClose={() => setConfirmationOpen(false)} title="تم استلام طلبك">
          <div className="text-center">
            <p className="text-lg">شكراً لك! تم إرسال طلب الحجز بنجاح.</p>
            <p className="text-gray-600 mt-2">سيتم التواصل معك للتأكيد. يمكنك متابعة حالة الحجز من صفحتك الشخصية.</p>
          </div>
        </Modal>
    </div>
  );
};

export default CarsPage;