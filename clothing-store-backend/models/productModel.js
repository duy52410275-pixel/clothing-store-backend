const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
    },
    original_price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá gốc'],
      min: 0,
    },
    discount_percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    sale_price: {
      type: Number,
      default: 0,
    },
    is_sale: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook: Tính sale_price và cập nhật is_sale
productSchema.pre('save', function (next) {
  // Tính sale_price = original_price * (1 - discount_percent / 100)
  this.sale_price = this.original_price * (1 - this.discount_percent / 100);

  // Nếu discount_percent > 0 thì is_sale = true
  if (this.discount_percent > 0) {
    this.is_sale = true;
  } else {
    this.is_sale = false;
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
