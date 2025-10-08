import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// دالة لحفظ البيانات في ملف
function saveToFile(filename, data) {
  let arr = [];
  try {
    arr = JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch {
    arr = [];
  }
  arr.push(data);
  fs.writeFileSync(filename, JSON.stringify(arr, null, 2));
}

// endpoint بسيط
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// تسجيل الدخول (مع حفظ البيانات في logins.json)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const loginData = { username, password, date: new Date().toISOString() };
  saveToFile('logins.json', loginData);

  if (username === 'admin' && password === '1234') {
    res.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
  } else {
    res.status(401).json({ success: false, message: 'بيانات غير صحيحة' });
  }
});

// استخراج بيانات تسجيل الدخول
app.get('/api/logins', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('logins.json', 'utf8'));
    res.json(data);
  } catch {
    res.json([]);
  }
});

// حجز سيارة (مع حفظ البيانات في bookings.json)
app.post('/api/book', (req, res) => {
  const { carId, userId, date } = req.body;
  const bookingData = { carId, userId, date, createdAt: new Date().toISOString() };
  saveToFile('bookings.json', bookingData);

  res.json({ success: true, message: 'تم الحجز بنجاح', data: { carId, userId, date } });
});

// استخراج بيانات الحجوزات
app.get('/api/bookings', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('bookings.json', 'utf8'));
    res.json(data);
  } catch {
    res.json([]);
  }
});

// تعديل حجز سيارة
app.put('/api/bookings/:index', (req, res) => {
  const { carId, userId, date } = req.body;
  try {
    let bookings = JSON.parse(fs.readFileSync('bookings.json', 'utf8'));
    const idx = parseInt(req.params.index, 10);
    if (bookings[idx]) {
      bookings[idx] = { ...bookings[idx], carId, userId, date, updatedAt: new Date().toISOString() };
      fs.writeFileSync('bookings.json', JSON.stringify(bookings, null, 2));
      res.json({ success: true, message: 'تم التعديل بنجاح', data: bookings[idx] });
    } else {
      res.status(404).json({ success: false, message: 'الحجز غير موجود' });
    }
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
});

// حذف حجز سيارة
app.delete('/api/bookings/:index', (req, res) => {
  try {
    let bookings = JSON.parse(fs.readFileSync('bookings.json', 'utf8'));
    const idx = parseInt(req.params.index, 10);
    if (bookings[idx]) {
      const removed = bookings.splice(idx, 1);
      fs.writeFileSync('bookings.json', JSON.stringify(bookings, null, 2));
      res.json({ success: true, message: 'تم الحذف بنجاح', data: removed[0] });
    } else {
      res.status(404).json({ success: false, message: 'الحجز غير موجود' });
    }
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});