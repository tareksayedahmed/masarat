import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Branch, FullCarDetails, Booking } from '../types';
import CarCard from '../components/booking/CarCard';
import Modal from '../components/ui/Modal';
import BookingForm from '../components/booking/BookingForm';
import Select from '../components/ui/Select';
import { useBookings } from '../context/BookingContext';
import api from '../api';

const CarsPage: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [branchCars, setBranchCars] = useState<(FullCarDetails & { branchName?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCar, setSelectedCar] = useState<FullCarDetails | null>(null);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const { addBooking } = useBookings();

  useEffect(() => {
    const fetchCarsAndBranch = async () => {
      if (!branchId) return;
      setIsLoading(true);
      try {
        const [branchesRes, fleetRes] = await Promise.all([
          api.get('/data/branches'),
          api.get('/data/fleet')
        ]);
        
        const allBranches: Branch[] = branchesRes.data;
        const currentBranch = allBranches.find(b => b.id === branchId) || null;
        setBranch(currentBranch);
        
        const allCars: FullCarDetails[] = fleetRes.data;
        let carsForBranch: (FullCarDetails & { branchName?: string })[] = [];

        if (branchId === 'e-branch') {
           const eBranchRegions = ['الرياض', 'المنطقة الشرقية', 'المنطقة الشمالية'];
           const allowedBranchIds = new Set(allBranches.filter(b => eBranchRegions.includes(b.region)).map(b => b.id));
           const branchesMap = new Map(allBranches.map(b => [b.id, b.name]));
           carsForBranch = allCars
            .filter(c => c.available && allowedBranchIds.has(c.branchId))
            .map(c => ({...c, branchName: branchesMap.get(c.branchId)}));
        } else {
            carsForBranch = allCars.filter(c => c.branchId === branchId);
        }
        
        setBranchCars(carsForBranch);

      } catch (error) {
        console.error("Failed to fetch car data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarsAndBranch();
  }, [branchId]);

  const availableYears = useMemo(() => {
    const years = new Set(branchCars.map(car => car.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [branchCars]);

  const processedCars = useMemo(() => {
    let cars = [...branchCars];
    if (categoryFilter !== 'all') cars = cars.filter(car => car.category === categoryFilter);
    if (yearFilter !== 'all') cars = cars.filter(car => car.year.toString() === yearFilter);
    switch (sortOrder) {
      // FIX: Cast daily_price to Number to avoid type errors during arithmetic operation.
      case 'price_asc': cars.sort((a, b) => Number(a.daily_price) - Number(b.daily_price)); break;
      // FIX: Cast daily_price to Number to avoid type errors during arithmetic operation.
      case 'price_desc': cars.sort((a, b) => Number(b.daily_price) - Number(a.daily_price)); break;
      default: break;
    }
    return cars;
  }, [branchCars, categoryFilter, yearFilter, sortOrder]);

  const handleBook = (car: FullCarDetails) => {
    setSelectedCar(car);
    setBookingModalOpen(true);
  };
  
  const handleSaveBooking = async (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>) => {
    const success = await addBooking(bookingData);
    if (success) {
        setBookingModalOpen(false);
        setConfirmationOpen(true);
    } else {
        alert("فشل إنشاء الحجز. الرجاء المحاولة مرة أخرى.");
    }
  }
  
  if (isLoading) {
    return <div>جاري تحميل السيارات...</div>;
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
            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
        </Select>
        <Select id="sortOrder" label="ترتيب حسب" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">افتراضي</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processedCars.map(car => <CarCard key={car.id} car={car} onBook={handleBook} />)}
        {processedCars.length === 0 && <p>لا توجد سيارات مطابقة لمعايير البحث.</p>}
      </div>

      {selectedCar && (
        <Modal isOpen={isBookingModalOpen} onClose={() => setBookingModalOpen(false)} title={`حجز ${selectedCar.make} ${selectedCar.model}`}>
          <BookingForm car={selectedCar} onClose={() => setBookingModalOpen(false)} onSave={handleSaveBooking} />
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