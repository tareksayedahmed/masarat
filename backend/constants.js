const BRANCHES = [
  { id: 'e-branch', name: 'الفرع الالكتروني', region: 'عبر الإنترنت', workingHours: '24 ساعة', phone: '920000000' },
  { id: 'ryd-yarmuk', name: 'اليرموك', region: 'الرياض', workingHours: '09:00 ص - 11:00 م', phone: '920012345', lat: 24.8118, lng: 46.7801 },
  // ... other branches
];

const CAR_MODELS = [
  { "key": "toyota-raize-2023", "make": "تويوتا", "model": "رايز", "year": 2023, "category": "SUV", "daily_price": 412, "weekly_price": 2680, "monthly_price": 10300, "images": ["https://i.postimg.cc/q737V4Q2/toyota-raize.jpg"] },
  // ... other car models
];

const CARS = [
  { "id": "car-010", "modelKey": "toyota-raize-2023", "branchId": "ryd-yarmuk", "license_plate": "ر ق غ 856", "available": true, "status": "available" },
  // ... other cars
];

module.exports = {
    BRANCHES,
    CAR_MODELS,
    CARS
};
