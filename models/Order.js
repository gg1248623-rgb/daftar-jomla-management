const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customer: {
    name: String,
    phone: String,
    email: String,
    address: String,
  },
  products: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    total: Number,
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['معلق', 'مكتمل', 'ملغى', 'قيد الشحن'],
    default: 'معلق',
  },
  paymentStatus: {
    type: String,
    enum: ['غير مدفوع', 'مدفوع جزئياً', 'مدفوع بالكامل'],
    default: 'غير مدفوع',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
