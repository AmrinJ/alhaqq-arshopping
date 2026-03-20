const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./db');
// ...
connectDB();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', express.static(path.join(__dirname, 'public/products')));


app.get('/', (req, res) => {
  res.send('AR Shopping Platform API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AR Shopping Platform API is running' });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});