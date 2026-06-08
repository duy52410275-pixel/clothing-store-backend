const Product = require('../models/productModel');

// 1. Lấy danh sách sản phẩm đang giảm giá (is_sale = true)
const getDiscountedProducts = async (req, res) => {
  try {
    const products = await Product.find({ is_sale: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sản phẩm giảm giá thành công',
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm',
      error: error.message,
    });
  }
};

// 2. Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tất cả sản phẩm thành công',
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm',
      error: error.message,
    });
  }
};

// 3. Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const { name, original_price, discount_percent } = req.body;

    // Validation
    if (!name || !original_price) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm và giá gốc là bắt buộc',
      });
    }

    const product = await Product.create({
      name,
      original_price,
      discount_percent: discount_percent || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi tạo sản phẩm',
      error: error.message,
    });
  }
};

// 4. Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, original_price, discount_percent } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { name, original_price, discount_percent },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật sản phẩm',
      error: error.message,
    });
  }
};

// 5. Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm',
      error: error.message,
    });
  }
};


const calculateCartTotal = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống hoặc không hợp lệ',
      });
    }

    let final_total = 0;
    const cartDetails = [];

    for (const item of cartItems) {
      const { product_id, quantity } = item;

      // Kiểm tra dữ liệu đầu vào
      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu giỏ hàng không hợp lệ',
        });
      }

      // Tìm sản phẩm từ database
      const product = await Product.findById(product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Sản phẩm với ID ${product_id} không tìm thấy`,
        });
      }

      // Tính giá cho từng sản phẩm (sử dụng sale_price đã tính)
      const itemTotal = product.sale_price * quantity;
      final_total += itemTotal;

      cartDetails.push({
        product_id: product._id,
        product_name: product.name,
        original_price: product.original_price,
        discount_percent: product.discount_percent,
        sale_price: product.sale_price,
        quantity: quantity,
        item_total: itemTotal,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tính tổng tiền giỏ hàng thành công',
      cart_details: cartDetails,
      final_total: parseFloat(final_total.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tính tổng tiền',
      error: error.message,
    });
  }
};

module.exports = {
  getDiscountedProducts,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  calculateCartTotal,
};
