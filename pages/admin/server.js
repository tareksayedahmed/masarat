import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// إنشاء قاعدة البيانات
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// إنشاء الجداول إذا لم تكن موجودة
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS logins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    date TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT,
    userId TEXT,
    date TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )`);
});

// endpoint بسيط
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// تسجيل الدخول (مع حفظ البيانات في قاعدة البيانات)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const date = new Date().toISOString();

  db.run(`INSERT INTO logins (username, password, date) VALUES (?, ?, ?)`, [username, password, date], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في حفظ البيانات' });
    }

    if (username === 'admin' && password === '1234') {
      res.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    } else {
      res.status(401).json({ success: false, message: 'بيانات غير صحيحة' });
    }
  });
});

// استخراج بيانات تسجيل الدخول
app.get('/api/logins', (req, res) => {
  db.all(`SELECT * FROM logins`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في استرجاع البيانات' });
    }
    res.json(rows);
  });
});

// حجز سيارة (مع حفظ البيانات في قاعدة البيانات)
app.post('/api/book', (req, res) => {
  const { carId, userId, date } = req.body;
  const createdAt = new Date().toISOString();

  db.run(`INSERT INTO bookings (carId, userId, date, createdAt) VALUES (?, ?, ?, ?)`, [carId, userId, date, createdAt], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في حفظ الحجز' });
    }
    res.json({ success: true, message: 'تم الحجز بنجاح', data: { id: this.lastID, carId, userId, date } });
  });
});

// استخراج بيانات الحجوزات
app.get('/api/bookings', (req, res) => {
  db.all(`SELECT * FROM bookings`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في استرجاع البيانات' });
    }
    res.json(rows);
  });
});

// تعديل حجز سيارة
app.put('/api/bookings/:id', (req, res) => {
  const { carId, userId, date } = req.body;
  const updatedAt = new Date().toISOString();
  const id = req.params.id;

  db.run(`UPDATE bookings SET carId = ?, userId = ?, date = ?, updatedAt = ? WHERE id = ?`, [carId, userId, date, updatedAt, id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في التعديل' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
    }
    res.json({ success: true, message: 'تم التعديل بنجاح' });
  });
});

// حذف حجز سيارة
app.delete('/api/bookings/:id', (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM bookings WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في الحذف' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
    }
    res.json({ success: true, message: 'تم الحذف بنجاح' });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
