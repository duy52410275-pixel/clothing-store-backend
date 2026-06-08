const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Cấu hình đọc file môi trường .env
dotenv.config();

// Kết nối vào cơ sở dữ liệu MongoDB
connectDB();

const app = express();

// Cho phép Server đọc dữ liệu dạng JSON gửi lên từ Frontend
app.use(express.json());

// 1. KẾT NỐI API GIẢM GIÁ CỦA DUY
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// 2. KẾT NỐI API THANH TOÁN CỦA THIỆN
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Cấu hình Cổng chạy cho Server Backend (Mặc định là 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy cực mượt tại cổng: ${PORT}`);
});
