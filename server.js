const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// 1. Require các tuyến đường (Routes)
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); 

// 2. Khởi tạo Express app (CHỈ VIẾT DÒNG NÀY 1 LẦN)
const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Kết nối MongoDBPORT=5000
MONGODB_URI
connectDB();

// 5. Sử dụng các Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: '👔 Clothing Store Backend - Discount & Checkout Service',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      discounted_products: '/api/products/discounted',
      calculate_cart: '/api/products/calculate/cart-total',
      checkout: '/api/orders/checkout'
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(' Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tìm thấy',
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` API Documentation: http://localhost:${PORT}`);
});
