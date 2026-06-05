const express = require('express');
const {
  getDiscountedProducts,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  calculateCartTotal,
} = require('../controllers/productController');

const router = express.Router();

// Route: Lấy sản phẩm đang giảm giá
router.get('/discounted', getDiscountedProducts);

// Route: Lấy tất cả sản phẩm
router.get('/', getAllProducts);

// Route: Tạo sản phẩm mới
router.post('/', createProduct);

// Route: Cập nhật sản phẩm
router.put('/:id', updateProduct);

// Route: Xóa sản phẩm
router.delete('/:id', deleteProduct);

// Route: Tính tổng tiền giỏ hàng (cho thanh toán)
router.post('/calculate/cart-total', calculateCartTotal);

module.exports = router;
