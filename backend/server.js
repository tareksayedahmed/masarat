const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => res.json({ message: "Welcome to Masarat API" }));

app.get('/test-db', async (req, res) => {
  try {
    const dbStatus = await connectDB();
    res.json(dbStatus);
  } catch (error) {
    res.status(500).json({ message: "Failed to connect to MongoDB", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
