const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true // Đây là sale_price tại thời điểm mua
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Số lượng phải lớn hơn 0']
  },
  item_total: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: [true, 'Vui lòng nhập tên khách hàng'],
      trim: true
    },
    customer_phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại']
    },
    shipping_address: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ giao hàng']
    },
    cart_items: [orderItemSchema],
    final_total: {
      type: Number,
      required: true,
      default: 0
    },
    payment_method: {
      type: String,
      enum: ['COD', 'BANK_TRANSFER'],
      default: 'COD'
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;