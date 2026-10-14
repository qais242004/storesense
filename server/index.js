require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.send('StoreSense is ready to grow');
});

app.use('/api/products', productRoutes);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});