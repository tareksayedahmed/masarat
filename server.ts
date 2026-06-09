import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
const STATE = {
  users: [
    {
      id: "usr-1",
      name: "أحمد المدير العام",
      email: "admin@masarat.com",
      password: "admin123",
      phone: "+966501234567",
      role: "head_admin",
      licenseNumber: "DL-112233",
    },
    {
      id: "usr-2",
      name: "سعود الحربي",
      email: "branch@masarat.com",
      password: "branch123",
      phone: "+966502234567",
      role: "branch_admin",
      branchId: "branch-1",
    },
    {
      id: "usr-3",
      name: "محمد العتيبي",
      email: "op@masarat.com",
      password: "op123",
      phone: "+966503234567",
      role: "operator",
      branchId: "branch-1",
    },
    {
      id: "usr-4",
      name: "خالد الدوسري",
      email: "customer@masarat.com",
      password: "customer123",
      phone: "+966504234567",
      role: "customer",
      licenseNumber: "DL-445566",
    }
  ],
  branches: [
    { id: "branch-1", name: "فرع الرياض - مطار الملك خالد الدولي", city: "الرياض", address: "مطار الملك خالد الدولي، صالة 3", phone: "+966112223333", lat: 24.9575, lng: 46.7025 },
    { id: "branch-2", name: "فرع جدة - طريق الملك عبد العزيز", city: "جدة", address: "طريق الملك عبد العزيز، الشاطئ", phone: "+966124445555", lat: 21.5433, lng: 39.1728 },
    { id: "branch-3", name: "فرع الدمام - شارع الكورنيش", city: "الدمام", address: "حي الكورنيش، طريق الخليج", phone: "+966138889999", lat: 26.4344, lng: 50.1035 }
  ],
  carModels: [
    {
      id: "model-1",
      name: "إلنترا (Elantra)",
      brand: "هيونداي (Hyundai)",
      type: "sedan",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 5,
      pricePerDay: 160,
      pricePerWeek: 140,
      pricePerMonth: 125,
      imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600",
      features: ["بلوتوث", "حساسات خلفية", "مدخل USB", "مثبت سرعة"]
    },
    {
      id: "model-2",
      name: "كامري (Camry)",
      brand: "تويوتا (Toyota)",
      type: "sedan",
      transmission: "automatic",
      fuelType: "hybrid",
      seats: 5,
      pricePerDay: 240,
      pricePerWeek: 210,
      pricePerMonth: 180,
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600",
      features: ["شاشة لمس", "فتحة سقف", "حساسات أمامية وخلفية", "كاميرا خلفية"]
    },
    {
      id: "model-3",
      name: "لاند كروزر (Land Cruiser)",
      brand: "تويوتا (Toyota)",
      type: "suv",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 7,
      pricePerDay: 950,
      pricePerWeek: 850,
      pricePerMonth: 720,
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
      features: ["دفع رباعي", "ثلاجة داخلية", "نظام خرائط", "مقاعد جلد", "شاشات خلفية"]
    },
    {
      id: "model-4",
      name: "موديل واي (Model Y)",
      brand: "تسلا (Tesla)",
      type: "luxury",
      transmission: "automatic",
      fuelType: "electric",
      seats: 5,
      pricePerDay: 600,
      pricePerWeek: 520,
      pricePerMonth: 440,
      imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600", // Fallback luxury
      features: ["لوحة تحكم ذكية", "أوتوبيلوت", "تسارع فائق", "سقف بانورامي"]
    },
    {
      id: "model-5",
      name: "بيكانتو (Picanto)",
      brand: "كيا (Kia)",
      type: "economy",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 4,
      pricePerDay: 110,
      pricePerWeek: 95,
      pricePerMonth: 80,
      imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600",
      features: ["اقتصادية جداً", "سهلة الصف", "بلوتوث"]
    },
    {
      id: "model-6",
      name: "911 كاريرا (911 Carrera)",
      brand: "بورش (Porsche)",
      type: "sports",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 2,
      pricePerDay: 2600,
      pricePerWeek: 2300,
      pricePerMonth: 1950,
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
      features: ["محرك توربو", "وضعيات قيادة رياضية", "سقف مكشوف", "صوت عادم رياضي"]
    }
  ],
  cars: [
    { id: "car-1", modelId: "model-1", plateNumber: "أ ب ج 1234", color: "أبيض", year: 2024, status: "available", branchId: "branch-1", mileage: 12500, lastServiceDate: "2026-04-15" },
    { id: "car-2", modelId: "model-1", plateNumber: "د ر س 5678", color: "فضي", year: 2023, status: "rented", branchId: "branch-1", mileage: 45000, lastServiceDate: "2026-03-20" },
    { id: "car-3", modelId: "model-2", plateNumber: "ط ي ر 9999", color: "أسود", year: 2024, status: "available", branchId: "branch-1", mileage: 8200, lastServiceDate: "2026-05-10" },
    { id: "car-4", modelId: "model-2", plateNumber: "ع ك د 4321", color: "أبيض لؤلؤي", year: 2024, status: "available", branchId: "branch-2", mileage: 15400, lastServiceDate: "2026-04-18" },
    { id: "car-5", modelId: "model-3", plateNumber: "ح م ر 5555", color: "رمادي غامق", year: 2023, status: "available", branchId: "branch-1", mileage: 33000, lastServiceDate: "2026-02-12" },
    { id: "car-6", modelId: "model-3", plateNumber: "س ن د 7777", color: "أبيض", year: 2024, status: "maintenance", branchId: "branch-3", mileage: 22100, lastServiceDate: "2026-05-25" },
    { id: "car-7", modelId: "model-4", plateNumber: "م ك ت 8888", color: "أحمر", year: 2024, status: "available", branchId: "branch-2", mileage: 5000, lastServiceDate: "2026-05-01" },
    { id: "car-8", modelId: "model-5", plateNumber: "و ر د 1111", color: "أبيض", year: 2023, status: "available", branchId: "branch-2", mileage: 28000, lastServiceDate: "2026-04-05" },
    { id: "car-9", modelId: "model-5", plateNumber: "ن ص ر 3333", color: "أسود", year: 2024, status: "available", branchId: "branch-3", mileage: 12000, lastServiceDate: "2026-05-14" },
    { id: "car-10", modelId: "model-6", plateNumber: "ل م ج 2222", color: "أزرق", year: 2023, status: "available", branchId: "branch-3", mileage: 19500, lastServiceDate: "2026-04-22" }
  ],
  bookings: [
    {
      id: "bkg-101",
      userId: "usr-4",
      userName: "خالد الدوسري",
      userPhone: "+966504234567",
      carId: "car-2",
      carName: "هيونداي (Hyundai) إلنترا (Elantra)",
      carImage: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600",
      startDate: "2026-06-05",
      endDate: "2026-06-12",
      status: "approved",
      totalPrice: 1288, // 160 * 7 days + tax/fees
      pickupBranchId: "branch-1",
      pickupBranchName: "فرع الرياض - مطار الملك خالد الدولي",
      dropoffBranchId: "branch-1",
      dropoffBranchName: "فرع الرياض - مطار الملك خالد الدولي",
      paymentStatus: "paid",
      createdAt: "2026-06-04T12:00:00Z"
    },
    {
      id: "bkg-102",
      userId: "usr-4",
      userName: "خالد الدوسري",
      userPhone: "+966504234567",
      carId: "car-3",
      carName: "تويوتا (Toyota) كامري (Camry)",
      carImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600",
      startDate: "2026-05-10",
      endDate: "2026-05-13",
      status: "completed",
      totalPrice: 828, // 240 * 3 days + VAT
      pickupBranchId: "branch-1",
      pickupBranchName: "فرع الرياض - مطار الملك خالد الدولي",
      dropoffBranchId: "branch-1",
      dropoffBranchName: "فرع الرياض - مطار الملك خالد الدولي",
      paymentStatus: "paid",
      createdAt: "2026-05-09T09:30:00Z"
    }
  ],
  logs: [
    { id: "log-1", timestamp: "2026-06-07T10:00:00Z", userId: "usr-1", userName: "أحمد المدير العام", action: "تسجيل دخول", details: "نجاح تسجيل دخول المدير العام للنظام", ipAddress: "192.168.1.1" },
    { id: "log-2", timestamp: "2026-06-07T12:15:00Z", userId: "usr-2", userName: "سعود الحربي", action: "تعديل حالة سيارة", details: "تعديل حالة بورش 911 كاريرا إلى متوفرة", ipAddress: "192.168.1.2" }
  ],
  pricingRules: [
    { id: "rule-1", modelId: "model-3", seasonName: "موسم الرياض", multiplier: 1.25, startDate: "2026-10-01", endDate: "2027-03-31" },
    { id: "rule-2", modelId: "model-6", seasonName: "إجازة الصيف", multiplier: 1.15, startDate: "2026-06-15", endDate: "2026-08-31" }
  ],
  settings: {
    rentalTax: 15,
    insuranceFeePerDay: 35,
    allowIntercityDropoff: true,
    intercityFee: 150,
    requireLicenseVerification: true,
    minBookingDays: 1
  }
};

// HELPER: Write Log entry
const writeLog = (userId: string, userName: string, action: string, details: string, ip: string = "127.0.0.1") => {
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    details,
    ipAddress: ip
  };
  STATE.logs.unshift(newLog);
  if (STATE.logs.length > 100) STATE.logs.pop(); // Keep last 100
};

// --- API AUTH --
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = STATE.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
  }
  writeLog(user.id, user.name, "تسجيل دخول", `سجل ${user.name} الدخول في النظام`);
  // Remove password before sending
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token: `mock-jwt-token-for-${user.id}`, user: userWithoutPassword });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, licenseNumber } = req.body;
  if (STATE.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: "البريد الإلكتروني مسجل بالفعل" });
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
    phone,
    licenseNumber,
    role: "customer" as any
  };
  STATE.users.push(newUser);
  writeLog(newUser.id, newUser.name, "تسجيل حساب جديد", `تم إنشاء حساب لـ ${newUser.name}`);
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ token: `mock-jwt-token-for-${newUser.id}`, user: userWithoutPassword });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "غير مصرح" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("mock-jwt-token-for-", "");
  const user = STATE.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ message: "المستخدم غير موجود" });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// --- API BRANCHES ---
app.get("/api/branches", (req, res) => {
  res.json(STATE.branches);
});

// --- API CAR MODELS ---
app.get("/api/car-models", (req, res) => {
  res.json(STATE.carModels);
});

app.put("/api/car-models/:id", (req, res) => {
  const { id } = req.params;
  const { pricePerDay, pricePerWeek, pricePerMonth } = req.body;
  const modelIndex = STATE.carModels.findIndex(m => m.id === id);
  if (modelIndex > -1) {
    STATE.carModels[modelIndex] = {
      ...STATE.carModels[modelIndex],
      pricePerDay: parseFloat(pricePerDay) || STATE.carModels[modelIndex].pricePerDay,
      pricePerWeek: pricePerWeek !== undefined ? parseFloat(pricePerWeek) : STATE.carModels[modelIndex].pricePerWeek,
      pricePerMonth: pricePerMonth !== undefined ? parseFloat(pricePerMonth) : STATE.carModels[modelIndex].pricePerMonth,
    };
    writeLog("system", "النظام", "تعديل تفاصيل باقات التسعير", `تعديل الأسعار لموديل ${STATE.carModels[modelIndex].brand} ${STATE.carModels[modelIndex].name}`);
    res.json(STATE.carModels[modelIndex]);
  } else {
    res.status(404).json({ error: "Model not found" });
  }
});

// --- API CARS (FLEET) ---
app.get("/api/cars", (req, res) => {
  res.json(STATE.cars);
});

app.post("/api/cars", (req, res) => {
  const { modelId, plateNumber, color, year, branchId, mileage } = req.body;
  const newCar = {
    id: `car-${Date.now()}`,
    modelId,
    plateNumber,
    color,
    year: parseInt(year) || 2024,
    status: "available" as const,
    branchId,
    mileage: parseInt(mileage) || 0,
    lastServiceDate: new Date().toISOString().split("T")[0]
  };
  STATE.cars.push(newCar);
  writeLog("system", "النظام", "إضافة سيارة للأسطول", `تمت إضافة سيارة لوحة ${plateNumber} للفرع ${branchId}`);
  res.status(201).json(newCar);
});

app.put("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const index = STATE.cars.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ message: "السيارة غير موجودة" });
  STATE.cars[index] = { ...STATE.cars[index], ...req.body };
  writeLog("system", "النظام", "تحديث بيانات السيارة", `تحديث بيانات السيارة ${id}`);
  res.json(STATE.cars[index]);
});

app.delete("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  STATE.cars = STATE.cars.filter(c => c.id !== id);
  writeLog("system", "النظام", "حذف سيارة", `حذف السيارة رقم ${id} من الأسطول`);
  res.json({ success: true });
});

// --- API BOOKINGS ---
app.get("/api/bookings", (req, res) => {
  res.json(STATE.bookings);
});

app.post("/api/bookings", (req, res) => {
  const { 
    userId, 
    carModelId, 
    startDate, 
    endDate, 
    pickupBranchId, 
    dropoffBranchId, 
    pickupBranchName, 
    dropoffBranchName, 
    totalPrice,
    licenseImage,
    idCardImage,
    paymentMethod,
    paymentStatus
  } = req.body;
  
  const user = STATE.users.find(u => u.id === userId);
  const model = STATE.carModels.find(m => m.id === carModelId);

  // Find an available physical car for this model in the pickup branch
  const physicalCar = STATE.cars.find(c => c.modelId === carModelId && c.status === "available" && c.branchId === pickupBranchId);
  const carId = physicalCar ? physicalCar.id : STATE.cars.find(c => c.modelId === carModelId)?.id || "unknown";

  const newBooking = {
    id: `bkg-${Math.floor(100000 + Math.random() * 900000)}`,
    userId,
    userName: user ? user.name : "عميل مسارات",
    userPhone: user ? user.phone : "",
    carId,
    carName: model ? `${model.brand} ${model.name}` : "سيارة نموذج",
    carImage: model ? model.imageUrl : "",
    startDate,
    endDate,
    status: "pending" as const,
    totalPrice: totalPrice,
    pickupBranchId,
    pickupBranchName,
    dropoffBranchId,
    dropoffBranchName,
    paymentStatus: paymentStatus || ("unpaid" as const),
    licenseImage,
    idCardImage,
    paymentMethod: paymentMethod || "cash",
    createdAt: new Date().toISOString()
  };

  if (physicalCar) {
    // Soft reserve it during pending/approval
    physicalCar.status = "available"; // Still searchable but marked in log
  }

  STATE.bookings.unshift(newBooking);
  writeLog(userId, user ? user.name : "عميل", "طلب حجز جديد", `طلب حجز سيارة ${newBooking.carName}`);
  res.status(201).json(newBooking);
});

app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status, carId, paymentStatus } = req.body;
  const index = STATE.bookings.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ message: "الحجز غير موجود" });

  const currentBooking = STATE.bookings[index];
  const oldStatus = currentBooking.status;

  STATE.bookings[index] = { ...currentBooking, ...req.body };

  // Sync physical car status when booking changes
  if (status === "approved" || status === "completed" || status === "cancelled" || status === "rejected") {
    const targetCarId = carId || currentBooking.carId;
    const car = STATE.cars.find(c => c.id === targetCarId);
    if (car) {
      if (status === "approved") {
        car.status = "rented";
      } else if (status === "completed" || status === "cancelled" || status === "rejected") {
        car.status = "available";
        // Update mileage randomly for realism on completion
        if (status === "completed") {
          car.mileage += Math.floor(Math.random() * 400) + 100;
        }
      }
    }
  }

  writeLog("system", "النظام", "تحديث حالة الحجز", `تعديل الحجز رقم ${id} من ${oldStatus} إلى ${status}`);
  res.json(STATE.bookings[index]);
});

// --- API PRICING RULES ---
app.get("/api/pricing-rules", (req, res) => {
  res.json(STATE.pricingRules);
});

app.post("/api/pricing-rules", (req, res) => {
  const { modelId, seasonName, multiplier, startDate, endDate } = req.body;
  const newRule = {
    id: `rule-${Date.now()}`,
    modelId,
    seasonName,
    multiplier: parseFloat(multiplier) || 1.0,
    startDate,
    endDate
  };
  STATE.pricingRules.push(newRule);
  res.status(201).json(newRule);
});

app.delete("/api/pricing-rules/:id", (req, res) => {
  const { id } = req.params;
  STATE.pricingRules = STATE.pricingRules.filter(r => r.id !== id);
  res.json({ success: true });
});

// --- API LOGS ---
app.get("/api/logs", (req, res) => {
  res.json(STATE.logs);
});

// --- API SETTINGS ---
app.get("/api/settings", (req, res) => {
  res.json(STATE.settings);
});

app.post("/api/settings", (req, res) => {
  STATE.settings = { ...STATE.settings, ...req.body };
  writeLog("system", "النظام", "تحديث الإعدادات", "تحديث إعدادات النظام الإدارية والمالية");
  res.json(STATE.settings);
});

// --- API REPORTS (ANALYTICS) ---
app.get("/api/reports", (req, res) => {
  // Generate real stats dynamically from states
  const totalB = STATE.bookings.length;
  const activeRentalCount = STATE.cars.filter(c => c.status === "rented").length;
  const maintenanceCount = STATE.cars.filter(c => c.status === "maintenance").length;
  const totalRevenueAmt = STATE.bookings
    .filter(b => b.status === "approved" || b.status === "completed")
    .reduce((acc, b) => acc + b.totalPrice, 0);

  // Revenue by Branch
  const revenueByBranch = STATE.branches.map(b => {
    const branchB = STATE.bookings.filter(bk => bk.pickupBranchId === b.id && (bk.status === "approved" || bk.status === "completed"));
    const amt = branchB.reduce((acc, bk) => acc + bk.totalPrice, 0);
    return { name: b.name.replace("فرع ", ""), value: amt };
  });

  // Rentals by Category
  const categoryUsage = [
    { name: "سيدان (Sedan)", value: STATE.bookings.filter(b => b.carName.includes("إلنترا") || b.carName.includes("كامري")).length },
    { name: "عائلية (SUV)", value: STATE.bookings.filter(b => b.carName.includes("اند كروزر") || b.carName.includes("موديل واي")).length },
    { name: "اقتصادية (Economy)", value: STATE.bookings.filter(b => b.carName.includes("بيكانتو")).length },
    { name: "رياضية (Sports)", value: STATE.bookings.filter(b => b.carName.includes("911")).length },
  ];

  res.json({
    totalBookingsCount: totalB,
    activeRentals: activeRentalCount,
    maintenanceCars: maintenanceCount,
    totalRevenue: totalRevenueAmt,
    revenueByBranch,
    categoryUsage,
  });
});

// --- AI CHATBOT ASSISTANT (Gemini proxy server-side) ---
app.post("/api/ai-chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. Falling back to default script response.");
    return res.json({
      reply: "أهلاً بك في مسارات! نأسف، نظام المساعد الذكي غير مكون حالياً بمفتاح API ولكن يسعدني إخبارك أننا نوفر أحدث طرازات السيارات مثل تويوتا لاند كروزر وهيونداي إلنترا وبورش وكامري بأسعار يومية متميزة. كيف يمكنني خدمتك اليوم؟"
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const userMsg = messages[messages.length - 1];
    
    // Construct system instructions with context about Masarat fleet and branches
    const systemInstruction = 
      "أنت المساعد الذكي التفاعلي لشركة 'مسارات لتأجير السيارات' (Masarat Car Rental). " +
      "أجب بلباقة ولطف باللغة العربية واعرض خدماتنا. " +
      "معلوماتنا المتوفرة: " +
      "الفروع: لدينا 3 فروع رئيسية حالياً: فرع الرياض في مطار الملك خالد الدولي، فرع جدة في طريق الملك عبد العزيز، وفرع الدمام في حي الكورنيش. " +
      "الأسطول: نوفر سيارات اقتصادية (كيا بيكانتو بـ 110 ريال)، عائلية (تويوتا لاندكروزر بـ 950 ريال، بورش 911 كاريرا بـ 2600 ريال، بورش الرياضية المذهلة، تويوتا كامري الهجينة بـ 2400 ريال، هيونداي إلنترا 160 ريال، تسلا موديل واي الكهربائي بـ 600 ريال). " +
      "تأكد أن إجاباتك مختصرة ومريحة، ولا تعرض أي كود برمجي أو نصوص غريبة. قدم نصائح حول اختيار السيارة والسفر في المملكة العربية السعودية.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userMsg.content,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "لم أستطع معالجة طلبك حالياً.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error.message);
    res.json({
      reply: "أهلاً بك! الذكاء الاصطناعي يواجه ضغطاً خفيفاً حالياً، ولكن يسعدني إرشادك: يمكنك تصفح فرع الرياض أو فرع جدة واختيار بيكانتو، إلنترا، كامري، بورش أو لاند كروزر وبدء رحلتك الدافئة فور النقر على زر احجز الآن!"
    });
  }
});

// --- VITE MIDDLEWARE INTERFACE FOR FULL-STACK DEPLOYMENT ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
