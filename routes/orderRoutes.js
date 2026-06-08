const express = require('express');
const { createOrder, getAllOrders, getOrderById } = require('../controllers/orderController');
const router = express.Router();

// Cổng thanh toán / tạo đơn hàng
router.post('/checkout', createOrder);

// Quản lý đơn hàng
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;