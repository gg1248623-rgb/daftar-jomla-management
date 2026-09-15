const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number,
  }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['مسودة', 'مرسلة', 'مدفوعة', 'ملغاة'],
    default: 'مسودة',
  },
  dueDate: Date,
  issueDate: {
    type: Date,
    default: Date.now,
  },
  paidDate: Date,
  notes: String,
});

module.exports = mongoose.model('Invoice', invoiceSchema);
