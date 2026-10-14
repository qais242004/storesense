require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const salesRoutes = require('./routes/sales');

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.send('StoreSense is ready to grow');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});