import { Branch, Car, User, UserRole, Booking, AuditLog, CarModel } from './types';

export const BRANCHES: Branch[] = [
  { id: 'e-branch', name: 'الفرع الالكتروني', region: 'عبر الإنترنت', workingHours: '24 ساعة', phone: '920000000' },
  // الرياض
  { id: 'ryd-yarmuk', name: 'اليرموك', region: 'الرياض', workingHours: '09:00 ص - 11:00 م', phone: '920012345', lat: 24.8118, lng: 46.7801 },
  { id: 'ryd-masif', name: 'المصيف', region: 'الرياض', workingHours: '09:00 ص - 11:00 م', phone: '920012346', lat: 24.7656, lng: 46.6631 },
  { id: 'ryd-ulaya', name: 'العليا', region: 'الرياض', workingHours: '10:00 ص - 10:00 م', phone: '920012347', lat: 24.7063, lng: 46.6833 },
  { id: 'ryd-airport-t1', name: 'المطار صالة 1', region: 'الرياض', workingHours: '24/7', phone: '920012348', lat: 24.9578, lng: 46.7011 },
  { id: 'ryd-airport-t2', name: 'المطار صالة 2', region: 'الرياض', workingHours: '24/7', phone: '920012349', lat: 24.9578, lng: 46.7011 },
  { id: 'ryd-airport-t3', name: 'المطار صالة 3', region: 'الرياض', workingHours: '24/7', phone: '920012350', lat: 24.9578, lng: 46.7011 },
  { id: 'ryd-airport-t4', name: 'المطار صالة 4', region: 'الرياض', workingHours: '24/7', phone: '920012351', lat: 24.9578, lng: 46.7011 },
  { id: 'ryd-airport-t5', name: 'المطار صالة 5', region: 'الرياض', workingHours: '24/7', phone: '920012352', lat: 24.9578, lng: 46.7011 },
  { id: 'ryd-north-train', name: 'محطة قطار الشمال', region: 'الرياض', workingHours: '08:00 ص - 10:00 م', phone: '920012353', lat: 24.8219, lng: 46.6853 },
  
  // المنطقة الشرقية
  { id: 'dmm-khuzama', name: 'الخزامة', region: 'المنطقة الشرقية', workingHours: '09:00 ص - 11:00 م', phone: '920012354', lat: 26.2843, lng: 50.2163 }, // Khobar
  { id: 'dmm-thuqba', name: 'الثقبة', region: 'المنطقة الشرقية', workingHours: '09:00 ص - 11:00 م', phone: '920012355', lat: 26.2621, lng: 50.2185 }, // Khobar
  
  // المنطقة الشمالية
  { id: 'north-arar', name: 'عرعر', region: 'المنطقة الشمالية', workingHours: '09:00 ص - 10:00 م', phone: '920012356', lat: 30.9833, lng: 41.0167 },
  { id: 'north-arar-airport', name: 'مطار عرعر', region: 'المنطقة الشمالية', workingHours: 'حسب الرحلات', phone: '920012357', lat: 30.9069, lng: 41.1381 },
  { id: 'north-sakaka', name: 'سكاكا', region: 'المنطقة الشمالية', workingHours: '09:00 ص - 10:00 م', phone: '920012358', lat: 29.9697, lng: 40.2064 },
  { id: 'north-jouf-airport', name: 'مطار الجوف', region: 'المنطقة الشمالية', workingHours: 'حسب الرحلات', phone: '920012359', lat: 29.7892, lng: 40.0994 },
  { id: 'north-rafha', name: 'رفحاء', region: 'المنطقة الشمالية', workingHours: '09:00 ص - 10:00 م', phone: '920012360', lat: 29.6253, lng: 43.5005 },
  { id: 'north-rafha-airport', name: 'مطار رفحاء', region: 'المنطقة الشمالية', workingHours: 'حسب الرحلات', phone: '920012361', lat: 29.6289, lng: 43.4864 },
  { id: 'north-turaif', name: 'طريف', region: 'المنطقة الشمالية', workingHours: '09:00 ص - 10:00 م', phone: '920012362', lat: 31.6756, lng: 38.6533 },
  { id: 'north-turaif-airport', name: 'مطار طريف', region: 'المنطقة الشمالية', workingHours: 'حسب الرحلات', phone: '920012363', lat: 31.6922, lng: 38.7297 },
];

export const CAR_MODELS: CarModel[] = [
  { "key": "toyota-raize-2023", "make": "تويوتا", "model": "رايز", "year": 2023, "category": "SUV", "daily_price": 412, "weekly_price": 2680, "monthly_price": 10300, "images": ["https://i.postimg.cc/q737V4Q2/toyota-raize.jpg"] },
  { "key": "toyota-rush-2023", "make": "تويوتا", "model": "رش واجن", "year": 2023, "category": "SUV", "daily_price": 491, "weekly_price": 3190, "monthly_price": 12300, "images": ["https://i.postimg.cc/L6jZqkM8/toyota-rush.jpg"] },
  { "key": "changan-eado-plus-2023", "make": "شانجان", "model": "ايدو بلس", "year": 2023, "category": "سيدان", "daily_price": 235, "weekly_price": 1530, "monthly_price": 5900, "images": ["https://i.postimg.cc/mD8z7WzG/changan-eado-plus.jpg"] },
  { "key": "toyota-yaris-2023", "make": "تويوتا", "model": "يارس", "year": 2023, "category": "اقتصادية", "daily_price": 142, "weekly_price": 920, "monthly_price": 3550, "images": ["https://i.postimg.cc/hG4w2yS3/toyota-yaris.jpg"] },
  { "key": "isuzu-dmax-2022", "make": "ايسوزو", "model": "ديماكس", "year": 2022, "category": "شاحنة", "daily_price": 349, "weekly_price": 2270, "monthly_price": 8750, "images": ["https://i.postimg.cc/W3dD29B5/isuzu-dmax.jpg"] },
  { "key": "changan-uni-v-2025", "make": "شانجان", "model": "يوني في", "year": 2025, "category": "سيدان", "daily_price": 277, "weekly_price": 1800, "monthly_price": 6950, "images": ["https://i.postimg.cc/GtCKMh6M/changan-uni-v.jpg"] },
  { "key": "toyota-veloz-2023", "make": "تويوتا", "model": "فيلوز", "year": 2023, "category": "SUV", "daily_price": 435, "weekly_price": 2830, "monthly_price": 10900, "images": ["https://i.postimg.cc/MHZQCk8B/toyota-veloz.jpg"] },
  { "key": "changan-alsvin-2023", "make": "شانجان", "model": "السفن", "year": 2023, "category": "اقتصادية", "daily_price": 139, "weekly_price": 900, "monthly_price": 3500, "images": ["https://i.postimg.cc/Wp0y1xR2/changan-alsvin.jpg"] },
  { "key": "chevrolet-tahoe-2023", "make": "شيفورلية", "model": "تاهو", "year": 2023, "category": "SUV", "daily_price": 501, "weekly_price": 3260, "monthly_price": 12550, "images": ["https://i.postimg.cc/7Z0tqLzF/chevrolet-tahoe.jpg"] },
  { "key": "changan-alsvin-2024", "make": "شانجان", "model": "السفن", "year": 2024, "category": "اقتصادية", "daily_price": 145, "weekly_price": 940, "monthly_price": 3600, "images": ["https://i.postimg.cc/Wp0y1xR2/changan-alsvin.jpg"] },
  { "key": "geely-emgrand-2026", "make": "جيلي", "model": "EMGRAND", "year": 2026, "category": "سيدان", "daily_price": 273, "weekly_price": 1770, "monthly_price": 6850, "images": ["https://i.postimg.cc/pT3Y94b2/geely-emgrand.jpg"] },
  { "key": "geely-gx3pro-2025", "make": "جيلي", "model": "GX3PRO", "year": 2025, "category": "SUV", "daily_price": 546, "weekly_price": 3550, "monthly_price": 13650, "images": ["https://i.postimg.cc/3Jd0kS3x/geely-gx3pro.jpg"] },
  { "key": "geely-okavango-2025", "make": "جيلي", "model": "اوكافنجو", "year": 2025, "category": "SUV", "daily_price": 511, "weekly_price": 3320, "monthly_price": 12800, "images": ["https://i.postimg.cc/k47jC3h3/geely-okavango.jpg"] },
  { "key": "geely-gx3pro-2026", "make": "جيلي", "model": "GX3PRO", "year": 2026, "category": "SUV", "daily_price": 393, "weekly_price": 2550, "monthly_price": 9850, "images": ["https://i.postimg.cc/3Jd0kS3x/geely-gx3pro.jpg"] },
  { "key": "hyundai-i10-2025", "make": "هيونداي", "model": "i 10", "year": 2025, "category": "اقتصادية", "daily_price": 142, "weekly_price": 920, "monthly_price": 3550, "images": ["https://i.postimg.cc/cLYxS1mp/hyundai-i10.jpg"] },
  { "key": "changan-uni-t-2023", "make": "شانجان", "model": "يوني تي", "year": 2023, "category": "SUV", "daily_price": 361, "weekly_price": 2350, "monthly_price": 9050, "images": ["https://i.postimg.cc/prgBLpYx/changan-uni-t.jpg"] },
  { "key": "hyundai-azera-2025", "make": "هيونداي", "model": "AZERA", "year": 2025, "category": "سيدان", "daily_price": 295, "weekly_price": 1920, "monthly_price": 7400, "images": ["https://i.postimg.cc/L8yS47s3/hyundai-azera.jpg"] },
  { "key": "geely-preface-2026", "make": "جيلي", "model": "PREFACE", "year": 2026, "category": "سيدان", "daily_price": 254, "weekly_price": 1650, "monthly_price": 6350, "images": ["https://i.postimg.cc/ydpG1G7z/geely-preface.jpg"] },
  { "key": "ford-taurus-2025", "make": "فورد", "model": "تورس", "year": 2025, "category": "سيدان", "daily_price": 269, "weekly_price": 1750, "monthly_price": 6750, "images": ["https://i.postimg.cc/J0B7y4T6/ford-taurus.jpg"] },
  { "key": "toyota-camry-2025", "make": "تويوتا", "model": "كامري", "year": 2025, "category": "سيدان", "daily_price": 220, "weekly_price": 1430, "monthly_price": 5500, "images": ["https://i.postimg.cc/d1hKk4B7/toyota-camry.jpg"] },
  { "key": "changan-uni-k-2025", "make": "شانجان", "model": "يوني كي", "year": 2025, "category": "SUV", "daily_price": 535, "weekly_price": 3480, "monthly_price": 13400, "images": ["https://i.postimg.cc/WbYd2c9L/changan-uni-k.jpg"] },
  { "key": "changan-cs35-2023", "make": "شانجان", "model": "CS 35", "year": 2023, "category": "SUV", "daily_price": 381, "weekly_price": 2480, "monthly_price": 9550, "images": ["https://i.postimg.cc/13kxtqVv/changan-cs35.jpg"] },
  { "key": "changan-uni-v-2024", "make": "شانجان", "model": "يوني في", "year": 2024, "category": "سيدان", "daily_price": 269, "weekly_price": 1750, "monthly_price": 6750, "images": ["https://i.postimg.cc/GtCKMh6M/changan-uni-v.jpg"] },
  { "key": "nissan-sunny-2022", "make": "نيسان", "model": "صني", "year": 2022, "category": "اقتصادية", "daily_price": 158, "weekly_price": 1030, "monthly_price": 3950, "images": ["https://i.postimg.cc/d0DkX0zL/nissan-sunny.jpg"] },
  { "key": "toyota-yaris-2022", "make": "تويوتا", "model": "يارس", "year": 2022, "category": "اقتصادية", "daily_price": 139, "weekly_price": 900, "monthly_price": 3500, "images": ["https://i.postimg.cc/hG4w2yS3/toyota-yaris.jpg"] },
  { "key": "nissan-sunny-2020", "make": "نيسان", "model": "صني", "year": 2020, "category": "اقتصادية", "daily_price": 141, "weekly_price": 920, "monthly_price": 3550, "images": ["https://i.postimg.cc/d0DkX0zL/nissan-sunny.jpg"] },
  { "key": "changan-hunter-2023", "make": "شانجان", "model": "هنتر بكب غمارتين", "year": 2023, "category": "شاحنة", "daily_price": 349, "weekly_price": 2270, "monthly_price": 8750, "images": ["https://i.postimg.cc/L5KZyQYd/changan-hunter.jpg"] },
  { "key": "changan-uni-k-2023", "make": "شانجان", "model": "يوني كي", "year": 2023, "category": "SUV", "daily_price": 465, "weekly_price": 3020, "monthly_price": 11650, "images": ["https://i.postimg.cc/WbYd2c9L/changan-uni-k.jpg"] }
];

export const CARS: Car[] = [
  { "id": "car-010", "modelKey": "toyota-raize-2023", "branchId": "ryd-yarmuk", "license_plate": "ر ق غ 856", "available": true, "status": "available" },
  { "id": "car-011", "modelKey": "toyota-rush-2023", "branchId": "ryd-masif", "license_plate": "ذ ظ ج 158", "available": true, "status": "available" },
  { "id": "car-012", "modelKey": "changan-eado-plus-2023", "branchId": "ryd-ulaya", "license_plate": "ظ ض ك 997", "available": true, "status": "available" },
  { "id": "car-013", "modelKey": "toyota-yaris-2023", "branchId": "ryd-airport-t1", "license_plate": "خ ج أ 103", "available": true, "status": "available" },
  { "id": "car-014", "modelKey": "toyota-yaris-2023", "branchId": "ryd-airport-t2", "license_plate": "ب ل م 204", "available": true, "status": "available" },
  { "id": "car-017", "modelKey": "isuzu-dmax-2022", "branchId": "ryd-airport-t5", "license_plate": "أ غ ن 220", "available": true, "status": "available" },
  { "id": "car-018", "modelKey": "changan-uni-v-2025", "branchId": "ryd-north-train", "license_plate": "أ غ ل 282", "available": true, "status": "available" },
  { "id": "car-019", "modelKey": "toyota-veloz-2023", "branchId": "dmm-khuzama", "license_plate": "ح ش ز 922", "available": true, "status": "available" },
  { "id": "car-020", "modelKey": "changan-alsvin-2023", "branchId": "dmm-thuqba", "license_plate": "أ ي و 936", "available": true, "status": "available" },
  { "id": "car-021", "modelKey": "chevrolet-tahoe-2023", "branchId": "north-arar", "license_plate": "ط ح ف 816", "available": false, "status": "booked" },
  { "id": "car-025", "modelKey": "changan-alsvin-2024", "branchId": "north-rafha", "license_plate": "أ خ و 322", "available": true, "status": "available" },
  { "id": "car-027", "modelKey": "geely-emgrand-2026", "branchId": "north-turaif", "license_plate": "هـ ز ي 258", "available": true, "status": "available" },
  { "id": "car-032", "modelKey": "geely-gx3pro-2025", "branchId": "ryd-airport-t1", "license_plate": "ق ز ل 777", "available": false, "status": "maintenance" },
  { "id": "car-039", "modelKey": "geely-okavango-2025", "branchId": "dmm-thuqba", "license_plate": "ح ق ذ 842", "available": true, "status": "available" },
  { "id": "car-040", "modelKey": "geely-gx3pro-2026", "branchId": "north-arar", "license_plate": "ب أ خ 268", "available": true, "status": "available" },
  { "id": "car-053", "modelKey": "hyundai-i10-2025", "branchId": "ryd-airport-t3", "license_plate": "ع غ ب 590", "available": true, "status": "available" },
  { "id": "car-065", "modelKey": "changan-uni-t-2023", "branchId": "north-turaif", "license_plate": "ب ظ غ 319", "available": true, "status": "available" },
  { "id": "car-087", "modelKey": "hyundai-azera-2025", "branchId": "ryd-masif", "license_plate": "ح ط ذ 107", "available": true, "status": "available" },
  { "id": "car-100", "modelKey": "geely-preface-2026", "branchId": "north-jouf-airport", "license_plate": "ذ ق ب 984", "available": true, "status": "available" },
  { "id": "car-101", "modelKey": "ford-taurus-2025", "branchId": "north-rafha", "license_plate": "ع ث هـ 237", "available": true, "status": "available" },
  { "id": "car-102", "modelKey": "toyota-camry-2025", "branchId": "north-rafha-airport", "license_plate": "ب ش ح 328", "available": true, "status": "available" },
  { "id": "car-111", "modelKey": "changan-uni-k-2025", "branchId": "ryd-airport-t4", "license_plate": "ر ث ق 926", "available": true, "status": "available" },
  { "id": "car-117", "modelKey": "changan-cs35-2023", "branchId": "north-arar-airport", "license_plate": "ي ت خ 361", "available": true, "status": "available" },
  { "id": "car-139", "modelKey": "changan-uni-v-2024", "branchId": "north-rafha", "license_plate": "ف هـ ظ 797", "available": true, "status": "available" },
  { "id": "car-156", "modelKey": "nissan-sunny-2022", "branchId": "north-sakaka", "license_plate": "ح ط ذ 107", "available": true, "status": "available" },
  { "id": "car-162", "modelKey": "toyota-yaris-2022", "branchId": "ryd-yarmuk", "license_plate": "ف هـ ظ 797", "available": true, "status": "available" },
  { "id": "car-182", "modelKey": "nissan-sunny-2020", "branchId": "ryd-masif", "license_plate": "ذ خ ط 751", "available": true, "status": "available" },
  { "id": "car-189", "modelKey": "changan-hunter-2023", "branchId": "ryd-north-train", "license_plate": "غ و ق 466", "available": true, "status": "available" },
  { "id": "car-196", "modelKey": "changan-uni-k-2023", "branchId": "north-rafha", "license_plate": "ف ق ذ 649", "available": true, "status": "available" }
];

export const USERS: User[] = [
    { id: 'user-head-admin', name: 'المدير العام', email: 'head@masarat.com', role: UserRole.HeadAdmin },
    { id: 'user-branch-admin', name: 'مدير فرع المصيف', email: 'branch@masarat.com', role: UserRole.BranchAdmin, branchId: 'ryd-masif' },
    { id: 'user-operator', name: 'موظف فرع المصيف', email: 'operator@masarat.com', role: UserRole.Operator, branchId: 'ryd-masif' },
    { id: 'user-customer', name: 'عميل تجريبي', email: 'customer@test.com', role: UserRole.Customer },
];

// This is a placeholder and will be replaced by a real booking system
export const BOOKINGS: Booking[] = [];

export const AUDIT_LOGS: AuditLog[] = [
    { id: 'log-01', user: 'head@masarat.com', action: 'تعديل سعر', details: 'تغيير سعر تويوتا كامري إلى 260 ريال/يوم', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'log-02', user: 'branch@masarat.com', action: 'إلغاء تفعيل سيارة', details: 'إلغاء تفعيل فورد إكسبلورر للصيانة', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: 'log-03', user: 'head@masarat.com', action: 'تطبيق خصم', details: 'تطبيق خصم 10% على فئة سيارات SUV', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'log-04', user: 'branch@masarat.com', action: 'تأكيد حجز', details: 'تأكيد حجز #booking-02', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

export const E_BRANCH_VISIBLE_REGIONS: string[] = [
  'الرياض',
  'المنطقة الشرقية',
  'المنطقة الشمالية',
];