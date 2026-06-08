const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// 1. Tạo đơn hàng mới (Thanh toán)
const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_phone, shipping_address, cartItems, payment_method } = req.body;

    // Validation cơ bản thông tin khách hàng
    if (!customer_name || !customer_phone || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin giao hàng'
      });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống hoặc không hợp lệ'
      });
    }

    let final_total = 0;
    const orderItems = [];

    // Duyệt qua giỏ hàng để tính toán lại giá từ DB (Tránh client giả mạo giá tiền)
    for (const item of cartItems) {
      const { product_id, quantity } = item;

      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu sản phẩm trong giỏ hàng không hợp lệ'
        });
      }

      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Sản phẩm với ID ${product_id} không tồn tại`
        });
      }

      const itemTotal = product.sale_price * quantity;
      final_total += itemTotal;

      orderItems.push({
        product_id: product._id,
        product_name: product.name,
        price: product.sale_price, // Lưu lại giá bán lúc mua
        quantity: quantity,
        item_total: itemTotal
      });
    }

    // Tạo đơn hàng lưu vào database
    const newOrder = await Order.create({
      customer_name,
      customer_phone,
      shipping_address,
      cart_items: orderItems,
      final_total: parseFloat(final_total.toFixed(2)),
      payment_method: payment_method || 'COD'
    });

    res.status(201).json({
      success: true,
      message: 'Đặt đơn hàng thành công! Cảm ơn bạn đã mua sắm.',
      data: newOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi xử lý thanh toán',
      error: error.message
    });
  }
};

// 2. Lấy danh sách lịch sử đơn hàng (Cho Admin hoặc xem lịch sử)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng',
      error: error.message
    });
  }
};

// 3. Lấy chi tiết một đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById
};